import mongoose  from "mongoose";

const UserSchema= new mongoose.Schema({
   name:{
    type:String,
    required:true,
    trim:true
   } ,
   email:{
    type:String,
    required:true,
    trim:true,
    unique: true, 
    lowercase: true,
   } ,
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user",
    },
    subscription: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Courses",
      },
    ],
    resetPasswordExpire: Date,
},

{
    timestamps:true
}
)
export const User= mongoose.model("User",UserSchema)
