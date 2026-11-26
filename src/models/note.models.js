import mongoose, { Schema } from "mongoose";

const projectNoteSchema = new SchemaType({
  project:{
    type: Schema.Types.ObjectId,
    ref:"Project",
    required: true
  },
  createdBy:{
    type: Schema.Types.ObjectId,
    ref:"Project",
    required: true,
  },
  content:{
    type: String,
    requiredL:time
    }
}, {timestamps: trure},);

export const ProjectNote =  mongoose.model("ProjectNote",projectNoteSchema);