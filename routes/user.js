const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

router.get("/",(req,res)=>{
    res.send("welcome to here");
})

//update
router.put("/:id", async ( req, res) =>{
    if(req.body.userId === req.params.id || req.body.isAdmin){
         if(req.body.password){
            try{
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password,salt); 
            }
            catch(e){
               return res.status(500).json(e);
            }
         }

        try{
            const user = await User.findByIdAndUpdate(req.params.id,{$set:req.body});
            res.status(200).json("account updated");
        }
        catch(e){
              return res.status(500).json(e);
        }



    }
    else{
        return res.status(403).json("you can update only your account");
    }
})


//delete

router.delete("/:id", async ( req, res) =>{
    if(req.body.userId === req.params.id || req.body.isAdmin){
         

        try{
            const user = await User.findByIdAndDelete(req.params.id);
            res.status(200).json("account deleted");
        }
        catch(e){
              return res.status(500).json(e);
        }



    }
    else{
        return res.status(403).json("you can delete only your account");
    }
});



//get a user

router.get("/:id",async(req,res)=>{
    try{
    const user = await User.findById(req.params.id);
    const {password,updatedAt,...other} = user._doc;
    res.status(200).json(other);
    }
    catch(e){
        res.status(500).json(e);
    }
})


//follow a user
router.put("/:id/follow", async (req,res) => {
    if(req.body.userId !== req.params.id){
    try{
        const user = await User.findById(req.params.id);
        const currentuser = await User.findById(req.body.userId); 

        if(!user.followers.includes(req.body.userId)){
            await user.updateOne({$push : {followers : req.body.userId}});
            await currentuser.updateOne({$push : {following : req.params.id}});
            res.status(200).json("user has been followed");
        }else{
            res.status(403).json("you already follow this user");
        }

    }catch(e){
        res.status(500).json(e);

    }
}
else{
    res.status(403).json("you cant follow yourself");
}
})


//unfollow a user
router.put("/:id/unfollow", async (req,res) => {
    if(req.body.userId !== req.params.id){
    try{
        const user = await User.findById(req.params.id);
        const currentuser = await User.findById(req.body.userId); 

        if(user.followers.includes(req.body.userId)){
            await user.updateOne({$pull : {followers : req.body.userId}});
            await currentuser.updateOne({$pull : {following : req.params.id}});
            res.status(200).json("user has been unfollowed");
        }else{
            res.status(403).json("you dont follow this user");
        }

    }catch(e){
        res.status(500).json(e);

    }
}
else{
    res.status(403).json("you cant unfollow yourself");
}
})


module.exports = router;
