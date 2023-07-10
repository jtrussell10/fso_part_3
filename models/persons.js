const mongoose = require('mongoose')

mongoose.set('strictQuery', false)



const url = process.env.MONGODB_URI


console.log('connecting to', url)

mongoose.connect(url)

  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personsSchema = new mongoose.Schema({
  name: { type: String,
    minLength: [3, 'The name must be at least 3 characters long'],
    required: true },
  number: { type: String,
    validate: {
      validator: function(v) {
        return /^\d{2,3}-\d{1,12}-?\d{0,12}$/.test(v)
      },
      message: props => `Phone numbers must consist of 2-3 numbers followed by a dash. ${props.value} is not a valid number`
    },
    minLength: 8,
    required: true },
})

personsSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


module.exports = mongoose.model('Person', personsSchema)