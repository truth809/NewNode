const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    name: {
        type:String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true, //빈칸을 없애주는 역할
        unique: 1 //똑같은 이메일을 쓰지 못하게
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: { //role는 관리자, 일반유저 지정
        type: Number,
        default: 0
    },
    image: String,
    token: { //유효성 검사
        type: String
    },
    tokenExp: { //토큰이 사용할수 있는 기간
        type: Number
    }
})
//스키마를 모델로 감싸기
const User = mongoose.model('User', userSchema)
//다른 곳에서 쓸수잇게
module.exports = { User }