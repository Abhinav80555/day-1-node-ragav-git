import express from "express";
import {client} from "../index.js";
const router=express.Router();
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

async function genHashedPassword(password){
  const no_of_rounds=10;
  const salt =await bcrypt.genSalt(no_of_rounds);
  // console.log("salt",salt)
  const hashedPassword=await bcrypt.hash(password,salt);
  // console.log("hashedPassword",hashedPassword)
return hashedPassword;
  
}

async function getUserByName(username){ 
  const user=await client
    .db("b33wd")
    .collection("users")
    .findOne({username:username});
return user;
}


//express.json()-> converting to json
//inbuil-middleware
// router.post("/movies", async function (req, res) {
  router.post("/signup", async function (req, res) {
  const {username,password} = req.body;
const hashedPassword=await genHashedPassword(password);
    // console.log(data);
  //db.movies.insertmany(data)
    
  const isUserExist = await getUserByName(username);

    if (isUserExist){
      res.status(400).send({msg:"Choose another username"})
     }else{
  const result = await client.db("b33wd").collection("users").insertOne({username:username,password:hashedPassword,});
  res.send(result);}
});



  router.post("/login", async function (req, res) {
  const {username,password} = req.body;
const userFromDB = await getUserByName(username);
    
    if (!userFromDB){
      res.status(401).send({msg:"Invalid n credentials"})
    }else{
      const storedDBPassword=userFromDB.password;
      const isPasswordMatch=await bcrypt.compare(password,storedDBPassword);


      
      if (isPasswordMatch){
        const token = jwt.sign({id:userFromDB._id},process.env.SECRET_KEY);
        res.send({msg:"successfull login",token:token});
      }else{
        res.status(401).send({msg:"Invalid p credentials"});
      }
    }
  });
export const usersRouter =router;