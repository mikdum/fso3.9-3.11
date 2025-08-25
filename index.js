
const express = require('express')
var morgan = require('morgan')

const app = express()
app.use(express.json())
morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method:url :status :res[content-length] - :response-time ms:body'))


var persons = [
  {
    "id": "1",
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": "2",
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": "3",
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": "4",
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
]




app.get('/', (request, response) => {
  response.send('<h1>12Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})
app.get('/info', (request, response) => {
  var jsonDate = new Date().toString()
  const info = `<div><div>Phonebook has info for ${persons.length} people</div><br/><div>${jsonDate}</div></div>`
  response.send(info)
})

app.get('/api/persons/:id', (request, response) => {
  console.log("🚀 ~ request.params.id:", request.params.id)
  const id = request.params.id
  const person = persons.find(p => p.id === id)
  if (!person) { response.status(404).end() }

  else { response.send(person) }
})
app.delete('/api/persons/:id', (request, response) => {
  console.log("🚀 delete id:", request.params.id)
  const id = request.params.id
  persons = persons.filter(p => p.id != id)
  response.status(204).end()

})


app.post('/api/persons/', (request, response) => {
  const id = Math.floor(Math.random() * 10000).toString()
  const person = request.body


  if (!person.hasOwnProperty('name') || !person.hasOwnProperty('number')) {
    return response.status(400).json({
      error: 'nimi tai numero puuttuu'
    })
  }

  if (persons.find(x => x.name === person.name)) {
    return response.status(400).json({
      error: 'lisättävä nimi on jo luettelossa'
    })
  }

  person.id = id
  persons = persons.concat(person)
  return response.status(200).json(person)
})


//const PORT = 3001
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})