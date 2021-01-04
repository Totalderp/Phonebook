const express = require('express')
const app = express()
const morgan = require('morgan')
app.use(express.json())
//asetetaan front end mukaan käyttäen expressiä.
app.use(express.static('build'))

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
      name: "Arto Hellas",
      number: "040-123456"
    },

    {
      id: 2,
      name: "Ada Lovelace",
      number: "39-44-5323523"
    },

    {
      id: 3,
      name: "Dan Abramov",
      number: "12-43-234345"
    },
    {
      id: 4,
      name: "Mary Poppendick",
      number: "39-23-6423122"
    }
]

//eli käytäännössä http://localhost:3001/
app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

//palautetaan kaikki numerot
app.get('/api/persons', (req, res) => {
  res.json(persons)
})

//yksittäisen numeron palauttaminen. Jos ID ei ole olemassa tulostetaan virheilmoitus
app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = persons.find(note => note.id === id)

  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

//annetussa IDssä olevan tiedon poistaminen
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(note => note.id !== id)

  response.status(204).end()
})

//palautetaa tietoja tietokannasta
app.get('/info', (req, res) => {
  const messege = 'Phonebook has info for '+ persons.length + ' people '
  const date = new Date()
  res.send(messege+ "</br>" + date)
})

//generoidaan uusi ID randomilla tehtävänanoon mukaisesti
const generateId = () => {
  console.log("Randomisoidaan ID")
  const newID = Math.floor(Math.random() * Math.floor(9999999999))
  return newID
}

//luodaan uus numero tietokantaan
app.post('/api/persons', (request, response) => {
  const body = request.body
  console.log("Yritetään luoda uutta hekilö tietokantaan. Sisältö:", request.body)

  //tarkistetaan onko nimi jo listassa ja tulostetaan virheilmoitus
  const nimet = persons.map(single => single.name)

  if (!body.name) {
    return response.status(400).json({ 
      error: 'name is empty' 
    })
  }else if(!body.number) {
    return response.status(400).json({ 
      error: 'number is empty' 
    })
  }else if(nimet.includes(body.name)) {
    return response.status(400).json({ 
      error: 'name must be unique' 
  })}

  const uusiNumero = {
    id: generateId(),
    name: body.name,
    number: body.number
    
  }

  persons = persons.concat(uusiNumero)
  console.log('Uusi numero luotu!')
  response.json(uusiNumero)
})

//merkitään mitä porttia kuunellaan
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})