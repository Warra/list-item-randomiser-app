import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ListItems extends BaseSchema {
  protected tableName = 'list_items'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.timestamps(true, true)
      table.string('name').nullable()
      table.dateTime('inactive_at').nullable()
      table.dateTime('live_at').nullable()
      table.integer('list_id').unsigned().references('lists.id').onDelete('CASCADE')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
