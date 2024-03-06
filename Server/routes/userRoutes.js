const express=require("express")
const {registerUser, loginUser, getAllUsers} =require("../controllers/userControllers")
const { protect } = require("../middlewares/authMiddleware")
const router=express.Router()

router.post("/",registerUser)
router.post('/login',loginUser)
router.get('/',protect,getAllUsers)

module.exports=router