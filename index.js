import express from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;
const jokeUrl = 'https://v2.jokeapi.dev/joke/';
// const weatherUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=${part}&appid=${weatherapi}`;
const geoApi = 'e9c6c17ae1785e22f52adb763b13ce51';
const weatherapi = 'd66feba840a248e39d8110731252509';

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
		res.render('index.ejs', {e: 'NO SUCH FOUND!'});
    }
})

app.post('/weather', async (req, res) => {
    try {
        const data = req.body;
        const name = data['name'];
        const code = data['code'];
        const geocode = await axios.get(
            `http://api.openweathermap.org/geo/1.0/direct?q=${name},${code}&limit=1&appid=${geoApi}`);
        // console.log(geocode);
        // res.redirect('/');
        console.log(geocode.data);
        var lat = geocode.data[0].lat;
        var lon = geocode.data[0].lon;
        console.log('first try worked', lat, lon);

    } catch (error) {
        console.log('first try error : ',error);
        res.render('index.ejs', {geoErr: 'wrong input'});
    }

    try {
        const weatherUrl = await axios.get(
            `http://api.weatherapi.com/v1/forecast.json?key=${weatherapi}&q=${lat},${lon}&days=1&aqi=no&alerts=no`);

        console.log(weatherUrl.data.forecast.forecastday[0].day.condition);
        const status = weatherUrl.data.forecast.forecastday[0].day.condition
         const picture = 'https:' + status.icon;
        res.render('index.ejs', {stat: status.text , picture: picture});

    } catch (error) {
        console.log('second try error : ', error);
        res.render('index.ejs', {weatherError: 'reached the limit'})
    }
    
})



app.listen(port, () => {
    `listenint to port: ${port}`
});