const mongoose = require('mongoose')

mongoose.set('strictQuery',false)


const examSchema = new mongoose.Schema({
    subject: String,
    sem: Number,
    dept: String
  }
  )

examSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
module.exports = mongoose.model('Exam', examSchema)