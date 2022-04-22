const http = require('http')
const express = require('express')
const fs = require('fs')

const app = express()
const server = http.createServer(app)
const port = 3001

// simple function to create a random id
const generateId = () => {
  return Math.round(Math.random() * 100000000)
}

// this line is required to parse the request body
app.use(express.json())

/* util functions */
// read the people data from the json file
const savePeopleData = (data) => {
  const stringifyData = JSON.stringify(data)
  fs.writeFileSync('people.json', stringifyData)
}

// get the people data from json file
const getPeopleData = () => {
  const jsonData = fs.readFileSync('people.json')
  return JSON.parse(jsonData)
}

/* CRUD Operations go here */ /////////////////////////////////////////////////////////////
/* Create - POST method */
app.post('/people', (req, res) => {
  const people = getPeopleData()

  if (!req.body.name) {
    return res.status(401).send({ error: true, message: 'Person data is missing name' })
  }

  const newPerson = {
    id: generateId(),
    name: req.body.name,
    createOn: new Date()
  }

  person.push(newPerson)
  savePeopleData(people)
  res.send({ success: true, message: 'Person added successfully'})
})

/* Read - GET method */
app.get('/people', (req, res) => {
  const people = getPeopleData()
  res.send(people)
})

/* Update - PUT/PATCH method */
app.put('/people/:id', (req, res) => {
  const people = getPeopleData()
  const person = people.find(person => person.id === parseInt(req.params.id))
  
  if (person) {
    const updated = {
      id: person.id,
      name: req.body.name || person.name,
      createdOn: req.body.createdOn || person.createdOn
    }
    
    const targetIndex = people.indexOf(person)
    people.splice(targetIndex, 1, updated)
    savePeopleData(people)
    res.send({ success: true, message: 'People updated successfully!'})
  } else {
    res.send(404)
  }
})

/* Delete - DELETE method */
app.delete('/people/:id', (req, res) => {
  const people = getPeopleData()
  const id = req.params.id

  const filteredPeople = people.filter(person => person.id !== id)
  if (people.length === filteredPeople.length) {
    return res.status(409).send({ error: true, message: 'User does not exist'})
  }
  savePeopleData(filteredPeople)
  res.send({ success: true, message: 'User removed successfully'})
})
/* CRUD Operations go here */ /////////////////////////////////////////////////////////////

server.listen(port, () => console.log(`server is listening on port ${port}`))