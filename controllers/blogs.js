const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { name: 1, username: 1 })
  response.json(blogs)
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const { user } = request
  const blog = new Blog({
    ...request.body,
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog.id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const validToken = jwt.verify(
    request.token,
    process.env.SECRET
  )
  if(!validToken.id){
    return response.status(401).json({
      error: 'invalid token'
    })
  }
  const blogToDelete = await Blog.findById(request.params.id)
  const user = await User.findById(validToken.id)

  if(blogToDelete.user.toString() === user._id.toString()) {
    user.blogs = user.blogs.filter(blog =>
      blog._id.toString() !== blogToDelete._id.toString()
    )
    await user.save()
    await blogToDelete.deleteOne()
    response.status(204).end()
  } else {
    response.status(401).json({
      error: 'user not authorized'
    })
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    request.body,
    { new: true }
  )
  response.status(200).send(updatedBlog)
})

module.exports = blogsRouter