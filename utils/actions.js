const EVENTS = {
    JOIN_ROOM: 'join_room',
    JOIN: 'connection',
    EXIT: 'disconnect',
    PROGRESS_UPDATE: 'progress_update',
    FINISHED: 'finished',
}

const CLIENT_EVENTS = {
    ROOM_JOIN_SUCCESS: 'room_join_success',
    ROOM_JOINED: 'new_member_room_join',
    ROOM_LEFT: 'member_room_left',
    START_GAME: 'start_game',
    END_GAME: 'end_game',
    GAME_STATE_UPDATE: 'game_state_update',
    ERROR: 'error'
}

export { EVENTS, CLIENT_EVENTS };