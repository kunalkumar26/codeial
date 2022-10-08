require('dotenv').config()
const mongoose = require("mongoose");


const db_link = process.env.MONGO_URI

mongoose
.connect(db_link)
.then((db) => {
  console.log("comments db connected");
})
.catch((err) => {
  console.log(err.message);
});

const commentSchema = mongoose.Schema({
  comment:{
    type: String,
    required: true,
  },
  user:{
    type: mongoose.Schema.ObjectId,
    required: [true, "comment must belong to a user"],
    ref: "userModel"
  },
  createdAt:{
    type: Date,
    default: Date.now()
  },
  like:{
    type: Number,
    default: 0
  },
  post:{
    type: mongoose.Schema.ObjectId,
    required: [true, "comment must belong to a post"],
    ref:"postModel"
  }
})

const commentModel = mongoose.model('commentModel', commentSchema);

module.exports = commentModel;