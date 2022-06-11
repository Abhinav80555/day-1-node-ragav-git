// const express = require("express");
import express from "express";
import { MongoClient } from "mongodb";
import {moviesRouter} from "./routes/movies.js";
import dotenv from "dotenv";
import cors from "cors"


import {usersRouter} from "./routes/users.js";

dotenv.config();
// console.log(process.env);
//environmental variable
const app = express();
const PORT =process.env.PORT;
app.use(cors())
//middleware->intercept->converting body to json
app.use(express.json()); //inbuilt  middleware

const MONGO_URL = process.env.MONGO_URL;
// Node - MongoDB
async function createConnection() {
  const client = new MongoClient(MONGO_URL);
  await client.connect();
  console.log("Mongodb is connected ✌😊");
  return client;
}
//TOP LEVEL AWAIT
export const client =await createConnection();

app.get("/", function (req, res) {
  res.send("Hello movies");
});

app.use("/movies",moviesRouter);
app.use("/users",usersRouter);

app.listen(PORT, () => console.log(`App started in ${PORT}`));



