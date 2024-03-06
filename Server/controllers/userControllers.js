const asyncHandler=require("express-async-handler")
const User=require("../models/userModel")
const generateToken=require("../config/generateToken")
const bcrypt=require("bcryptjs")
const registerUser=asyncHandler(async(req,res)=>{
    try {
       const {name,email,password,pic}=req.body
       if(!name || !email || !password ){
        res.status(400).send({message:"all field must be filled",success:false})
       }
       const userExits=await User.findOne({email})
       if(userExits){
        res.status(200).send({message:"user already exists please register with another email"})
        
       }
       else{
        const user=await new User({
            name,email,password,pic
        })
        user.save().then(()=>{
            const {name,email,pic,_id}=user
            const token=generateToken(_id)
            res.status(201).send({success:true,message:"user is successfully registered",name,email,pic,_id,token})
        }).catch((err)=>{
            console.log(err)
            res.status(404).send({err})
        })
       }
    } catch (error) {
        console.log(error);
        res.status(500).send({error})
    }
})

const loginUser=asyncHandler(async(req,res)=>{
    try {
        const {email,password}=req.body
        if(!email || !password ){
            res.status(400).send({message:"all field must be filled backend",success:false})
           }

        const user=await User.findOne({email})
        if(!user){
            res.status(200).send({message:"user not found please register"})
        }
        else{
            const passwordMatch=await bcrypt.compare(password,user.password)
            if(!passwordMatch){
                res.status(200).send({message:"password is incorrect"})
            }
            else{
                const {name,email,pic,_id}=user
                const token =generateToken(_id)
                res.status(200).send({success:true,message:"user is successfully logged in!",name,email,pic,_id,token})
            }
            
        }
    } catch (error) {
        console.log(error)
        res.status(500)
    }
})

const getAllUsers=asyncHandler(async(req,res)=>{
        const keyword=req.query.search ?{
            $or:[
                {name:{$regex:req.query.search,$options:"i"}},
                {email:{$regex:req.query.search,$options:'i'}}
            ]
        }:{}

      const users=await User.find(keyword).find({_id:{$ne:req.user._id}})
      res.status(200).send({success:true,users})
})

module.exports={
    registerUser,loginUser,getAllUsers
}