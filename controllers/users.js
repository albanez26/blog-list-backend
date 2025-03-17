const User = require('../models/user')
const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')

usersRouter.post('/', async (request, response) => {
  const { name, username, password } = request.body
  if(password.length < 3){
    return response.status(400).send({
      error: 'Password must have at least 3 characters'
    })
  }
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)
  const user = new User({
    name,
    username,
    passwordHash
  })
  const createdUser = await user.save()
  response.status(201).send(createdUser)
})

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', { user: 0 })
  response.json(users)
})

module.exports = usersRouter
