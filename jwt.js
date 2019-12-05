const Koa = require('koa');
const router = require('koa-router')();

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
router.get('/users/login-token', async (ctx, next) => {
    const body = ctx.body;
    console.log(body);
    ctx.body = {
        msg: '登陆成功',
        user: {
            name: "肖华"
        },
        token: jwt.sign({
            data: { id: 5 },
            exp: Math.floor(Date.now() / 1000 + 60 * 60)
        }, secret)
    }
})

router.get('/users/getUser-token',
    jwtAuth({secret}),
    async ctx => {
            console.log(ctx.state.user);
            ctx.body = {
                msg: '获取成功',
                user: ctx.state.user.data
            }
    }
)

app.use(router.routes())
app.listen(3000);
