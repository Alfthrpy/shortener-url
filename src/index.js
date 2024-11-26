import express from 'express';
import url from 'url'
import shortener from './shortener.js'
import dotenv from "dotenv";
dotenv.config();


const app = express();
const port = 3000
const __dirname = url.fileURLToPath(new URL('.',import.meta.url))
app.use(express.json())
app.use('/shortener',shortener)
app.get('/', (req, res) => {
    return res.sendFile('./public/index.html',{root:__dirname});
})

app.get('/start', (req, res) => {
    return res.sendFile('./public/start.html',{root:__dirname});
})

app.get('/about', (req, res) => {
    return res.sendFile('./public/about.html',{root:__dirname});
})

app.use('*', (req, res) => {
    return res.sendFile('./public/not-found.html',{root:__dirname});
})

app.listen(port,()=>{
    console.log('listening on port '+port); 
})

