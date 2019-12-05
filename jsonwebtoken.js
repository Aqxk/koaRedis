const jwt = require('jsonwebtoken');
const secret = '123321';

const opt = {
    secret: 'jwt_secret',
    key: 'user'
}
const user = {
    username: 'abc',
}
const token = jwt.sign({
    data: user,
    exp: Math.floor(Date.now() / 1000 + 60 * 60)
}, secret)

console.log('生成token',token);

console.log('解码', jwt.verify(token, secret),opt);