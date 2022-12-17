const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const api = require('./middleware/api')
const templateRouter = require('./routes/template')

mongoose.connect('mongodb://127.0.0.1:27017/template', {
  useNewUrlParser: true
})
const app = express()

// middleware
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: false
  })
)
app.use(api)

app.use('/xhr/v1/', templateRouter)

app.listen(8080)
