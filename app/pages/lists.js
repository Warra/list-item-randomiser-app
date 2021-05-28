import { Suspense, useState, useEffect } from "react"
import { Box, TextField, Button, List, ListItem, ListItemText, IconButton } from "@material-ui/core"
import { baseApi } from '../base-api'
import EditIcon from "@material-ui/icons/Edit"
import UndoIcon from "@material-ui/icons/Undo"
import DeleteIcon from "@material-ui/icons/Delete"

export default function Lists() {
  useEffect(() => {
    getLists()
  }, [])

  const [newList, setNewList] = useState("")
  const [lists, setLists] = useState([])
  const [editing, setEditing] = useState({})

  const handleChange = (e) => {
    setNewList(e.target.value)
  }

  const getLists = async () => {
    const listData = await baseApi.get("lists")
    const { data } = listData
    if (data && data.lists) {
      setLists(data.lists)
    }
  }

  const handleSubmit = async () => {
    console.log(editing)
    if (editing.id) {
      await baseApi.patch(`lists/${editing.id}`, {
        name: newList,
      })
      setEditing({})
    } else {
      await baseApi.post("lists", {
        name: newList,
      })
    }

    setNewList("")
    getLists()
  }

  const handleEditing = async (id, name) => {
    setEditing({
      id,
      name,
    })

    setNewList(name)
  }

  const handleListDelete = async (id) => {
    await baseApi.delete(`lists/${id}`)
    getLists()
  }

  return (
    <div>
      <Box display="flex" alignItems="center" justifyContent="center" padding="12px">
        <Box mr={2}>
          <TextField label="Create a list" value={newList} onChange={handleChange} />
        </Box>
        <Button variant="contained" color="primary" onClick={handleSubmit} ml={20}>
          Submit
        </Button>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        padding="12px"
      >
        <h2>Lists:</h2>
        <List component="nav">
          {lists &&
            lists.map(({ id, name }) => (
              <ListItem key={`${id}-${name}`}>
                <ListItem primary={name} component="a" href={`/list/${id}`}>
                  <ListItemText primary={name} />
                </ListItem>
                <IconButton onClick={() => handleEditing(id, name)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleListDelete(id)}>
                  <DeleteIcon />
                </IconButton>
              </ListItem>
            ))}
        </List>
      </Box>
    </div>
  )
}
