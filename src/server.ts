import app from "./app";
import { dbConnection } from "./database/config";
import dotenv from "dotenv";

dotenv.config();

export class Server {
    private port: string;

    constructor() {
        this.port = process.env.PORT || "3001";
    }

    async connectDatabase() {
        try {
            await dbConnection();
            console.log("Connected to database.");
        } catch (error) {
            console.error("Error while connecting to database:", error);
            process.exit(1); // Exit si no se puede conectar a la db
        }
    }

    async listen() {
        await this.connectDatabase();
        app.listen(this.port, () => {
            console.log(`Server running at http://localhost:${this.port}`);
        });
    }
}