require('dotenv').config()
const mongoose = require("mongoose");
const emailValidator = require("email-validator")


const db_link = process.env.MONGO_URI
console.log("asdfsad",process.env.MONGO_URI)

mongoose
.connect(db_link)
.then((db) => {
    console.log("user db connected");
})
.catch((err) => {
    console.log(err.message);
});

const userSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        validate: function () {
            return emailValidator.validate(this.email);
        }
    },
    password:{
        type: String,
        required: true,
        minLength: 2
    },
    posts: {
        type: Array,
        default: []
    },
    joinedAt:{
        type: Date,
        default: Date.now()
    },
    profileImage:{
        type: String,
        default: "https://firebasestorage.googleapis.com/v0/b/codeial-9dee1.appspot.com/o/data%2Fdefault.webp?alt=media&token=d16c88e1-642e-4d53-ab3f-a64db0663438"
    },
    likedPosts:{
        type: Array,
        default: []
    },
    following:{
        type: Array,
        default: []
    },
    followers:{
        type: Array,
        default: []
    },
    pendingNotifications:{
        type: Array,
        default: []
    },
    resolvedNotifications:{
        type: Array,
        default: []
    }
})

const userModel = mongoose.model('userModel', userSchema);

module.exports = userModel;