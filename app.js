const { inquirerMenu, pausar, leerInput, listaLugares } = require('./helpers/inquirer.js');
const Busquedas = require('./models/busquedas');


const main = async() => {

    const busquedas = new Busquedas();

    let opt = 0;

    do{
        opt = await inquirerMenu();
        switch(opt){

            case 1:
                busquedas.leerDB();
                //Mostrar mensaje
                const lugar = await leerInput('Ingrese la ciudad: ');

                //Buscar Lugares 
                const lugares = await busquedas.ciudades(lugar);
    
                //Seleccionar lugar
                const id = await listaLugares(lugares);
                const lugarSeleccionado = lugares.find(l => l.id === id);

                busquedas.agregarHistorial(lugarSeleccionado.nombre);
                
                //Clima
                const climaLugar = await busquedas.climaPorLugar(lugarSeleccionado.lat, lugarSeleccionado.lng);

                //Mostrar resultados


                console.log("\n Informacion de la ciudad \n");
                console.log('Ciudad: ', lugarSeleccionado.nombre);
                console.log('Lat: ', lugarSeleccionado.lat);
                console.log('Lng: ', lugarSeleccionado.lng);
                console.log('Temperatura: ', climaLugar.temperatura);
                console.log('Minima: ', climaLugar.min);
                console.log('Maxima: ', climaLugar.max);
                console.log('Descripción: ', climaLugar.desc);
            break;

            case 2:
                busquedas.historialCapitalizado.forEach((lugar,i) => {
                    const idx = `${i + 1}.`;

                    console.log(`${idx} ${lugar}`);
                })
            break;
        }

        if(opt !== 0) await pausar();

    }while(opt !== 0);
}


main();