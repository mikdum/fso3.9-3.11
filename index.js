import './dotenv.js'
import Person from "./mongo.js"
import express from 'express'
import morgan from 'morgan'

const app = express()
app.use(express.json())
morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method:url :status :res[content-length] - :response-time ms:body'))



app.get('/', (request, response) => {

  Person.find({})
  .then(persons => {
      const personsstr='<div><h1>Persons</h1>'+persons.reduce((current,x)=>current+`<div key=${x.id}> ${x.name}</div>`,'')+'</div>'
      response.send(personsstr)
  })
})

app.get('/api/persons', (request, response) => {
  Person.find({})
  .then(persons => {
      response.json(persons)
  })
})
app.get('/info', (request, response) => {
  Person.countDocuments({})
  .then(persons => {
      console.log("🚀 ~ persons:", persons)
      const currentDate = new Date()
      var jsonDate = new Date().toString()
      const info = `<div><div>Phonebook has info for ${persons} people</div><br/><div>${jsonDate}</div></div>`
      response.send(info)


    })
     
})

app.get('/api/persons/:id', (request, response) => {
  console.log("🚀 ~ request.params.id:", request.params.id)

  Person.findById(request.params.id)
  .then(person => {
      if (person) {
          response.json(person)
      } else {
          response.status(400).json({ error: `ID not found ${request.params.id}` })
      }
  })
  .catch(error => response.status(400).json({ error: `ID not found ${request.params.id}` }))





})
app.delete('/api/persons/:id', (request, response) => {
  console.log("🚀 delete id:", request.params.id)

  Person.deleteOne({ _id: request.params.id })
  .then(() => {
      response.status(204).end()
  })
  .catch(error => response.status(400).json({ error: `ID  ${request.params.id} ${error}` }))




})


app.post('/api/persons/', (request, response) => {
  //const id = Math.floor(Math.random() * 10000).toString()

  const person = new Person({ ...request.body })
  console.log("🚀 ~ person:", person)
  
  person.save()
      .then(savedPerson => {
          response.status(200).json(savedPerson)
      })
      .catch(error =>  response.status(400).json({ error: `name  ${request.params.name} ${error}` }))

})


//const PORT = 3001
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})