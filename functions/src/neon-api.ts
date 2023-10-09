import * as express from "express";
import * as functions from "firebase-functions";
import { PrismaClient } from '@prisma/client';
// import * as admin from "firebase-admin";

// const axios = require("axios").default;
//const jsSHA = require("jssha");
const cors = require("cors")({ origin: true })
const app = express();
const prisma = new PrismaClient();
// const db = admin.firestore();
app.use(cors);

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    next();
});

app.get("/getUsers", async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.status(200).send(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).send("Error fetching users.");
    }
});

app.get("/notifyUser", (req, res) => {
    console.log("/notifyUser called");
    console.log(req.query);
    res.status(200).send({ message: "Its Neon Added", data: req.query });
})





export const neonApi = functions.https.onRequest(app);