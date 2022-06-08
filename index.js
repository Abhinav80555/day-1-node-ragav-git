// const express = require("express");
import express from "express";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();
// console.log(process.env);
//environmental variable
const app = express();
const PORT =process.env.PORT;

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
const client =await createConnection();

app.get("/", function (req, res) {
  res.send("Hello movies");
});

app.get("/movies", async function (req, res) {
  //db.movies.find({})
  //Cursor-pagination
  //toArray - Cursor->Array
  const movies = await client
    .db("b33wd")
    .collection("movies")
    .find({})
    .toArray();
  res.send(movies);
});

app.get("/movies:id", async function (req, res) {
  console.log(req.params);
  const { id } = req.params;
  //db.movies.findOne({id:id})
  const movie = await client
    .db("b33wd")
    .collection("movies")
    .findOne({ id: id });

  // const movie = movies.find((mv) => mv.id === id);
  movie
    ? res.send(movie)
    : res.status(404).send({ msg: "no such movie found" });
});

app.delete("/movies:id", async function (req, res) {
  console.log(req.params);
  const { id } = req.params;
  //db.movies.findOne({id:id})
  const movie = await client
    .db("b33wd")
    .collection("movies")
    .deleteOne({ id: id });

  // const movie = movies.find((mv) => mv.id === id);
  movie.deletedCount>0
    ? res.send(movie)
    : res.status(404).send({ msg: "no such movie found" });
});

//express.json()-> converting to json
//inbuil-middleware
app.post("/movies", async function (req, res) {
  const data = req.body;
  console.log(data);
  //db.movies.insertmany(data)
  const result = await client.db("b33wd").collection("movies").insertMany(data);
  res.send(result);
});


app.put("/movies/:id", async function (req, res) {
  const data = req.body;
  console.log(data);
  const { id } = req.params;
  //db.movies.updatetOne({id:id},{$set:data})
  
  const result = await client.db("b33wd").collection("movies").updateOne({ id: id },{$set: data });
  res.send(result);
  console.log("one")
});

app.listen(PORT, () => console.log(`App started in ${PORT}`));
