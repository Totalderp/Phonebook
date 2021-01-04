import axios from 'axios'
const baseUrl = '/api/persons'
//Tämä komponentti vastaa REST kommunikoinnista tietokannan kanssa käyttäen AXIOSia
//Axios on käytännössä siistinpi tapa tehdä fetch

//palauttaa kaikki tiedot
const getAll = () => {
  return axios.get(baseUrl)
}

//luo uuden nimen ja numeron tietokantaan
const create = newObject => {
  return axios.post(baseUrl, newObject)
}

//Päivittää annetun ID:n tiedot
const update = (id, newObject) => {
  return axios.put(`${baseUrl}/${id}`, newObject)
}

//Poistaa annetun ID:n omaavan tiedon
const remove = (id) => {
    console.log('Poistetaan käyttäjä ID:', id)
    console.log('Osoitteesta', baseUrl,'/', id)
    return axios.delete(`${baseUrl}/${id}`)
}

//exportattavat funktiot
export default { 
  getAll: getAll, 
  create: create,
  remove: remove,
  update: update 
}