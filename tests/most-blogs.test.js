const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const blogsList = require('../utils/blogs-list')

describe('Most blogs', () => {
  test('of empty list is null', () => {
    const result = listHelper.mostBlogs([])
    assert.deepStrictEqual(result, null)
  })

  test('of missing list is null', () => {
    const result = listHelper.mostBlogs()
    assert.deepStrictEqual(result, null)
  })

  test('of list with one blog is author and count of blogs', () => {
    const result = listHelper.mostBlogs([blogsList[0]])
    assert.deepStrictEqual(result, {
      author: 'Michael Chan',
      blogs: 1
    })
  })

  test('of list with multiple blogs is author with most blogs', () => {
    const result = listHelper.mostBlogs(blogsList)
    assert.deepStrictEqual(result, {
      author: 'Robert C. Martin',
      blogs: 3
    })
  })
})

