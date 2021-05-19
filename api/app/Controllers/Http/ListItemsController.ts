import ListItem from 'App/Models/ListItem'
import { DateTime } from 'luxon'

export default class ListItemsController {
  public async getAll({ response }) {
    const listItems = await ListItem.all()
    response.send({ listItems: listItems })
  }

  public async create({ request, response, params }) {
    const { listId } = params
    const { name } = request.body()

    const listItem = await ListItem.create({
      name,
      listId,
    })

    response.send({ listItem: listItem.toJSON() })
  }

  public async update({ request, response, params }) {
    const { name, inactiveAt, liveAt } = request.body()
    const { listItemId } = params
    const listItem = await ListItem.findOrFail(listItemId)

    listItem.name = name || listItem.name
    listItem.inactiveAt = inactiveAt
      ? DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss')
      : listItem.inactiveAt
    listItem.liveAt = liveAt ? DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss') : listItem.liveAt

    const updatedListItem = await listItem.save()

    response.send({ listItem: updatedListItem.toJSON() })
  }
}
