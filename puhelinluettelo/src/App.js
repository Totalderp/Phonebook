import React, { useState, useEffect } from 'react'
import numbersService from './services/numbersService'
import './index.css'

//graafisten elementtien importtaaminen yksitellen, jotta käyttäjälle lähetetään mahdollisimman vähän tavaraa
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup'
import ListGroupItem from 'react-bootstrap/ListGroupItem'
import Form from 'react-bootstrap/Form'

const App = () => {
  //Sovelluksen tilan hallitsemiseen käytetyt muuttujat
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)

  //useEffect hakee sovelluksen tiedot JSON muodossa palvelimelta käyttäen numberService luokan axiosia
  useEffect(() => {
    console.log('effect alkaa')
    numbersService
      .getAll()
      .then(response => {
        console.log('effect -> promise fulfilled', response)
        setPersons(response.data)
      })
  }, [])
  console.log('Dataa löydetty:', persons.length, 'kpl')

  //Handler filtterin päivittämistä varten
  const filterMuuttuu = (event) => {
    console.log('filtterikenttä muuttuu:', event.target.value)
    setNewFilter(event.target.value)
  }

  //Handler tekstikentän päivittämistä varten
  const nimiMuuttuu = (event) => {
    console.log('tekstikenttä muuttuu:', event.target.value)
    setNewName(event.target.value)

  }

  //Handler numerokentän päivittämistä varten
  const numeroMuuttuu = (event) => {
    console.log('numerokenttä muuttuu:', event.target.value)
    setNewNumber(event.target.value)

  }

  //Ihmislistan filtteröiminen annetulla filtterillä caseINsensitiivisesti
  const filteredPersons = persons.filter(person => {
    return person.name.toLocaleLowerCase().includes(newFilter.toLowerCase())
  })

  //Handler nimen ja numeron lisäämiselle tietokantaan
  const addNote = (event) => {
    event.preventDefault()
    console.log('Saatu sisältö', newName)

    //tämän simppelin rivin naputteluun meni liian kauan
    //Ottaa kaikki moniulotteisen listan name-tiedot ja tiivistää ne yhteen yksiulotteiseen listaan
    const nimet = persons.map(yksittainen => yksittainen.name)

    console.log('Nimien listassa nyt:', nimet)

    //uunen henkilön tietojen atribuutit
    const lisattavaperson = {
      name: newName,
      number: newNumber
    }

    //jos nimi ei ole vielä listassa
    if (!nimet.includes(newName)) {
      console.log('Pusketaan listaan seuraavat tiedot severille: ', lisattavaperson)

      //lähetetään uusi persons-tieto palvelimelle
      numbersService
        .create(lisattavaperson)
        .then(response => {
          setPersons(persons.concat(response.data))
          console.log('Palvelin vastasi uuteen tietoon:', response)
          //tyhjennetään kentät
          setNewName('')
          setNewNumber('')

          //tulostetaan ilmoitus onnistuneesta lisäyksestä, kesto 5s
          setErrorMessage(
            `Added ${lisattavaperson.name}`
          )
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
      console.log('Listassa nyt: ', persons)
    }

    //2.18 nimi on jo listassa, tarjotaan mahdollisuutta päivittää se
    else {
      //jos ikkunasta klikataan OK, lähetetään numberService komponentille Axionille PUT update käsky
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {

        //tämän rivin kirjoittamiseen meni liian kauan
        const lisattavanID = persons.filter(haeid => haeid.name === lisattavaperson.name)

        //päivitetään vanha tieto
        numbersService
          .update(lisattavanID[0].id, lisattavaperson)
          .then(response => {
            console.log('Palvelin vastasi uuteen tietoon:', response)

            //tyhjennetään kentät
            setNewName('')
            setNewNumber('')

            //päivitetään lista muutoksen jälkeen
            numbersService
              .getAll()
              .then(response => {
                console.log('effect -> promise fulfilled', response)
                setPersons(response.data)
              })
            console.log('Dataa löydetty 3:', persons.length, 'kpl')


            //tulostetaan ilmoitus onnistuneesta tiedon muuttamisesta
            setErrorMessage(
              `Updated number for ${lisattavaperson.name}`
            )
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
          })
      }
    }

  }

  //varsinaisen rungon tulostus
  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={errorMessage} />
      <Filter newFilter={newFilter} filterMuuttuu={filterMuuttuu} />
      <h2>Add a new</h2>
      <PersonForm addNote={addNote} newName={newName} nimiMuuttuu={nimiMuuttuu} newNumber={newNumber} numeroMuuttuu={numeroMuuttuu} />
      <h2>Numbers</h2>
      <PersonsListForm filteredPersons={filteredPersons} setErrorMessage={setErrorMessage} setPersons={setPersons} />
      <a href="https://github.com/Totalderp/Phonebook" >Source code on GitHub</a>
    </div>
  )
}

