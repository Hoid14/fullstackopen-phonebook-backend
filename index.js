/*
Es importante que dotenv se importe antes 
de importar el modelo de Person. Esto garantiza 
que las variables de entorno del archivo .env 
estén disponibles globalmente antes de importar 
el código de los otros módulos.
*/
// Necesario para usar las variables de entorno
require('dotenv').config()
// Importamos el módulo Express, que es un marco de aplicación web para Node.js.
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
// Importamos el modelo person, de esta manera la variable Person será asignada al mismo objeto que define el módulo
const Person = require('./models/person')

// Creamos una nueva instancia de una aplicación Express. `app` es un objeto que tiene métodos para rutas y middleware, entre otras cosas.
const app = express()

// Añadimos el middleware `express.json()` a la pila de middleware de la aplicación. Este middleware analiza los cuerpos de las solicitudes entrantes en un formato JSON, lo que significa que podemos acceder al cuerpo de la solicitud como un objeto JavaScript en nuestros controladores de rutas.
app.use(express.json())

// Añadimos el middleware para permitir solicitudes de todos los orígenes, por defecto perimite solicitudes de todos los orígenes
app.use(cors())

// Para que Express muestre contenido estático , la página index.html y JavaScript, etc., necesitamos un middleware integrado de Express llamado static .
// Cada vez que Express recibe una solicitud HTTP GET, primero verificará si el directorio dist contiene un archivo correspondiente a la dirección de la solicitud. Si se encuentra un archivo correcto, Express lo devolverá.
app.use(express.static('dist'))

morgan.token('body', (req)=>{
    if(req.method==='POST'){
        return JSON.stringify(req.body)
    }
    else{
        return ''
    }
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// Los controladores de errores de express son middleware que se definen con una función que acepta cuatro parámetros. Nuestro controlador de errores se ve así:
const errorHandler = (error, request, response, next) =>{
    console.error(error.message)

    if(error.name === 'CastError'){
        // 400 = mala solicitud (sintaxis de peticion malformateada)
        return response.status(400).send({error:'malformatted id'})
    }

    next(error)
}



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

app.get('/info', morgan('tiny'), (request, response) => {
    // Esta línea de código crea una nueva instancia de la clase Date, que representa la fecha y hora actuales.
    // Luego, convierte esta instancia de Date a una cadena de texto (string) utilizando el método toString().
    const time = new Date().toString()
    response.send(`

    <p>Phonebook has info for ${persons.length} people</p>
    <p>${time}</p>
    
    `)
})

//Se hace solicitud GET a la url
app.get('/api/people', (request, response) => {
    //Busca todas las personas de la base de datos
    Person.find({})
    .then(people =>{
        //Reponde y muestra en la pagina de la url todas las personas en formato json
        response.json(people)
    })
})

app.get('/api/people/:id', (request, response, next) => {
    Person.findById(request.params.id)
    .then(person=>{
        if(person){
            response.json(person)
        }
        else{
            response.status(404).end()
        }
    })
    .catch(error=>next(error))
})

app.delete('/api/people/:id', (request, response) => {
    //dentro de la request busca el id y se lo pasa al metodo findByIdAndDelete 
    Person.findByIdAndDelete(request.params.id)
    .then(result=>{
        //204 = sin contenido y finaliza el proceso de respuesta
        response.status(204).end()
    })
    

})

// const getRandomInt = () => {
//     // array de ids
//     const max = 1000
//     const ids = persons.map(person=>person.id)
//     let random = Math.floor(Math.random()*max)
//     while(ids.includes(random)){
//         random = Math.floor(Math.random()*max)
//     }
//     return random
// }

// const checkName = (name) =>{
//     const names = persons.map(person => person.name)
    
//     return names.includes(name)
// }

app.post('/api/people', (request, response) => {
    const body = request.body

    if(!body.name && !body.number){
        // Codigo 400: solicitud incorrecta
        return response.status(400).json({
            error: 'name and number missing'
        })
    }
    if(!body.name){
        // Codigo 400: solicitud incorrecta
        return response.status(400).json({
            error: 'name missing'
        })
    }
    if(!body.number){
        // Codigo 400: solicitud incorrecta
        return response.status(400).json({
            error: 'number missing'
        })
    }

    
    // if(checkName(body.name)){
    //     // Codigo 400: solicitud incorrecta
    //     return response.status(400).json({
    //         error: 'name must be unique'
    //     })
    // }

    //Los objetos de person se crean con la funcion constructora Person (modelo)
    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson=>{
        response.json(savedPerson)
    })
})
// El middleware de manejo de errores tiene que ser el último middleware cargado
// Todas las rutas deben ser registradas antes de este middleware
app.use(errorHandler)

// De esta forma se usan las variables de entorno del archivo .env
const PORT = process.env.PORT
app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})