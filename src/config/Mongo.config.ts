import mongoose from "mongoose";

const mongoConfig = {
    mongoURI: process.env.MONGODB_URL,
    mongoSetup: {
        maxPoolSize: 50,
        minPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        // readPreference: "secondaryPreferred" 
    },
};

export const database = () => {
    mongoose.set("strictQuery", true);

    mongoose.connect(mongoConfig.mongoURI,mongoConfig.mongoSetup)
        .then(() => {
            console.log("Successfully connected to data base.", mongoConfig.mongoURI);
        })
        .catch((err) => {
            console.log("bgRed", "There was an error connecting to data base" + err);
        }); 
    
}

// Use Lean Queries for Read - Only Operations
// await User.find({ active: true }).lean(); 
