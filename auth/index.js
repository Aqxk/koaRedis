const Koa = require('koa');
const router = require('koa-router')();
const querystring = require('querystring');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const jwtAuth = require('koa-jwt');
const cors = require('koa2-cors');
const bodyParser = require('koa-bodyparser');
const static = require('koa-static');
const app = new Koa();
app.keys = ['some secret'];
const secret = 'wangzhen';
app.use(static(__dirname, '/'));
app.use(bodyParser());
const accessTokens = {};
const config = {
    client_id: 'eec01f7e97202902eff6',
    client_secret: '74f98832b4e495083a67ff35616698b49bf6d282'
}
router.get('/auth/github/login', async (ctx) => {
    const path = `https://github.com/login/oauth/authorize?${querystring.stringify({ client_id: config.client_id })}`;
    ctx.redirect(path);
})
router.get('/auth/github/callback', async (ctx) => {
    let code = ctx.query.code;
    let params = {
        ...config,
        code
    }
    let res = await axios.post('https://github.com/login/oauth/access_token', params)
    let access_token = querystring.parse(res.data).access_token;
    const uid = Math.random() * 99999;
    accessTokens[uid] = access_token;
    let token = jwt.sign({
        data: { uid },
        exp: Math.floor(Date.now() / 1000 + 60 * 60)
    }, secret)
    ctx.response.type = 'html';
    ctx.response.body = `    <script>
    localStorage.setItem('authSuccess', true);
    localStorage.setItem('token','${token}');
    window.close();
</script>`
})
router.get('/auth/github/getUserInfo', jwtAuth({secret}), async (ctx) => {
    let access_token = accessTokens[ctx.state.user.data.uid];
    let userinfo = await axios.get(`https://api.github.com/user?access_token=${access_token}`);
    ctx.body = {
        code: 10000,
        msg: '获取成功',
        data: userinfo.data
    }
})
console.log(accessTokens);
app.use(router.routes())
app.listen(7001);
