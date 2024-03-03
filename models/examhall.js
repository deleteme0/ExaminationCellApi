const mongoose = require('mongoose')

mongoose.set('strictQuery',false)


const examhallSchema = new mongoose.Schema({
    roomnumber: String,
    capacity: Number,
    use: Boolean,
    preset: [Number,[]],
    benches: [
    ]
  }
  )

examhallSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
module.exports = mongoose.model('Examhall', examhallSchema)