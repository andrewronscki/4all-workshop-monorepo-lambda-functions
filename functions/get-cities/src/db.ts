import mongoose from 'mongoose';

export const connectToDatabase = async (uri: string): Promise<void> => {
  try {   
    await mongoose.connect(uri, {});
    console.log('Conectado ao MongoDB');
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error);
  }
};