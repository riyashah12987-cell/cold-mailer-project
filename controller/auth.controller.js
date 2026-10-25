import User from "../model/auth.model.js"
import mongoose from "mongoose"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const registerUser = async(req, res)=>{
    try {
        const {name, email, password, domain, skills}= req.body
        if(!name || !email|| !password){
            return res.status(400).json({
                sucess : false,
                message : "All Fields are Required"
            })
        }
      if (password.length <8){
        return res.status(400).json({
        sucess : false,
        message : "password should be atleast 8 charecters"
                
      })
    }
    const existUser = await User.findOne({email}) 
    if (existUser){
        return res.status(400).json({
        sucess : false,
        message : "User Already Exist"
        })
        
    }
     const hashedPassword = await bcrypt.hash(password , 10)
     const user =  await User.create({
        name,
        email,
        password : hashedPassword,
        domain, 
        skills
     })
     return res.status(201).json({
            sucess: true,
            message: "User Created Sucessfully",
        user
        })
     
} catch(error){
     console.log(error.message)
     return res.status(500).json({
      
        sucess : false,
        message  : "Internal server Error"
     })
    }

}  

export const loginUser = async(req, res)=>{
    try{
        const {email, password}= req.body
        const user= await User.findOne({email}).select('+password')
        if(!user){
             return res.status(400).json({
      
        sucess : false,
        message  : "Invalid email or Password",
     })
    }
    const isMatch= await bcrypt.compare(password, user.password)
    if(!isMatch){
         return res.status(400).json({
      
        sucess : false,
        message  : "Invalid Password",
     })
    }
    const token= jwt.sign({userId : user._id}, process.env.JWT_SECRET)
    return res.status(200).json({
      
        sucess : true,
        message  : "login Sucessfully",
        user ,
        token
     })
}catch(e){
       return res.status(500).json({
        sucess : false,
        message  : "Internal Server Error"
        
    })
}
}