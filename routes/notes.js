const express=require('express');
const router= express.Router();
const fetchuser=require('../middleware/fetchUser');
const Notes= require('../models/Notes');
const { body, validationResult } = require('express-validator');
//fetch all notes using: GET Method "api/notes/fetchallnotes" login required
router.get('/fetchallnotes',fetchuser,async(req,res)=>{
    try{
    const notes=await Notes.find({user:req.user.id});
    res.send(notes); 
    }
    catch(error){
        res.status(500).send("Internal Server Error")
    }
}
);
//add a note using: POST Method "api/notes/addnote" login required
router.post('/addnote',fetchuser,[
    body('title','Please Enter Title').not().isEmpty(),
    body('description','Please Enter Description').not().isEmpty()
],async(req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try{
    const note=await Notes.create({
        user:req.user.id,
        title:req.body.title,
        description:req.body.description,
        tag:req.body.tag,
        date:req.body.date
    });
    res.send(note);
}
catch(error){
    res.status(500).send("Internal Server Error")
}
}
);
//update an existing note using: PUT Method "api/notes/updatenote" login required
router.put('/updatenote/:id',fetchuser,async(req,res)=>{
    const errors = validationResult(req);
    try{
    let note=await Notes.findOneAndUpdate({_id:req.params.id},{
        title:req.body.title,
        description:req.body.description,
        tag:req.body.tag,
        date:req.body.date
    });
   note=await Notes.findById(req.params.id);
    res.send(note);
}
catch(error){
    res.status(500).send("Internal Server Error")
}
}
);
//delete a note using: Delete Method "api/notes/deletenote" login required
router.delete('/deletenote/:id',fetchuser,async(req,res)=>{
    try{
    const note=await Notes.findByIdAndDelete(req.params.id);
    res.send({success:"Note has been Deleted"});
}
catch(error){
    res.status(500).send("Internal Server Error")
}
}
);
module.exports=router;