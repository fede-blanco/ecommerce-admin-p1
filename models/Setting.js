import { Schema, model, models } from "mongoose";

const SettingSchema = new Schema({
  name: {type: String, required: true, unique: true},
  value: {type: Object}
}, {versionKey: false, timestamps: true})

export const Setting = models?.Setting || model("Setting", SettingSchema)

