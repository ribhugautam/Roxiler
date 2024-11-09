import express from "express";
import cors from "cors";

const app = express();

app.use(cors(
    {
        origin: "http://localhost:3000",
        credentials: true
        
    }
));

app.use(express.json());

import roxRouter from "./router/routes.js";

app.use("/api/rox", roxRouter);

export { app };
