const mongoose = require('mongoose')

mongoose.set('strictQuery',false)


const deptstudentSchema = new mongoose.Schema({
    dept: String,
    sem: Number,
    total: Number,
    use: Boolean,
    rollnos: [Number]
  }
  )

deptstudentSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
module.exports = mongoose.model('Deptstudent', deptstudentSchema)