const mongoose = require("mongoose")

const BooksSchema = new mongoose.Schema({
    bookName:{
        type:String,
        required:true,
    },
    authorName:{
        type:String,
        required:true,
    },
    price:{
        type:String,
        required:true,
    },
    category:{
        type:String,
    },
    description:{
        type:String,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    imagePublicId: {
        type: String,
        required: true,
    },
    secondaryImages: [{
        imageUrl: {
            type: String,
        },
        imagePublicId: {
            type: String,
        }
    }]
})

module.exports = mongoose.model("Books",BooksSchema)