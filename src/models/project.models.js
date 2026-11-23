import mongoose, { Schema } from "mongoose";
const projectSchema = new Schema({
  name :{
    type:String,
    required:true,
    unique: true,
    trim: true
  },
  description:{
    type:String,
  },
  createdBy:{
    type: Schema.Types.ObjectId,
  }
},{timestamps: true})