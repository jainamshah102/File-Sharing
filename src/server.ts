import path from "path";

import express from "express";
import cors from 'cors';

import ConnectDB from "./services/MongoDB";
import HomeRouter from './routes/home';
import FileRouter from './routes/files';
import ShowRouter from './routes/show';
import DownloadRouter from './routes/download';

const app = express();
const PORT: string | number = process.env.PORT || 3000;

ConnectDB();

app.use(cors({ origin: '*' }))

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');


app.use(express.static(__dirname + '/public'));
app.use(express.json());

app.use('/', HomeRouter);
app.use('/api/files', FileRouter);
app.use('/files', ShowRouter);
app.use('/files/download', DownloadRouter);


app.listen(PORT, () => {
    console.log(`Serving @${PORT}`);
});
