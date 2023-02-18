const mongoose = require('mongoose')

mongoose.set("strictQuery",false)
mongoose.connect("mongodb+srv://ankit12:ankit123@cluster0.9gqrb.mongodb.net/?retryWrites=true&w=majority")

module.exports = mongoose
