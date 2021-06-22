import Express from "express";


const app = Express();
const PORT: string | number = process.env.PORT || 3000;


app.listen(PORT, () => {
    console.log(`Serving@ ${PORT}`)
});
