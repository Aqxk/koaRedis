const http = require('http');
http.createServer((req,res) => {
    if(req.url === '/favicon.icon') {
        res.end('');
        return;
    }
    // 观察cookie
    console.log('cookie:', req.headers.cookie);
    res.setHeader('Set-Cookie', 'cookie=abc');
    res.end('Hello cookie');
}).listen(3000)