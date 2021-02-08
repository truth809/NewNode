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
        minlength: 5,
        maxlength: 70
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




userSchema.methods.comparePassword = function (plainPassword, cb) {
    //plainPassword 1234567    암호회된 비밀번호 $2b$10$l492vQ0M4s9YUBfwYkkaZOgWHExahjWC
    bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    })
}

userSchema.methods.generateToken = function (cb) {
    var user = this;
    // console.log('user._id', user._id)

    // jsonwebtoken을 이용해서 token을 생성하기 
    var token = jwt.sign(user._id.toHexString(), 'secretToken')
    // user._id + 'secretToken' = token 
    // -> 
    // 'secretToken' -> user._id

    user.token = token
    user.save(function (err, user) {
        if (err) return cb(err)
        cb(null, user)
    })
}
userSchema.statics.findByToken = function(token, cb) {
    var user = this;
    // user._id + ''  = token
    //토큰을 decode 한다. 
    jwt.verify(token, 'secretToken', function (err, decoded) {
        //유저 아이디를 이용해서 유저를 찾은 다음에 
        //클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인
        user.findOne({ "_id": decoded, "token": token }, function (err, user) {
            if (err) return cb(err);
            cb(null, user)
        })
    })
}

userSchema.statics.findByToken = function(token, cb) {
    var = user = this;

    // 토큰을 decode 한다.
    jwt.verify(token, 'secretToken', function(err, decoded) {
        // 유저 아이디를 이용해서 유저를 찾은 다음에
        // 클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인

        user.findOne({ "_id": decoded, "token": token }, function(err, user) {
            if(err) return cb(err);
            cb(null, user)
        })
    })
}

//스키마를 모델로 감싸기
const User = mongoose.model('User', userSchema)
//다른 곳에서 쓸수잇게
module.exports = { User }