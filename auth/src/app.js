import express from 'express'
import authRouter from './routes/auth.route.js'
import cookieParser from 'cookie-parser';

const app = express();
app.use(express.json()) // this is middleware (meaning it runs on every request before hitting the route). Without this, req.body will be undefined when user sends register/login data

app.use(cookieParser()); // without this can't read cookie || req.cookies = 'undefined' 

app.use('/api/auth', authRouter); // "any URL starting with /api/auth — hand it to authRouter to handle"


// app.get('/', (req, res) => {
//     res.send('Hello!')
// })

export default app