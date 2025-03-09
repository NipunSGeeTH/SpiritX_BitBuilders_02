const mongoose = require("mongoose");

const UserDetailsSchema = new mongoose.Schema({


    username:{type:String, unique: true},
    password:String
},{
    collection:"UserInfo",
});

mongoose.model("UserInfo",UserDetailsSchema);
