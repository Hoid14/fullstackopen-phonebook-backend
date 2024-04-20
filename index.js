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

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if(person){
        response.json(person)
    }else{
        // Esta línea de código establece el código de estado HTTP de la respuesta a 404, que indica que el recurso solicitado no se encontró.
        // Luego, termina el proceso de respuesta, lo que significa que no se pueden enviar más datos al cliente.
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    // Este metodo deja solo las personas cuyo id sea diferente al id de request.params.id
    persons = persons.filter(person => person.id !== id)
    // Esta línea de código establece el código de estado HTTP de la respuesta a 204, que indica que la solicitud ha sido procesada con éxito pero no hay contenido para devolver.
    // Luego, termina el proceso de respuesta, lo que significa que no se pueden enviar más datos al cliente.
    response.status(204).end()
})

const PORT = 3001
app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})