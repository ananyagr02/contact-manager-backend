// creating a schema for our contact manager
const mongoose = require("mongoose");
const contactSchema = mongoose.Schema({
    user_id:{ // this id is created in mongoDB
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User" // reference of model
    },
    name:{
        type: String,
        required: [true, "Please add the contact name"],
    },
    email:{
        type: String,
        required: [true, "Please add the contact email address"],
    },
    phone:{
        type: String,
        required: [true, "Please add the contact phone number"],
    },
},
{
    timestamps: true,
}

);
module.exports = mongoose.model("Contact", contactSchema);