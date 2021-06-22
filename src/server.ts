import Express from "express";
import ConnectDB from "./services/MongoDB";
import FileRouter from './routes/files';

const app = Express();
const PORT: string | number = process.env.PORT || 3000;

ConnectDB();

app.use('/api/files', FileRouter)


app.listen(PORT, () => {
    console.log(`Serving @${PORT}`)
});
