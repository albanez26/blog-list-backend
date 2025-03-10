const mongoose = require('mongoose')

const blogSquema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})

blogSquema.set('toJSON', {
  transform: (doc, ret) =>{
    ret.id = ret._id.toString()
    delete ret._id
    delete ret.__v
  }
})

module.exports = mongoose.model('Blog', blogSquema)