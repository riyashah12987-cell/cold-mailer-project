import  mongoose from "mongoose";

const fileschema=new mongoose.Schema({
    fileName:{
    type: String,
    require: true
    },
    fileURL:{ 
        type: String,
        require: true
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref:"User"
    },
})

const File=mongoose.model("File", fileschema)
export default File