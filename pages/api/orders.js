import { mongooseConect } from "@/lib/mongoose.js";
import { Orders } from "@/models/Order.js";
import { isAdminRequest } from "./auth/[...nextauth].js";



export default async function handle(req,res) {
  await mongooseConect();
  await isAdminRequest(req,res)
  res.json(await Orders.find().sort({createdAt:-1}));
}