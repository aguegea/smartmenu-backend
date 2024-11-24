import cors from 'cors';
import express, { Application } from 'express';

import restaurantRoutes from './routes/routes';
import { dbConncetion } from './database/config';

class Server {
    private app: Application;
    private port: string;
    private apiPaths = {
        restaurants: '/api/restaurants',
        restaurant_info: '/api/restaurants/:id',
        orders: '/api/restaurants/:id/orders',
    };

    constructor() {
        this.app = express();
        this.port = process.env.PORT || '3001';

        this.middlewares();
        this.routes();
    }

    async connectDatabase() {
        try {
            await dbConncetion();
            console.log('Connected to database.');
        } catch (error) {
            console.error('Error while connecting to database:', error);
        }
    }

    middlewares() {
        this.app.use(cors());

        this.app.use(express.json());

        this.app.use(express.static('public'));
    }

    routes() {
        this.app.use(this.apiPaths.restaurants, restaurantRoutes);
    }

    async listen() {
        try {
            await this.connectDatabase(); // Espera a la conexión de la base de datos
            this.app.listen(this.port, () => {
                console.log(`Server running at http://localhost:${this.port}`);
            });
        } catch (error) {
            console.error('Cannot initialize server:', error);
        }
    }
}

export default Server;
