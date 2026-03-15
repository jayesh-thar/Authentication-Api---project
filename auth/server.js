import dotenv from 'dotenv'
dotenv.config(); 
// first thing before any other import // app.js might need process.env values when it loads. If dotenv.config() runs after — those values are undefined at that point.
import app from './src/app.js' 
import connectionDB from './src/config/db.js'

connectionDB()


const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
}) 
// app.listen() is flexible — if port is undefined it just picks a random available port on its own. It doesn't crash.
// SOLUTION: ||
// || means — "if left side is undefined/empty, use right side". So if .env fails for any reason — server still runs on 5000.