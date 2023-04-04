import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDatabase from "./config/MongoDb.js";

// import Route
import videoRouter from "./Routes/VideoRoutes.js";
import tagRouter from "./Routes/TagRoutes.js";

dotenv.config();
const PORT = process.env.PORT;
connectDatabase();

const app = express();
app.use(express.json());
app.use(cors());

//  API
app.use("/api/videos", videoRouter);
app.use("/api/tags", tagRouter);

//
app.listen(PORT, console.log(`server is running ${PORT}`));
