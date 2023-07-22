import mongoose from 'mongoose';

function connectToMongo() {
    mongoose.connect('mongodb+srv://srivastavashobhan:srivastavashobhan@cluster0.z4c80qy.mongodb.net/Tally', {});
    const connection = mongoose.connection;

    // On error
    connection.on('error', console.error.bind(console, 'connection error: '));
    // Once the connection is open
    connection.once('open', () => console.log('Successfully connected to database'));
}

export default connectToMongo;