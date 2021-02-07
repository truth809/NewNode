const express = require('express')
const app = express()
const port = 5000

const config = require('./config/key');

// 유저 가져오기
const { User } = require('./models/User');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));

app.use(bodyParser.json());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, 'mongodb+srv://truth809:123123qq@cluster0.oxuxg.mongodb.net/<dbname>?retryWrites=true&w=majority', {
  //이걸 써야 에러가 안생김  
	useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('mongoDB connect success...'))
.catch(err => console.log('errrrrrrrrrrr',err))

app.get('/', (req, res) => {
  res.send('새해 복 많이 받으세요!')
})

app.post('/register', (req, res) => {

    // 회원가입 할때 필요한 정보들을 client에서 가져오면
    // 그것들을 데이터 베이스에 넣어준다.
    const user = new User(req.body)

    // 몽고DB 메소드
    // req.body의 정보들이 user모델에 저장, 콜백펑션
    user.save((err, userInfo) => {
        if(err) return res.json({ success: false, err })
        return res.status(200).json({
            success: true
        })
    })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})