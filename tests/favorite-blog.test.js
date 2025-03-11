const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const blogs = require('../utils/blogs-list')

describe('Favorite blog', () =>{
  test('of empty list is null', () =>{
    const result = listHelper.favoriteBlog([])
    assert.strictEqual(result, null)
  })

  test('when list has only one blog', () =>{
    const result = listHelper.favoriteBlog([blogs[0]])
    assert.deepStrictEqual(result, blogs[0])
  })

  test('of a bigger list is calculated right', () =>{
    const result = listHelper.favoriteBlog(blogs)
    assert.deepStrictEqual(result, blogs[2])
  })
})