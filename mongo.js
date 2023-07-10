const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://jeremyrussell:${password}@fsobook.qcwizb6.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)



const personsSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Persons = mongoose.model('Person', personsSchema)


if (process.argv.length === 3) {
  Persons.find({}).then(result => {

    console.log('Phonebook:')
    result.forEach(person => {
      console.log(person.name, person.number)
    })
    mongoose.connection.close()
  })

}

if (process.argv.length === 5) {
  const saveName = process.argv[3]
  const saveNumber = process.argv[4]

  const person = new Persons({
    name: saveName,
    number: saveNumber
  })

  person.save().then(result => {
    console.log(`added ${saveName}'s number (${saveNumber}) `)
    mongoose.connection.close()
  })
}



// const note = new Note({
//   content: 'Testing July 7',
//   important: true,
// })

// note.save().then(result => {
//   console.log('note saved!')
//   mongoose.connection.close()
// })