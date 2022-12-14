const express=require('express');
const User = require('../models/User');
const router= express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const JWT_SECRET='rafay@awesome';
const fetchuser=require('../middleware/fetchUser');
//Create a User Using: POST Method "api/auth/createuser" no login required
router.post('/createuser',[
    body('name','Enter Name').not().isEmpty(),
    body('email','Enter Valid Email').isEmail(),
    body('password','Password Must be  6 lenght').isLength({min:6})
],async(req,res)=>{
    //if the validation is not passed
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
// cheack email is already exist
 try{
    let user=await User.findOne({email:req.body.email});
    if(user){
        return res.status(400).json({errors:[{msg:'Email Already Exist'}]});
    }
    const salt=await bcrypt.genSalt(10);
    const secPass=await bcrypt.hash(req.body.password,salt);
     user= await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });
      const data={
            user:{
             id:user.id,
            }
      };
      const authtoken=jwt.sign(data,JWT_SECRET);
      res.json({authtoken:authtoken});
 }
 catch(error){
  console.error(error.message);
  res.status(500).send("Internal Server Error")
 }
}
);

//Authenticate a User Using: POST Method "api/auth/login" no login required
router.post('/login',[
    body('email','Enter Valid Email').isEmail(),
    body('password','Password Must be  6 lenght').isLength({min:6})
],async(req,res)=>{
    //if the validation is not passed
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try{
        let user=await User.findOne({email:req.body.email});
        if(!user){
            return res.status(400).json({errors:[{msg:'User Not Found'}]});
        }
        const isMatch=await bcrypt.compare(req.body.password,user.password);
        if(!isMatch){
            return res.status(400).json({errors:[{msg:'Invalid Password'}]});
        }
        const data={
            user:{
             id:user.id,
            }
        };
        const authtoken=jwt.sign(data,JWT_SECRET);
        res.json({authtoken:authtoken});
    }
    catch(error){
        console.error(error.message);
        res.status(500).send("Internal Server Error")
    }
}
);

//Get User Using: POST Method "api/auth/getuser" Login required
router.post('/getuser',fetchuser,async(req,res)=>{
    try{
        userId=req.user.id;
        const user=await User.findById(userId).select('-password');
        if(!user){
            return res.status(400).json({errors:[{msg:'User Not Found'}]});
        }
        res.json(user);
    }
    catch(error){
        console.error(error.message);
        res.status(500).send("Internal Server Error")
    }
}
);

module.exports=router;