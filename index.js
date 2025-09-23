import express from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;
const jokeUrl = 'https://v2.jokeapi.dev/joke/';


app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true}));

app.get('/', (req, res) => {
    res.render('index.ejs');
});

app.post('/joke', async (req, res) => {
    const language = req.body['language'];
    const category = req.body['category'];
    console.log(language, category);

    try{
        switch (language) {
            case 'en':
                var joke = await axios.get( jokeUrl + category);
            default:
                var joke = await axios.get( jokeUrl + category +'?lang=' + language);
        };
			console.log(joke.data)
			if (joke.data.joke){
            	var mainJoke = joke.data.joke;
			} else {
				var mainJoke = joke.data.setup + joke.data.delivery;
			};
            res.render('index.ejs', {data: mainJoke})
    } catch (err) {
        console.log('error:', err);
		res.redirect('/', {e: 'NO SUCH FOUND!'});
    }
})





app.listen(port, () => {
    `listenint to port: ${port}`
});