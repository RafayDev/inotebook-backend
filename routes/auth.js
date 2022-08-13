const express=require('express');
const User = require('../models/User');
const router= express.Router();
const { body, validationResult } = require('express-validator');
//Create a User Using: POST Method "api/auth/createuser"
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

     user= await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      })
      res.json("User Successfully Created");
 }
 catch(error){
  console.error(error.message);
  res.status(500).send("Some Error")
 }
}
);
module.exports=router;