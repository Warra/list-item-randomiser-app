import List from 'App/Models/List'

export default class ListsController {
  public async getAll({ response }) {
    const lists = await List.all()
    response.send({ lists: lists })
  }

  public async getSingle({ response, params }) {
    const { listId } = params
    const list = await List.findOrFail(listId)
    const items = await list.related('listItems').query()

    response.send({
      name: list.toJSON().name,
      listItems: items,
    })
  }

  public async create({ request, response }) {
    const { name } = request.body()

    const list = await List.create({
      name,
    })

    response.send({ list: list.toJSON() })
  }

  public async update({ request, response, params }) {
    const { name } = request.body()
    const { listId } = params

    const list = await List.findOrFail(listId)
    list.name = name || null
    const updatedList = await list.save()

    response.send({ list: updatedList.toJSON() })
  }

  public async delete({ response, params }) {
    const { listId } = params
    const list = await List.findOrFail(listId)
    await list?.delete()

    response.send('List deleted')
  }
}
