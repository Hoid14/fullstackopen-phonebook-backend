// Importar mongoose
const mongoose = require('mongoose')

// Desactiva la opción 'strictQuery' en Mongoose. Esto permite que las consultas en Mongoose incluyan campos que no están definidos en el esquema.
mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
    .then(result =>{
        console.log('connected to MongoDB')
    })
    .catch(error =>{
        console.log('error connecting to MongoDB:', error.message)
    })

// El schema le dice a la base de datos la estructura de los datos
const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: {
        type:String,
        required: true
    },
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})


// El modelo usa la estructura del esquema para crear nuevas instancias
module.exports = mongoose.model('Person', personSchema)