import * as mongoose from 'mongoose'
const dotenv = require('dotenv');
dotenv.config();
  export default async (): Promise<any> => {
    mongoose.set('autoIndex', true);
    mongoose.set('useNewUrlParser', true);
    mongoose.set('useCreateIndex', true);
    mongoose.set('useFindAndModify', false);
    mongoose.set('useUnifiedTopology', true);
    const connection = await mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true });
    return connection.connection;
  }