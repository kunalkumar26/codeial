require('dotenv').config()
const mongoose = require("mongoose");



const db_link = process.env.MONGO_URI

mongoose
.connect(db_link)
.then((db) => {
  console.log("posts db connected");
})
.catch((err) => {
  console.log(err.message);
});

const postSchema = mongoose.Schema({
  heading:{
    type: String,
    required: true,
    minLength: 2
  },
  user:{
    type: mongoose.Schema.ObjectId,
    ref: "userModel",
    require: [true, "post must belong to a user"]
  },
  createdAt:{
    type: Date,
    default: Date.now()
  },
  likes:{
    type: Number,
    default: 0
  },
  comments:{
    type: Array,
    default: []
  },
  post:{
    type: String,
    required: true,
    minLength: 5
  },
  likedBy:{
    type: Array,
    default: []
  }
})

const postModel = mongoose.model('postModel', postSchema);

module.exports = postModel;