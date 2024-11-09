import mongoose from "mongoose";

const productsSchema = new mongoose.Schema({
    id:{
        type: Number,
    },
    title: {
        type: String,
    },
    price: {
        type: Number,
    },
    description: {
        type: String
    },
    category: {
        type: String
    },
    image: {
        type: String
    },
    sold: {
        type: String
    },
    dateOfSale: {
        type: Date
    },
},{timestamps: true});

export const Products = mongoose.model("Products", productsSchema);