import mongoose from "mongoose";
import dotenv from "dotenv";

// Cargo las variables de entorno
if (process.env.NODE_ENV !== "test") {
    dotenv.config(); // .env en desarrollo y producción
} 
else {
    dotenv.config({ path: ".env.test" }); // .env.test en entorno de test
}

export const dbConnection = async (): Promise<void> => {
    try {
        const mongoUri = process.env.NODE_ENV === "test" ? process.env.MONGODB_CNN_TEST : process.env.MONGODB_CNN;

        if (!mongoUri) throw new Error("MONGO_URI not defined",);

        await mongoose.connect(mongoUri);

        console.log("Connected to Database:", mongoose.connection.name);
    } 
    catch (error) {
        console.log(error);
        throw new Error("Error starting the database: " + error);
    }
};