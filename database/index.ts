import mongoose from 'mongoose';



export const mongooseConnection  = async () =>{
    return  await mongoose.connect("mongodb://localhost:27017/demo")
}
