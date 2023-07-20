const EVENTS = {
    JOIN: 'connection',
    EXIT: 'disconnect',
}

const CLIENT_EVENTS = {
    ROOM_JOINED: 'new_member_room_join',
    ROOM_LEFT: 'member_room_left',
    START_GAME: 'start_game'
}

export { EVENTS, CLIENT_EVENTS };