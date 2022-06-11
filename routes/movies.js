import express from "express";
import {client} from "../index.js";
import {auth} from "../middleware/auth.js";
const router=express.Router();


router.get("/",async function (req, res) {
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

router.get("/:id", async function (req, res) {
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

router.delete("/:id", async function (req, res) {
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
// router.post("/movies", async function (req, res) {
  router.post("/", async function (req, res) {
  const data = req.body;
  console.log(data);
  //db.movies.insertmany(data)
  const result = await client.db("b33wd").collection("movies").insertMany(data);
  res.send(result);
});


router.put("/:id", async function (req, res) {
  const data = req.body;
  console.log(data);
  const { id } = req.params;
  //db.movies.updatetOne({id:id},{$set:data})
  
  const result = await client.db("b33wd").collection("movies").updateOne({ id: id },{$set: data });
  res.send(result);
  console.log("one")
});

export const moviesRouter =router;