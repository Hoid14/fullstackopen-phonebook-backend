const express = require('express')
const app = express()


let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/info', (request, response) => {
    // Esta línea de código crea una nueva instancia de la clase Date, que representa la fecha y hora actuales.
    // Luego, convierte esta instancia de Date a una cadena de texto (string) utilizando el método toString().
    
    const time = new Date().toString()
    response.send(`

    <p>Phonebook has info for ${persons.length} people</p>
    <p>${time}</p>
    
    `)
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

const PORT = 3001
app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})