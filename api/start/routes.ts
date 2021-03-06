/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
})

Route.group(() => {
  Route.post('', 'ListsController.create')
  Route.get('', 'ListsController.getAll')
  Route.get('/:listId', 'ListsController.getSingle')
  Route.patch('/:listId', 'ListsController.update')
  Route.delete('/:listId', 'ListsController.delete')

  Route.post('/:listId/list-items', 'ListItemsController.create')
  Route.patch('/:listId/list-items/:listItemId', 'ListItemsController.update')
  Route.delete('/:listId/list-items/:listItemId', 'ListItemsController.delete')

  Route.get('/:listId/list-items', 'ListItemsController.getAll')
  Route.get('/:listId/list-items/inactive', 'ListItemsController.inactive')
}).prefix('/lists')
