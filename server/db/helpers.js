module.exports = function (Collection) {

  Collection.prototype.fetch = async function (selector, options) {
    const cursor = await this.find(selector, options)

    const page = {
      size: await cursor.count()
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
