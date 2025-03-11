const { describe, test } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const listBlogs = require('../utils/blogs-list')

describe('Most likes', () => {
  test('of empty list is null', () => {
    const result = listHelper.mostLikes([])
    assert.strictEqual(result, null)
  })

  test('of missing list is null', () => {
    const result = listHelper.mostLikes()
    assert.strictEqual(result, null)
  })

  test('of list with one blog is author and count of likes', () => {
    const result = listHelper.mostLikes([listBlogs[0]])
    assert.deepStrictEqual(result, {
      author: 'Michael Chan',
      likes: 7
    })
  })

  test('of list with multiple blogs is author with most likes', () => {
    const author = listHelper.mostLikes(listBlogs)
    assert.deepStrictEqual(author, {
      author: 'Edsger W. Dijkstra',
      likes: 17
    })
  })
})