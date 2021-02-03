const express = require('express')
const mongoose = require('mongoose')
const app = express()
const morgan = require('morgan')
//asetetaan front end mukaan käyttäen expressiä.
app.use(express.static('build'))
app.use(express.json())


//vaaditaan tietokannan salasana dotenv avulla
require('dotenv').config()
//otetaan käyttöö moduuli Note kansiosta models/note
const Note = require('./models/note')

//kuunnellaam dotenvissa annettua porttia
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

//morgan on middleware, joka loggaa backendin tapahtumia konsoliin. tiny pienin ja yksinkertaisin
//app.use(morgan('tiny'))
//custom morgan middleware, joka tulostaa jokaisesta bacnend yhteyden otosta tietoja
morgan.token('postRes', (req) => JSON.stringify(req.body))
app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    tokens.postRes(req, res)
  ].join(' ')
}))


//kierretään same origin ja CORS policy esto käyttäen cors middlewarea
const cors = require('cors')
app.use(cors())

let persons = [
  {
    id: 1,
    name: "Ei yhteyttä tietokantaan",
    number: "404"
  }
]

//eli käytäännössä http://localhost:3001/
app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

//palautetaan kaikki numerot
app.get('/api/persons', (request, response) => {
  Note.find({}).then(persons => {
    response.json(persons)
    console.log("Backend palautti kaikki henkilöt")
  })
})

//yksittäisen numeron palauttaminen. Jos ID ei ole olemassa tulostetaan virheilmoitus
app.get('/api/persons/:id', (request, response, next) => {
  Note.findById(request.params.id).then(note => {
    if (note) {
      response.json(note)
      console.log("Backend palautti yhden henkilön")
    } else {
      response.status(404).end()
    }
  })
  .catch(error => next(error))
})

//yksittäisen henkilön numeron päivittäminen
app.put('/api/persons/:id', (request, response, next) => {
  console.log("!--Yritetään päivittää numeroa--!")
  const body = request.body
  console.log("sisältä:", request.body)

  const note = {
    name: body.name, 
    number: body.number,
  }

  Note.findByIdAndUpdate(request.params.id, note, { new: true })
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})


//annetussa IDssä olevan tiedon poistaminen
app.delete('/api/persons/:id', (request, response, next) => {
  Note.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

//palautetaa tietoja tietokannasta
app.get('/info', (request, response) => {
  console.log("täälä")
  
    Note.find({}).then(persons => {
      response.send(`Phonebook has info for ${persons.length} people. </br> ${new Date()}`)
    })


  //const messege = 'Phonebook has info for ' + persons.length + ' people '
  //const date = new Date()
  //response.send(messege + "</br>" + date)
  
})

//generoidaan uusi ID randomilla tehtävänanoon mukaisesti
/*const generateId = () => {
  console.log("Randomisoidaan ID")
  const newID = Math.floor(Math.random() * Math.floor(9999999999))
  return newID
}*/

//luodaan uus numero tietokantaan
app.post('/api/persons', (request, response) => {
  const body = request.body
  console.log("Yritetään luoda uutta hekilö tietokantaan. Sisältö:", request.body)

  //tarkistetaan onko nimi jo listassa ja tulostetaan virheilmoitus
  const nimet = persons.map(single => single.name)

  //virheiden ohjaus
  if (!body.name) {
    return response.status(400).json({
      error: 'name is empty'
    })
  } else if (!body.number) {
    return response.status(400).json({
      error: 'number is empty'
    })
  } else if (nimet.includes(body.name)) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  //uuden tiedon rakentaminen
  const uusiNumero = new Note({
    name: body.name,
    number: body.number
  })

  uusiNumero.save().then(savedNote => {
    response.json(savedNote)
  })
})

//virheenkäsittelijä virheviesti
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

//express virheidenkäsittelijä. Hoitaa virheviestien tulostamisen.
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  next(error)
}
app.use(errorHandler)