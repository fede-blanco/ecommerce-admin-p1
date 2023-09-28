import { mongooseConect } from "@/lib/mongoose.js"
import { isAdminRequest } from "./auth/[...nextauth].js";
import { Admin } from "@/models/Admin.js";

export default async function handler(req, res){

  await mongooseConect();

  await isAdminRequest(req,res)

  if (req.method === "POST"){
    const {email} = req.body;
    const exists = await Admin.findOne({email})
    if (exists){
      res.status(400).json({message: `Admin with email "${email}" already exists`})
    } else {
      const newAdmin = await Admin.create({email})
      res.json(newAdmin)
    }
  }
  
  if (req.method === "GET"){
    const admins = await Admin.find()
    // console.log(admins);
    res.json(admins)
  }
  
  if (req.method === "DELETE"){
    const {_id} = req.query
    await Admin.findByIdAndDelete(_id);
    res.json(true)
  }
}

