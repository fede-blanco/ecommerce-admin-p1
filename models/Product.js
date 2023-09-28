import { Schema, model, models } from "mongoose"

// Creamos el esquema que tendra el modelo de Product
const ProductSchema = new Schema({
    title: {type: String, required: true},
    description: {type: String},
    category: {type: String},
    price: {type: Number, required: true},
    images: [{type: String}],
    properties: {type: Object}
},{versionKey: false, timestamps: true});
export const Product = models?.Product || model('Product', ProductSchema);

