import express, { type Express, type Request, type Response } from "express";
import { database } from "./src";
import routes from "./src/routes";

const app: Express = express();
const PORT = process.env.PORT ?? 12000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api/v1", routes);


// Health check endpoint
app.get("/health", async (req: Request, res: Response) => {
    console.log("Health endpoint was triggered")
    res.status(200).json({message: "Server is up and running and healthy"});
})


database()
app.listen(PORT, () => {
    console.log("Process is listening to PORT: ", PORT)
})