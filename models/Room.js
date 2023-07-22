import { Schema, model } from 'mongoose';

const RoomSchema = new Schema({
    id: { type:String },
    player: []
})