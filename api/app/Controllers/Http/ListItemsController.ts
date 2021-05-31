import ListItem from 'App/Models/ListItem'
import { DateTime } from 'luxon'

export default class ListItemsController {
  public async getAll({ response, params }) {
    const { listId } = params

    const listItems = await ListItem.query().where('list_id', listId).whereNull('inactive_at')
    response.send({ listItems })
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
    listItem.inactiveAt = inactiveAt ? DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss') : inactiveAt
    listItem.liveAt = liveAt ? DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss') : listItem.liveAt

    const updatedListItem = await listItem.save()

    response.send({ listItem: updatedListItem.toJSON() })
  }

  public async delete({ response, params }) {
    const { listItemId } = params
    const listItem = await ListItem.findOrFail(listItemId)
    await listItem?.delete()

    response.send('List Item deleted')
  }

  public async inactive({ response, params }) {
    const { listId } = params

    const listItems = await ListItem.query().where('list_id', listId).whereNotNull('inactive_at')

    response.send({ listItems })
  }
}
