const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')

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

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { name: 1, username: 1 })
  response.json(blogs)
})

blogsRouter.put('/:id', middleware.userExtractor, async (request, response) => {
  const { body: blog } = request
  const blogToUpdate = await Blog.findById(request.params.id)
  if (!blogToUpdate) {
    return response.status(404).json({
      error: 'blog not found'
    })
  }

  const { user } = request
  if (blogToUpdate.user.toString() !== user._id.toString()) {
    return response.status(401).json({
      error: 'user not authorized'
    })
  }

  blogToUpdate.set({
    title: blog.title,
    author: blog.author,
    url: blog.url,
    likes: blog.likes
  })

  const updatedBlog = await blogToUpdate.save()
  response.status(200).json(updatedBlog)
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const blogToDelete = await Blog.findById(request.params.id)
  const { user } = request
  if(blogToDelete.user.toString() === user._id.toString()) {
    user.blogs = user.blogs.filter(blog =>
      blog._id.toString() !== blogToDelete._id.toString()
    )
    await user.save()
    await blogToDelete.deleteOne()
    response.status(204).end()
  } else {
    response.status(401).json({
      error: 'This blog was created by another user',
    })
  }
})

module.exports = blogsRouter