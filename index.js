import Koa from 'koa';
import Router from 'koa-router';
import IO from 'koa-socket';
import send from 'koa-send';


const app = new Koa();
const io = new IO();
const router = new Router();

io.attach(app);

router.get('/', (ctx) => {
    ctx.body = 'Index Route';
});

router.get('/register', async (ctx) => {
    await send(ctx, './register.html');
});

app.use(router.routes()).use(async function (ctx, next) {
    const start = new Date();
    await next();
    console.log( new Date() - start, 'See the Date')
    ctx.redirect('/')
});

let numUsers = 0;
let addedUser = false;

let SavedUserName = {};

io.use(async function ( ctx, next ) {
    await next()
})

io.on('connection', ctx => {
    console.log( 'New Connection Id', ctx.socket.id )   
})

io.on('new message', (ctx, data) => {
    io.broadcast('new message', {
      username: SavedUserName[ctx.socket.id],
      message: data
    });
});

io.on('typing', (ctx) => {
    io.broadcast('typing', {
        username: SavedUserName[ctx.socket.id]
    });
});
    
io.on('stop typing', (ctx) => {
    io.broadcast('stop typing', {
        username: SavedUserName[ctx.socket.id]
    });
});

io.on('disconnect', (ctx) => {
    if (addedUser) {
        --numUsers;
        io.broadcast('user left', {
            username: SavedUserName[ctx.socket.id],
            numUsers: numUsers
        });
    }
});

io.on('add user', (ctx, username) => {
    SavedUserName[ctx.socket.id] = username;

    ++numUsers;
    addedUser = true;

    ctx.socket.emit('login', {
      numUsers: numUsers
    });

    io.broadcast('user joined', {
      username: SavedUserName[ctx.socket.id],
      numUsers: numUsers
    });
});


app.listen(3000);