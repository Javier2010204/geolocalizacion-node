const fs = require('fs');

require('dotenv').config()
const axios = require('axios');


class Busquedas{

    historial = [];
    dbPath = './db/database.json';

    constructor(){
        this.leerDB();
    }

    get historialCapitalizado(){
        return this.historial.map(lugar => {
            
            let palabras = lugar.split(' ');

            palabras = palabras.map(palabra => palabra[0].toUpperCase() + palabra.substring(1));

            return palabras.join(' ');
        });
    }

    get paramsMapBox(){
        return {
            'limit': 5,
            'language': 'es',
            'access_token': process.env.MAPBOXKEY 
        }
    }

    get paramsWeatherAPI(){
        return{
            appid: process.env.OPEN_WEATHER_KEY,
            units: 'metric',
            lang: 'es'
        }
    }

    async ciudades(lugar=''){

        try{

            const urlMap = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapBox
            });

            const res = await urlMap.get();

            return res.data.features.map(lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]
            }))
        }catch(error){
            return [];
        }
    }

    async climaPorLugar(lat, lon){

        try{

            const urlWeather = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: { ...this.paramsWeatherAPI, lat, lon}
            })

            const res = await urlWeather.get();

            // destructuramos para utilizar solo la propiedad y no todo el res.data.weather.etc.
            const {weather, main} = res.data;

            return {
                desc: weather[0].description,
                temperatura: main.temp,
                min: main.temp_min,
                max: main.temp_max
            }

            // return res.data.map(clima => ({
            //     description: clima.weather[0].description,
            //     min: clima.main.temp_min,
            //     max: clima.main.temp_max,
            //     temperatura: clima.main.temp
            // }))

        }catch(err){
            console.log(err);
        }

    }

    agregarHistorial(lugar = ''){

        if(this.historial.includes(lugar.toLowerCase())){
            return;
        }

        this.historial = this.historial.splice(0,9);

        this.historial.unshift(lugar.toLowerCase());

        this.guardarHistorialDB();
    }

    guardarHistorialDB(){

        const payload = {
            historial: this.historial
        };

        fs.writeFileSync(this.dbPath, JSON.stringify(payload))

    }

    leerDB(){
        
        if(!fs.existsSync(this.dbPath)){
            return null;
        }

        const info = fs.readFileSync(this.dbPath, {encoding: 'utf8'});

        const data = JSON.parse(info);

        this.historial = data.historial

        return this.historial;

    }

}

module.exports = Busquedas;