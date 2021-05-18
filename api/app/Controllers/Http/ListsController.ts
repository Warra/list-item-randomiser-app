// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import List from 'App/Models/List'

export default class ListsController {
  async create({ request, response }) {
    const { name } = request.body()
    const list = await List.create({
      name,
    })

    response.send(JSON.stringify({ list })).type('application/json').status(200)
  }
}
