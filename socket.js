import { nanoid } from 'nanoid';
import { EVENTS, CLIENT_EVENTS } from './utils/actions.js';
import paraGenerator from './utils/paraGenerator.js';

let globalConnection;

// roomMap contains the data related to each room
const roomMap = {}

const roomInitialState = {
    difficulty: 0, status: 0, playersRequired: 3, players: null, roomWaitingTimeout: null
}

// playerToRoomMapping contains the player vs the room assigned to the room
const playerToRoomMapping = {}
// playerToRoomMapping contains the player vs the socket object of the client
const playerToClientMapping = {}

// Function to find a room for the new connected player
function findRoom(difficulty) {
    for(const roomID in roomMap) {
        const roomData = roomMap[roomID];
        // If the room is still waiting for players and the number of players required is more than 0
        if(roomData.status === 0 && roomData.difficulty === difficulty && roomData.playersRequired > 0) {
            return roomID;
        }
    }

    return null;
}

function assignRoom(room, client, username) {
    // Make the client join room with given ID
    client.join(room);

    // Add current client as the player in the list
    roomMap[room].players.push({ username, playerID: client.id });
    // Reduce the number of players required
    roomMap[room].playersRequired -= 1;

    console.log(`Room with ID ${room} assigned to client with ID ${client.id}`);

    // Mapping the client ID with the room ID
    playerToRoomMapping[client.id] = room;

    // Notify other members of the room
    client.to(room).emit(CLIENT_EVENTS.ROOM_JOINED, { username, players: roomMap[room].players })

    // If the room is full, start the game
    if(roomMap[room].playersRequired === 0) {
        // change the state to 1 which means game is being played
        roomMap[room].status = 1;
        startGame(room);
    }
}

function waitingTimeEnds(room) {
    roomMap[room].roomWaitingTimeout = null;

    if(roomMap[room].players.length > 1) {
        startGame(room);
    }
    else {
        const player = roomMap[room].players[0];
        const client = playerToClientMapping[player.playerID];
        client.emit('error', 'Not enough players to start the room. Please join another room');

        console.log('Not enough players, room deleted', roomMap[room]);
        client.disconnect(true);
    }
}

function createRoom(difficulty) {
    // Generate 5 character ID for new Room
    const room = nanoid(5);

    // Create room with unique ID with default state of the room
    roomMap[room] = { ...roomInitialState, difficulty, players: [], roomWaitingTimeout: setTimeout(() => {
        waitingTimeEnds(room);
    }, 60000) };

    console.log(`New Room with id ${room} Created`);
    return room;
}

function startGame(room) {
    clearTimeout(roomMap[room].roomWaitingTimeout);
    
    if(!roomMap[room].roomWaitingTimeout) roomMap[room].roomWaitingTimeout = null;

    // Create paragraph based on difficulty
    const para = paraGenerator(room.difficulty);

    // Send the paragraph to all the players of the room
    globalConnection.to(room).emit(CLIENT_EVENTS.START_GAME, { para, startTime: Date.now() + 10000 });
}

function disconnectClient(client) {
    // Get the room ID and then the room associated to the current client
    const roomID = playerToRoomMapping[client.id];
    const room = roomMap[roomID];

    if(!room) return;

    console.log('client ID:', client.id);

    let playerLeaving;

    // Removing the current player
    const newArrayOfPlayers = room.players.filter(player => {
        if(player.playerID === client.id) playerLeaving = player;
        return player.playerID !== client.id
    });
    roomMap[roomID].players = newArrayOfPlayers;

    // Increment one more player once this player disconnects
    room.playersRequired += 1;

    // delete the player to room mapping
    delete playerToRoomMapping[client.id];
    // delete the player to socket object mapping
    delete playerToClientMapping[client.id];
    
    console.log(`Player with ID ${client.id} has left the room`);

    // Notify the other players of the disconnect
    client.to(roomID).emit(CLIENT_EVENTS.ROOM_LEFT, { username: playerLeaving.username, players: roomMap[roomID].players  })

    // If the number of players in the room are 0, delete room
    if(newArrayOfPlayers.length === 0) {
        delete roomMap[roomID];
        console.log(`Room with ID ${roomID} deleted. ${roomMap[roomID]}`);
    }
}

function socketInit(io) {
    globalConnection = io;

    io.on(EVENTS.JOIN, (client) => {
        // Get the difficulty from the query
        const {difficulty, username} = client.handshake.query;
        playerToClientMapping[client.id] = client;

        if(!difficulty) client.emit('error', 'Difficulty required');

        // Find a room for the client
        let room = findRoom(difficulty);

        if(!room) room = createRoom(difficulty); // If no empty room found, create a room
        assignRoom(room, client, username); // If room is found, assign this room the new player

        // On disconnection, gracefully disconnect the client
        client.on(EVENTS.EXIT, () => {
            disconnectClient(client);
        });
    });
}

export default socketInit;