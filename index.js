import express from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;
const jokeUrl = 'https://v2.jokeapi.dev/joke';


app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true}));

app.get('/', (req, res) => {
    res.render('index.ejs');
});







app.listen(port, () => {
    `listenint to port: ${port}`
});