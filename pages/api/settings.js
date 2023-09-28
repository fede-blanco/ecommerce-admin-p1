import { mongooseConect } from "@/lib/mongoose.js"
import { Setting } from "@/models/Setting.js"
import { isAdminRequest } from "./auth/[...nextauth].js"

export default async function handler(req, res) {
  await mongooseConect()
  await isAdminRequest(req, res)

  if (req.method === "GET") {
    const name = req.query.name
    if(name){
      const setting = await Setting.findOne({name})
      res.json(setting)
    } else {
      const settings = await Setting.find()
      res.json(settings)
    }
  }

  if (req.method === "PUT") {
    const { name, value } = req.body
    const settingDoc = await Setting.findOne({ name })
    if (settingDoc) {
      settingDoc.value = value
      await settingDoc.save()
      res.json(settingDoc)
    } else {
      res.json(await Setting.create({ name, value }))
    }
  }
}
