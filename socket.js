import { nanoid } from 'nanoid';
import { EVENTS, CLIENT_EVENTS } from './utils/actions.js';
import paraGenerator from './utils/paraGenerator.js';

let globalConnection;

// roomMap contains the data related to each room
const roomMap = {}

const roomInitialState = {
    difficulty: 0, 
    status: 0, 
    playersRequired: 3, 
    players: null, 
    roomWaitingTimeout: null, 
    gameTimeout: null
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

function assignRoom(room, client, username, isLeader) {
    // Make the client join room with given ID
    client.join(room);

    // Add current client as the player in the list
    roomMap[room].players.push({ username, playerID: client.id, isLeader });
    // Reduce the number of players required
    roomMap[room].playersRequired -= 1;

    console.log(`Room with ID ${room} assigned to client with ID ${client.id}`);

    // Mapping the client ID with the room ID
    playerToRoomMapping[client.id] = room;

    // Notify other members of the room
    client.emit(CLIENT_EVENTS.ROOM_JOIN_SUCCESS, { room });
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
        client.emit(CLIENT_EVENTS.ERROR, 'Not enough players to start the room. Please join another room');

        console.log('Not enough players, room deleted', roomMap[room]);
        client.disconnect(true);
    }
}

function createRoom(client, difficulty) {
    // Generate 5 character ID for new Room
    const room = nanoid(5);

    // Create room with unique ID with default state of the room
    roomMap[room] = { ...roomInitialState, difficulty, players: [], roomWaitingTimeout: setTimeout(() => {
        waitingTimeEnds(room);
    }, 60000) };

    console.log(`New Room with id ${room} Created`);

    assignRoom(room, client, username, isLeader);
}

function startGame(room) {
    clearTimeout(roomMap[room].roomWaitingTimeout);
    
    if(!roomMap[room].roomWaitingTimeout) roomMap[room].roomWaitingTimeout = null;
    roomMap[room].playersYetToFinish = roomMap[room].players.length;

    // Create paragraph based on difficulty
    const paragraph = paraGenerator(room.difficulty);

    // Send the paragraph to all the players of the room
    globalConnection.to(room).emit(CLIENT_EVENTS.START_GAME, { paragraph });

    // Gametime starts
    roomMap[room].gameTimeout = setTimeout(() => {
        endGame(room);
    }, 50000);
}

function endGame(room) {
    if(!roomMap[room]) return;
    roomMap[room].gameTimeout = null;
    // TODO: Ranking Logic 
    globalConnection.to(room).emit(CLIENT_EVENTS.END_GAME, { players: roomMap[room].players, message: "Game ended" });

    // Remove players from the game
    roomMap[room].players.forEach(player => {
        const playerClient = playerToClientMapping[player.playerID];
        playerClient.disconnect(true);
    })
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

function updateClientProgress(client, progressData) {
    // Get the room of the player
    const room = playerToRoomMapping[client.id];

    roomMap[room].players.forEach(player => {
        if(player.playerID === client.id) {
            player.progress = progressData;
            console.log('Player state updated');
            client.to(room).emit(CLIENT_EVENTS.GAME_STATE_UPDATE, { player });
            console.log('Player progress notified');
            return;
        }
    });
}

function clientFinishedGame(client, data) {
    const room = roomMap[client.id];
    room.players.forEach(player => {
        if(player.playerID === client.id) {
            player.finishTime = Date.now();
            return;
        }
    })
}

const customRoomMap = {}

function socketInit(io) {
    globalConnection = io;

    io.on(EVENTS.JOIN, (client) => {
        console.log('New player joined');

        // Custom Room 
        client.on('create_room', ({ username, difficulty }) => {
            try {
                const roomID = nanoid(8);
    
                customRoomMap[roomID] = {
                    paragraph: paraGenerator(difficulty),
                    id: roomID,
                    players: []
                }

                let player = {
                    username, clientID: client.id, roomOwner: true
                }

                customRoomMap[roomID].players.push(player);

                console.log(JSON.stringify(customRoomMap[roomID]));
                client.join(roomID);
                client.emit('create_room_success', { roomID, room: customRoomMap[roomID] });
            }
            catch(err) {
                client.emit('error', { message: 'Error occurred while creating room' });
            }
        });



        // client.on('')        
        // playerToClientMapping[client.id] = client;

        // if(!difficulty) client.emit('error', 'Difficulty required');

        // // Find a room for the client
        // let room = findRoom(difficulty);

        // if(!room) room = createRoom(client, difficulty); // If no empty room found, create a room
        // else assignRoom(room, client, username, false); // If room is found, assign this room the new player

        // // For testing
        // client.on('echo', data => {
        //     data = JSON.parse(data);
        //     console.log(data);
        // })

        // // On disconnection, gracefully disconnect the client
        // client.on(EVENTS.EXIT, () => {
        //     disconnectClient(client);
        // });

        // client.on(EVENTS.PROGRESS_UPDATE, (data) => {
        //     data = JSON.parse(data);
        //     updateClientProgress(client, data);
        // });

        // client.on(EVENTS.FINISHED, (data) => {
        //     data = JSON.stringify(data);
        //     clientFinishedGame(client, data);
        // })
    });
}

export default socketInit;