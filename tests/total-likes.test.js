const {test, describe} = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const blogs = require('../utils/blogs-list')

describe('Total likes', () =>{
  test('of empty likes is zero', () =>{
    const totalLikes = listHelper.totalLikes([])
    assert.strictEqual(totalLikes, 0)
  })

  test('when list has only one blog equal the likes of that', () =>{
    const result = listHelper.totalLikes([blogs[0]])
    assert.strictEqual(result, 7)
  })

  test('of a bigger list is calculated right', () =>{
    const result = listHelper.totalLikes(blogs)
    assert.strictEqual(result, 36)
  })

})