import Express from "express";
import MongoDB from "./services/MongoDB";

const app = Express();
const PORT: string | number = process.env.PORT || 3000;

MongoDB();

app.listen(PORT, () => {
    console.log(`Serving @${PORT}`)
});
