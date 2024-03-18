const mongoose = require('mongoose')

mongoose.set('strictQuery',false)


const examhallnewSchema = new mongoose.Schema({
    roomno: String,
    use: Boolean,
    capacity: Number,
    rows: Number,
    cols: Number,
    lim: Number,
    benches: [
    ]
  }
  )

examhallnewSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Examhallnew', examhallnewSchema)