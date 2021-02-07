const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const e = require('express');
const saltRounds = 10;
var jwt = require('jsonwebtoken');

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

userSchema.pre('save', function(next) {
    var user = this;
    // 패스워드가 변환 될때만
    if(user.isModified('password')) {
        // 비밀번호를 암호화 시킨다.
        bcrypt.genSalt(saltRounds, function(err, salt) {
        if(err) return next(err)

        bcrypt.hash(user.password, salt, function(err, hash) {
            if(err) return next(err)
            user.password = hash
            next()
        })
    })
    } else {
        next()
    }
})


//스키마를 모델로 감싸기
const User = mongoose.model('User', userSchema)
//다른 곳에서 쓸수잇게
module.exports = { User }

userSchema.methods.comparePassword = function(plainPassword, cb) {
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if(err) return cb(err);
        cb(null, isMatch);
    })
}

userSchema.methods.generateToken = function(cb) {
    var user = this;
    // jsonwebtoken을 이용해서 token을 생성하기
    var token = jwt.sign(user._id.toHexString(), 'secretToken')
    
    // user._id + 'secretToken' = token
    // 'secretToken' -> user._id
    user.token = token
    user.save(function(err, user) {
        if(err) return cb(err);
        cb(null, user);
    })
}