import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ListItems extends BaseSchema {
  protected tableName = 'list_items'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.timestamps(true, true)
      table.string('name')
      table.dateTime('inactive_at')
      table.dateTime('live_at')
      table.integer('list_id').unsigned().references('lists.id').onDelete('CASCADE')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
