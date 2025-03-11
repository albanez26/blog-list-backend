const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null
  if (blogs.length === 1) return blogs[0]
  
  return blogs.reduce((max, blog) => {
    return max.likes > blog.likes ? max : blog
  }, blogs[0])
}


module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}

