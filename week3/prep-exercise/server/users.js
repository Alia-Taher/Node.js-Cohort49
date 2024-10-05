import newDatabase from './database.js'
import { hash, compare } from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';

// Change this boolean to true if you wish to keep your
// users between restart of your application
const isPersistent = false
const database = newDatabase({isPersistent})
const SALT_ROUNDS = 12;
 const SECRET = '1w3e5r6y7u89i3e3e4r5t6y7y8ui2u8x5v'
// Create middlewares required for routes defined in app.js

export const register = async (req, res) => {

  const {userName, password } = req.body;
  if(!userName || ! password){
   return res.status(400).json({message : "Username and password are required!"})
  }

  try{ 
    const hashedPassword = await hash(password, SALT_ROUNDS)

    const user = database.create({userName, password: hashedPassword})
    if(!user){ return res.status(424).json({ message: " Registration failed" })}

    return res.status(201).json({ id: user.id, userName : user.userName });

  }catch(error){
    res.status(500).json({ message: 'Internal server error', error: error.message})
  }
};


export const login = async (req , res)=>{
  const {userName, password } = req.body;
  if(!userName || ! password){
   return res.status(400).json({message : "Username and password are required!"})
  }

  try{
  const existingUser = database.getByUsername(userName);
  if(!existingUser){
      res.status(404).json({message:" User not found! "})
  }
 
  const validPassword = await compare(password, existingUser.password)
  
  if(validPassword){
    const user = { username: existingUser.userName, id: existingUser.id };
    const token = jsonwebtoken.sign(user, SECRET);
   
    return res.status(200).json({ token : token});
  }
  else { return res.status(401).json({ message: "Invalid username or password" });}
}catch (error){
  res.status(500).json({ message: 'Internal server error', error: error.message})
}}


export const profile = async (req, res)=>{
  try{
  const authHeader = req.headers['authorization'];
  if(! authHeader){
    return res.status(401).json({message:" Authorization header missing "})
  }
  
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Token is missing" });
  }
  
  const decodeToken = jsonwebtoken.verify(token, SECRET);
  const userId = decodeToken.id;
  const userInfo  = database.getById(userId);
  if(!userInfo ){
    return res.status(401).json({message: "Unauthorized"})
  }
  return res.status(200).json({ userName: userInfo.userName });
  } catch (error){
    console.log(error)
    res.status(500).json({ message: 'Internal server error', error: error.message})
  }
}

export const logout = async (req, res)=>{
   res.status(204).json({message: "successful logout"})
}

// You can also create helper functions in this file to help you implement logic
// inside middlewares

