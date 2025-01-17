const express= require('express')
const app= express();

const mongoose = require('mongoose');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/post");
dotenv.config();

const mongoURL = 'mongodb+srv://wodofik837:IHaDbcClGHC6xrU3@cluster0.lfkoe.mongodb.net/social?retryWrites=true&w=majority';


async function connectToDatabase() {
    try {
        if (!mongoURL) {
            throw new Error('MongoDB URI is undefined. Please set it correctly.');
        }
        await mongoose.connect(mongoURL);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1);
    }
}

connectToDatabase();


app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use("/api/users",userRoute);
app.use("/api/auth",authRoute);
app.use("/api/post",postRoute);


app.listen(8800,()=>{
    console.log("server connected");
})