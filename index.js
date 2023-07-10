require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const mongoose = require('mongoose')

const Persons = require('./models/persons')



app.use(cors())

morgan.token('string', function (req, res) { return JSON.stringify(req.body)})

app.use(express.static('build'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :string'))


let persons = [
  {
    'id': 1,
    'name': 'Arto Hellas',
    'number': '040-123456'
  },
  {
    'id': 2,
    'name': 'Ada Lovelace',
    'number': '39-44-5323523'
  },
  {
    'id': 3,
    'name': 'Dan Abramov',
    'number': '12-43-234345'
  },
  {
    'id': 4,
    'name': 'Mary Poppendieck',
    'number': '39-23-6423122'
  }
]

app.get('/info', (request, response, next) => {
  Persons.countDocuments({})
    .then(count => {
      const info = `Phonebook has info for ${count} people.<br>${new Date()}`
      response.send(info)
    })
    .catch(error => next(error))
})

app.get('/api/persons', (request, response) => {
  Persons.find({}).then(person => {
    response.json(person)
  })
})



app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'content missing'
    })}

  if (persons.find (person => person.name === body.name)) {
    return response.status(400).json({
      error: 'name must be unique'
    })}


  const person = new Persons({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPersons => {
    response.json(savedPersons)
  })
    .catch(error => next(error))

})



app.delete('/api/persons/:id', (request, response, next) => {
  Persons.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Persons.findById(request.params.id).then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  }).catch(error =>
    next(error))
}
)

app.put('/api/persons/:id', (request, res, next) => {

  const { name, number } = request.body


  Persons.findByIdAndUpdate(request.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      res.json(updatedPerson)
    })
    .catch(error => next(error))
})


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})