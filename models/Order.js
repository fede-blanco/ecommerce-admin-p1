import { Schema, model, models } from "mongoose"

const orderSchema = new Schema({
  line_items:Object,
  name: String,
  email: String,
  city: String,
  postalCode: String,
  streetAdress: String,
  country: String,
  totalPrice: Number,
  paid:Boolean,
},{versionKey: false, timestamps: true})

export const Orders = models?.Orders || model("Orders", orderSchema)