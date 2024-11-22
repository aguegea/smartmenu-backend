import mongoose from 'mongoose';

export const dbConncetion = async (): Promise<void> => {
    try {
        mongoose.set('debug', true);
        await mongoose.connect(process.env.MONGODB_CNN as string);
        console.log('Conectado a la base de datos:', mongoose.connection.name);
    } catch (error) {
        console.log(error)
        throw new Error('Error al iniciar en la base de datos - Hable con el administrador' + error);
    }
}