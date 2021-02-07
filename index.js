const express = require('express')
const app = express()
const port = 5000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://truth809:123123qq@cluster0.oxuxg.mongodb.net/<dbname>?retryWrites=true&w=majority', {
  //이걸 써야 에러가 안생김  
	useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('mongoDB connect success...'))
.catch(err => console.log('errrrrrrrrrrr',err))