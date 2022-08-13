const express=require('express');
const router= express.Router();
router.get('/',(req,res)=>{
    obj={
        name:'John',
        age:30
    }
    res.send(obj);
}
);
module.exports=router;