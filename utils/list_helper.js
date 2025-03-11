const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return !blogs || blogs.length === 0
    ? 0
    : blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (!blogs || blogs.length === 0) {
    return null
  }
  const { title, author, likes } = blogs.reduce((max, blog) => {
    return max.likes > blog.likes ? max : blog
  }, blogs[0])

  return {
    title,
    author,
    likes
  }
}

const mostBlogs = (blogsList) => {
  if (!blogsList || blogsList.length === 0) {
    return null
  }
  const [author, blogs] = _.maxBy(
    _.toPairs(_.groupBy(blogsList, 'author')),
    ([author, blogs]) => blogs.length
  )
  return {
    author,
    blogs: blogs.length
  }
}

const mostLikes = (blogsList) => {
  if (!blogsList || blogsList.length === 0) {
    return null
  }
  const [author, blogs] = _.maxBy(
    _.toPairs(_.groupBy(blogsList, 'author')),
    ([author, blogs]) => {
      return blogs.reduce((likes, blog) => {
        return likes + blog.likes
      }, 0)
    }
  )
  const likes = blogs.reduce((sum, blog) => sum + blog.likes, 0)

  return {
    author,
    likes
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}

