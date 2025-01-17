const router = require("express").Router();
const Post = require("../models/Post");

//create a post
router.post("/", async (req,res) => {
    const newPost = new Post(req.body);
    try{
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    }
    catch(e){
        res.status(500).json(e);
    }
})

//update a post

router.put("/:id", async (req,res)=>{
    try{
        const post = await Post.findById(req.params.id);
        if(post.userId === req.body.userId){
             await post.updateOne({$set:req.body});
             res.status(200).json("post updated successfully");
        }else{
            res.status(403).json("you can update only your post");
        }
    }catch(e){
        res.status(500).json(e);
    }
})

//delete


router.delete("/:id", async (req,res)=>{
    try{
        const post = await Post.findById(req.params.id);
        if(post.userId === req.body.userId){
             await post.deleteOne();
             res.status(200).json("post deleted successfully");
        }else{
            res.status(403).json("you can delete only your post");
        }
    }catch(e){
        res.status(500).json(e);
    }
})

//likes

router.put("/:id/likes", async (req,res)=>{
    try{
        const post = await Post.findById(req.params.id);
        if(!post.likes.includes(req.body.userId)){
            await post.updateOne({$push:{likes:req.body.userId}});
             res.status(200).json("post liked ");
        }else{
            await post.updateOne({$pull:{likes:req.body.userId}});
            res.status(200).json("post unliked");
        }
    }catch(e){
        res.status(500).json(e);
    }
})

//get a post
router.get("/:id", async (req,res)=>{
    try{
        const post = await Post.findById(req.params.id);
        
            
             res.status(200).json(post);
        
    }catch(e){
        res.status(500).json(e);
    }
});

//get all post 

router.get("/timeline/all", async (req,res)=>{
    
    try{
       
        const currentUser = await User.findById(req.body.userId); 
        const userPost = await Post.find({userId: currentUser._id});
        const friendPost = await Promise.all(
            currentUser.followings.map((friendid)=>{
               return  Post.find({userId : friendid});
            })
        );
        res.json(userPost.concat(...friendPost));
    }catch(e){
        res.status(500).json(e);
    }
});

module.exports = router;
