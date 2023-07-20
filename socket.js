import { nanoid } from 'nanoid';
import { EVENTS, CLIENT_EVENTS } from './utils/actions';

// roomMap contains the data related to each room
const roomMap = {}

const roomInitialState = {
    difficulty: 0, status: 0, playersRequired: 3, players: null, roomWaitingTimeout: null
}

// socketToRoomMapping contains the player vs the room assigned to the room
const playerToRoomMapping = {}

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

function assignRoom(room, client) {
    // Make the client join room with given ID
    client.join(room);

    // Notify other members
    // roomMap[room].players.forEach(player => {
    //     player.playerClient.emit()
    // })

    // Add current client as the player in the list
    roomMap[room].players.push({ playerID: client.id, playerClient: client });
    // Reduce the number of players required
    roomMap[room].playersRequired -= 1;

    console.log(`Room with ID ${room} assigned to client with ID ${client.id}`);

    // Mapping the client ID with the room ID
    playerToRoomMapping[client.id] = room;

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
        player.playerClient.emit('error', 'Not enough players to start the room. Please join another room');

        console.log('Not enough players, room deleted', roomMap[room]);
        player.playerClient.disconnect(true);
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
    roomMap[room].roomWaitingTimeout = null;

    console.log('Starting the game');

       
}

function disconnectClient(client) {
    // Get the room ID and then the room associated to the current client
    const roomID = playerToRoomMapping[client.id];
    const room = roomMap[roomID];

    if(!room) return;

    console.log('client ID:', client.id);

    // Removing the current player
    const newArrayOfPlayers = room.players.filter(player => {
        console.log(player.playerID);
        return player.playerID !== client.id
    });
    roomMap[roomID].players = newArrayOfPlayers;

    // Increment one more player once this player disconnects
    room.playersRequired += 1;

    // delete the player to room mapping
    delete playerToRoomMapping[client.id];
    console.log(`Player with ID ${client.id} has left the room`);

    // If the number of players in the room are 0, delete room
    if(newArrayOfPlayers.length === 0) {
        delete roomMap[roomID];
        console.log(`Room with ID ${roomID} deleted. ${roomMap[roomID]}`);
    }
}

function socketInit(io) {
    io.on('connection', (client) => {
        // Get the difficulty from the query
        const difficulty = client.handshake.query.difficulty;

        if(!difficulty) client.emit('error', 'Difficulty required');

        // Find a room for the client
        let room = findRoom(difficulty);

        if(!room) room = createRoom(difficulty); // If no empty room found, create a room
        assignRoom(room, client); // If room is found, assign this room the new player

        // On disconnection, gracefully disconnect the client
        client.on('disconnect', () => {
            disconnectClient(client);
        });
    });
}

export default socketInit;