//Person komponentti. Tulostaa yhden ainoa ihmisen tiedot, sekä poistamiseen käytetty painike
const Person = (props) => {
  return (<ListGroupItem key={props.id}>{props.name}: {props.number}
    <Button className="numberButton" type="submit" onClick={() => {
      const messege = 'Delete ' + props.name
      console.log(messege)
      if (window.confirm(messege)) {
        //jos ikkunasta klikataan OK, lähetetään numberService komponentille Axionille delete käsky
        console.log('Klikattu poista henkilöön:', props.name, 'jonka ID on', props.id)
        numbersService
          .remove(props.id)
          .then(response => {
            console.log('Palvelin vastasi uuteen tietoon:', response)

            //tulostetaan ilmoitus tiedon onnistuneesta poistamisesta
            props.setErrorMessage(
              `Deleted ${props.name}`
            )
            setTimeout(() => {
              props.setErrorMessage(null)
            }, 5000)

            //uudelleen ohjaa sivunlataus, jotta lista päivittyy
            console.log('effect alkaa')
            numbersService
              .getAll()
              .then(response => {
                console.log('päivitetään', response)
                props.setPersons(response.data)
              })

            console.log('Dataa löydetty:', response.length, 'kpl')
          })

          //kriittisen virheen tulostamiseen käytetty luokka
          .catch(error => {
            console.log('Virhe poistaessa, tulostetaan virheilmoitus')
            props.setErrorMessage(
              `Name and number were already removed from server`
            )
            setTimeout(() => {
              props.setErrorMessage(null)
            }, 5000)
          })
      }
    }
    }>Delete</Button></ListGroupItem>)
}

//Person-komponentin kattokomponentti. Valmistaa kaikki listan henkilöt tulostamista varten
const PersonsListForm = (props) => {
  console.log('Tulostetaan Ihmisten hallintaan käytetty lista', props)
  return (
    <ListGroup>
      {props.filteredPersons.map(person =>
        <Person key={person.id} name={person.name} number={person.number} id={person.id} setErrorMessage={props.setErrorMessage} setPersons={props.setPersons} />
      )}</ListGroup>
  )
}

//Filter vastaa filter-kentän ja tekstin tulostamisesta
const Filter = (props) => (
  <Form>
    <Form.Group>
      <Form.Label>Search:</Form.Label>
      <Form.Control type="text" placeholder="Search users by name" value={props.newFilter} onChange={props.filterMuuttuu} />
    </Form.Group>
  </Form>
)

//PersonForm vastaa numero ja nimikentän + add-napin tulostamisesta
const PersonForm = (props) => (
  <Form onSubmit={props.addNote}>
    <Form.Group>
      <Form.Label>Name:</Form.Label>
      <Form.Control type="text" placeholder="Enter new name" value={props.newName} onChange={props.nimiMuuttuu} />
    </Form.Group>
    <Form.Group>
      <Form.Label>Number:</Form.Label>
      <Form.Control type="text" placeholder="Enter new number" value={props.newNumber} onChange={props.numeroMuuttuu} />
    </Form.Group>
    <Form.Group>
      <Button className="filterButton" type="submit">Submit</Button>
    </Form.Group>
  </Form>
)

//Ilmoitusten tulostamiseen käytetty komponentti. Saa parametrinä tulostettavan viestin
const Notification = ({ message }) => {
  //Mikäli viestikentän tulee olla tyhjänä
  if (message === null) {
    return null
  }
  //Virhetilannetta varten varattu viesti
  else if (message === `Name and number were already removed from server`) {
    return (
      <div className="fail">
        {message}
      </div>
    )
  }

  //tavallisen ilnmoituksen (poisto, lisäys ja päivitys) tulostaminen
  return (
    <div className="success">
      {message}
    </div>
  )
}

export default App