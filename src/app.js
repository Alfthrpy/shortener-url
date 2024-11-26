import express from 'express';
import url from 'url';
import shortener from '../src/shortener.js';
import dotenv from "dotenv";
import path from 'path';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

// Menentukan path absolut untuk folder public
const publicDirectory = path.join(__dirname, 'public');

app.use(express.json());
app.use('/shortener', shortener);

// Menggunakan path absolut untuk file statis
app.get('/', (req, res) => {
    console.log(publicDirectory)
    return res.sendFile('index.html', { root: publicDirectory });
});

app.get('/start', (req, res) => {
    return res.sendFile('start.html', { root: publicDirectory });
});

app.get('/about', (req, res) => {
    return res.sendFile('about.html', { root: publicDirectory });
});

app.use('*', (req, res) => {
    return res.sendFile('not-found.html', { root: publicDirectory });
});

app.listen(port, () => {
    console.log('listening on port ' + port);
});

export default app;
