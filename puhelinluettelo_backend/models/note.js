//erillinen moduuli tietokantaan yhdistämiseen 
//dotev noutuu salasanat erillisestä tiedostosta
const mongoose = require('mongoose')
const url = process.env.MONGODB_URI
console.log('connecting to', url)
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

//tietokannan schema
const noteSchema = new mongoose.Schema({
    name: String,
    number: String,
})

//postetaan osa palautetuista tiedoista, kuten versionumero, sekä muutetaan oliomuodossa oleva id stringiksi
noteSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Note', noteSchema)