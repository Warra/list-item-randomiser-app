import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import List from 'App/Models/List'

export default class ListItem extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column()
  public name: string

  @column()
  public inactiveAt: DateTime

  @column()
  public liveAt: DateTime

  @column()
  public listId: number

  @belongsTo(() => List, {
    foreignKey: 'listId',
  })
  public list: BelongsTo<typeof List>
}
