import { mongooseConect } from "@/lib/mongoose.js"
import { Category } from "@/models/Category.js"
import { authOptions, isAdminRequest } from "./auth/[...nextauth].js"

export default async function handle(req, res) {
  const { method } = req

  await mongooseConect()
  
  await isAdminRequest(req,res)

  if (method === "GET") {
    const categories = await Category.find().populate("parent")
    res.json(categories)
  }

  if (method === "POST") {
    const { name, parentCategory, properties } = req.body
    const categoryDoc = await Category.create({
        name,
        parent: parentCategory,
        properties,
    })
    res.json(categoryDoc)
  }

  if (method === "PUT") {
    const { name, parentCategory,properties, _id } = req.body
    const categoryDoc = await Category.updateOne(
      { _id: _id },
      { name,
        parent: parentCategory,
        properties, }
    )
    res.json(categoryDoc)
  }

  if(method === "DELETE"){
    const {_id} = req.query;
    await Category.deleteOne({_id})
    res.json(true)
  }
}
