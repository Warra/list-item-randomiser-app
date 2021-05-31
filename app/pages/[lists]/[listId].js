import { useRouter } from 'next/router'
import { Suspense, useState, useEffect, useRef } from "react"
import {
  Grid,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Card,
  CardContent,
  CardActions,
  Typography,
} from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import axios from "axios"
import { ChangingText } from "../../components"
import { DateTime } from "luxon"
import EditIcon from "@material-ui/icons/Edit"
import UndoIcon from "@material-ui/icons/Undo"
import DeleteIcon from "@material-ui/icons/Delete"
import CheckIcon from "@material-ui/icons/Check"
import { baseApi } from '../../base-api'

const useStyles = makeStyles({
  root: {
    padding: 0,
    "&.active, &:hover, &.active:hover": {
      "& path": {
        fill: "gray",
      },
      "& span": {
        color: "gray",
      },
    },
  },
  cardSpacing: {
    marginBottom: '8px',
  },
  icon: {
    border: '1px solid #ccc',
    "&:span": {
      padding: '2px'
    }
  }
})

export default function ListItems () {
  const router = useRouter()
  const { listId } = router.query

  const classes = useStyles()
  const player = useRef()

  useEffect(() => {
    if (listId) {
      getItems(listId)
      getInactiveItems(listId)
    }
  }, [listId])

  const [newItem, setNewItem] = useState("")
  const [items, setItems] = useState([])
  const [names, setNames] = useState([])
  const [inActiveItems, setInactiveItems] = useState([])
  const [inActiveNames, setInactiveNames] = useState([])
  const [isRandomizing, setIsRandomizing] = useState(false)
  const [randomIndex, setRandomIndex] = useState(undefined)
  const [liveName, setLiveName] = useState("")
  const [editing, setEditing] = useState({})

  const handleChange = (e) => {
    setNewItem(e.target.value)
  }

  const getItems = async (id) => {
    const listData = await baseApi.get(`lists/${id}/list-items`)
    const { data } = listData

    if (data && data.listItems) {
      setItems(data.listItems)

      const nameData = data.listItems.map(({ name }) => {
        return name
      })
      console.log(nameData, "ACTIVE")
      setNames(nameData)
    }
  }

  const getInactiveItems = async (id) => {
    const listData = await baseApi.get(`lists/${id}/list-items/inactive`)
    const { data } = listData

    if (data && data.listItems) {
      setInactiveItems(data.listItems)

      const nameData = data.listItems.map(({ name }) => {
        return name
      })
      setInactiveNames(nameData)
    }
  }

  const handleSubmit = async (listId) => {
    if (editing.id) {
      await baseApi.patch(`lists/${editing.listId}/list-items/${editing.id}`, {
        name: newItem,
      })
      setEditing({})
    } else {
      await baseApi.post(`lists/${listId}/list-items`, {
        name: newItem,
      })
    }

    setNewItem("")
    getItems(listId)
  }

  const playSound = async () => {
    player.current.src = "/randomize.mp3"
    player.current.play()

    setTimeout(() => {
      player.current.pause()
    }, 6000)
  }

  const handleRandomize = async (listId) => {
    setLiveName("")
    setIsRandomizing(true)
    playSound()

    setTimeout(async () => {
      const min = 0
      const max = Math.floor(items.length)
      const randomNumber = Math.floor(Math.random() * (max - min) + min)

      setIsRandomizing(false)
      setLiveName(names[randomNumber])
      setRandomIndex(randomNumber)

      await baseApi.patch(`lists/${listId}/list-items/${items[randomNumber].id}`, {
        name: items[randomNumber].name,
        liveAt: DateTime.now().toString(),
      })
    }, 4300)
  }

  const handleClear = async (listId, id = undefined, name = undefined) => {
    const clearId = randomIndex ? items[randomIndex].id : id
    const clearName = randomIndex ? items[randomIndex].name : name

    await baseApi.patch(`lists/${listId}/list-items/${clearId}`, {
      name: clearName,
      inactiveAt: DateTime.now().toString(),
    })

    setLiveName("")
    setRandomIndex(undefined)
    getItems(listId)
    getInactiveItems(listId)
  }

  const handleEditing = async (listId, id, name) => {
    setEditing({
      listId,
      id,
      name,
    })

    setNewItem(name)
  }

  const handleSetActive = async (listId, id, name) => {
    await baseApi.patch(`lists/${listId}/list-items/${id}`, {
      name: name,
      inactiveAt: null,
    })
    getItems(listId)
    getInactiveItems(listId)
  }

  const handleItemDelete = async (listId, id) => {
    await baseApi.delete(`lists/${listId}/list-items/${id}`)
    getItems(listId)
    getInactiveItems(listId)
  }

  return (
    <div>
      <Button variant="contained" color="primary" href="/lists">
        Back
      </Button>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Grid container justify="center" spacing={10} border={1}>
            <Grid item>
              <TextField label="Create an item" value={newItem} onChange={handleChange} />
              <Button variant="contained" color="primary" onClick={() => handleSubmit(listId)}>
                Submit
              </Button>
              <br />
              <br />
              <audio ref={player} />
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleRandomize(listId)}
              >
                Randomize!
              </Button>
              {isRandomizing && names.length > 0 && <ChangingText names={names} />}
              {!isRandomizing && liveName === "" && <h1>&nbsp;</h1>}
              {liveName !== "" && <h1>{liveName}</h1>}
              {liveName !== "" && (
                <Button variant="contained" color="primary" onClick={() => handleClear(listId)}>
                  Remove from list
                </Button>
              )}
            </Grid>
            <Grid item>
              <h2>Still to be chosen:</h2>
              <List component="nav">
                {items &&
                  items.map(({ id, name }) => (
                    <Card key={`${id}-${name}`} className={classes.cardSpacing}>
                      <CardContent>
                        <Typography>{name}</Typography>
                      </CardContent>
                      <CardActions>
                        <IconButton onClick={() => handleEditing(listId, id, name)} className={classes.icon}>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleItemDelete(listId, id, name)} className={classes.icon}>
                          <DeleteIcon />
                        </IconButton>
                        <IconButton onClick={() => handleClear(listId, id, name)} className={classes.icon}>
                          <CheckIcon />
                        </IconButton>
                      </CardActions>
                    </Card>
                  ))}
              </List>
            </Grid>
            <Grid item></Grid>
            <Grid item>
              <h2>Inactive:</h2>
              <List component="nav">
                {inActiveItems &&
                  inActiveItems.map(({ id, name }) => (
                    <ListItem key={`${id}-${name}`} pl={0}>
                      <ListItemText primary={name} />
                      <IconButton onClick={() => handleSetActive(listId, id, name)}>
                        <UndoIcon />
                      </IconButton>
                    </ListItem>
                  ))}
              </List>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  )
}
