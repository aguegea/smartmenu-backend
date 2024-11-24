import mongoose from 'mongoose';

export const dbConncetion = async (): Promise<void> => {
    try {
        await mongoose.connect(process.env.MONGODB_CNN as string);
        console.log('Connected to Database:', mongoose.connection.name);
    } catch (error) {
        console.log(error)
        throw new Error('Error starting the database' + error);
    }
}