import "dotenv/config";

import logger from "./logger.js";
import morgan from "morgan";




import express from 'express'
const app = express()
const port = process.env.PORT || 3000

const morganFormat = ":method :url :status :response-time ms";

app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);

app.get('/', (req, res) => {
  res.send('hello from diksh & his tea')
})

app.get('/ice-tea', (req, res) => {
  res.send('what type of tea do u like')
})

app.get('/twitter', (req, res) => {
  res.send('diksh@twitter.com')
})

// Important: Make sure middleware is placed before routes that need it
app.use(express.json())

let teaData = []
let nextId = 1

app.post('/teas', (req, res) => {
  console.log(`POST`)
  //adding a new tea
  const {name, price} = req.body
  const newTea = {id: nextId++, name: name, price: price}
  teaData.push(newTea)
  res.status(200).send(newTea)
})

app.get('/teas', (req, res) => {
  res.status(200).send(teaData)
})

//getting a specific tea
app.get('/teas/:id', (req, res) => {
  const tea = teaData.find(t => t.id === parseInt(req.params.id))
  if (!tea) {
    return res.status(404).send("not yet found the tea") // Removed "new"
  }
  return res.status(200).send(tea) // Removed "new"
})

//updating something
app.put('/teas/:id', (req, res) => {
  const tea = teaData.find(t => t.id === parseInt(req.params.id))
  if (!tea) {
    return res.status(404).send("not yet found the tea") // Removed "new"
  }
  const {name, price} = req.body
  tea.name = name
  tea.price = price
  res.status(200).send(tea)
})

//deleting a tea
app.delete('/teas/:id', (req, res) => {
  const index = teaData.findIndex(t => t.id === parseInt(req.params.id))
  if (index == -1) {
    return res.status(404).send('tea not found to be deleted')
  }
  teaData.splice(index, 1)
  return res.status(204).end() // Changed to .end() for 204 responses
})

app.listen(port, () => {
  console.log(` app has been started successfully on ${port} ...`)
})