import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./routers/authRouter.js";
import accountRouter from "./routers/accountRouter.js";
import path from "path";
import "dotenv/config";
import jwt from "jsonwebtoken";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

// 👇️ "/home/john/Desktop/javascript"
const __dirname = path.dirname(__filename);
console.log('directory-name', __filename, __dirname);
// Server Configuration
const app = express();

const PORT = process.env["PORT"] || 5000;

app.use(express.json());
app.use(cookieParser());

app.use(
    cors()
);


app.use(function (req, res, next) {

    if (
        req.headers &&
        req.headers.authorization &&
        req.headers.authorization.split(' ')[0] === 'EventTracker'

    ) {

        const token = req.headers.authorization.split(' ')[1]

        jwt.verify(token, process.env["JWT_SECRET"], function (err, decode) {
            if (err) req.user = undefined
            req.user = decode
            next()
        })
    } else {
        req.user = undefined
        next()
    }
})
// Mongo Setup
mongoose.connect(
    process.env["MONGO_URI"],
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
    (err) => {
        if (err) console.error(err);
        console.log("Database connected");
    }
);

// Setup Routes
app.use("/auth", authRouter);
app.use("/account", accountRouter);

// Home page
app.use(express.static(path.join(__dirname, "../client/build")));
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build/index.html"));
});
// Start App
app.listen(PORT, () => {
    console.log(`server started on PORT ${PORT}`);
});
