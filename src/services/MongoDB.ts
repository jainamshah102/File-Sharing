import * as dotenv from "dotenv";

dotenv.config({ path: __dirname + '../../.env' });

import mongoose from "mongoose";


export default () => {

    mongoose.connect(process.env.DATABASE_CONNECTION as string, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: true
    });

    const connnection = mongoose.connection;

    connnection.once('open', () => {
        console.log('Database connected');
    });
};
