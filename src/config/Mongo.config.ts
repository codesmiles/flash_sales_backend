import mongoose, { type ConnectOptions } from "mongoose";
import { ReadPreference } from 'mongodb';

const mongoConfig = {
    mongoURI: process.env.MONGODB_URL,
    mongoSetup: {
        writeConcern: 'majority',
        appName: process.env.APP_NAME,
        retryWrites: true,
        maxPoolSize: 50,
        minPoolSize: 10,
        socketTimeoutMS: 45000,
        readPreference: ReadPreference.SECONDARY_PREFERRED,
        serverSelectionTimeoutMS: 5000,
    } as ConnectOptions,
};

export const database = () => {
    mongoose.set("strictQuery", true);

    mongoose.connect(mongoConfig.mongoURI, mongoConfig.mongoSetup)
        .then(() => {
            console.log("Successfully connected to the database.", mongoConfig.mongoURI);
        })
        .catch((err) => {
            console.log("bgRed", "There was an error connecting to data base" + err);
        });

}

// Use Lean Queries for Read - Only Operations
// await User.find({ active: true }).lean(); 
