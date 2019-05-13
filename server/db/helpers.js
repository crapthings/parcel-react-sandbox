module.exports = function (Collection) {

  Collection.prototype.fetch = async function (selector, options = { limit: 20, skip: 0 }) {
    options.limit = 20

    const cursor = await this.find(selector, options)

    const page = {
      size: await cursor.count(),
      limit: 20,
    }

    const result = {
      [this.collectionName]: await cursor.toArray()
    }

    return {
      page,
      result,
    }
  }

}
