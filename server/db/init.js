init()

async function init() {

  await db.lists.deleteMany({})
  await db.items.deleteMany({})

  const { ops: lists } = await db.lists.insertMany(_.times(100, n => ({
    name: faker.lorem.words(),
    createdAt: faker.date.past(),
  })))

  const listIds = _.map(lists, '_id')

  let _items = []

  for (const listId of listIds) {
    const __items = _.times(100, n => ({
      name: faker.lorem.words(),
      parentId: listId
    }))

    _items = _items.concat(__items)
  }

  const items = await db.items.insertMany(_items)

}
