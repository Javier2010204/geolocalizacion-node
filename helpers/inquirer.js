const inquirer = require('inquirer');
require('colors');


const preguntas = [
    {
        type: 'list',
        name: 'opcion',
        message: 'Que deseas hacer?',
        choices: [
            {
                value: 1,
                name: `${'1.'.green} Buscar ciudad`
            },
            {
                value: 2,
                name: `${'2.'.green} Historial`
            },
            {
                value: 0,
                name: '0. Salir'.magenta
            }
        ]
    }
];

const inquirerMenu = async() => {

    console.clear();
    console.log("=============================");
    console.log("   Seleccione una opcion".white);
    console.log("=============================");
    console.log();

    const {opcion} = await inquirer.prompt(preguntas);
    return opcion;
}


const leerInput = async(message) => {

    const pregunta = [
        {
            type: 'input',
            name: 'desc',
            message,
            validate(value){
                if(value.length == 0){
                    return 'Por favor ingrese un valor';
                }
                return true
            }
        }
    ]

    const { desc } = await inquirer.prompt(pregunta);

    return desc;

}


const listaLugares = async(lugares = [])=>{

    const choices = lugares.map((lugar, i) => {

        const idx = `${i + 1}.`.green;

        return{
            value: lugar.id,
            name: `${idx} ${lugar.nombre}`
        }

    });

    choices.unshift({
        value: '0',
        name: '0. Cancelar'.magenta
    });

    const preguntas = [
        {
            type: 'list',
            name: 'id',
            message: 'Seleccione un lugar:',
            choices
        }
    ]

    const {id} = await inquirer.prompt(preguntas);
    return id;
}

const pausar = async() => {

    const pregunta = [
        {
            type: 'input',
            name: 'enter',
            message: `Presione ${'ENTER'.magenta} para continuar`
        }
    ]

    console.log('\n');
    await inquirer.prompt(pregunta)
}


module.exports = {
    inquirerMenu,
    pausar,
    leerInput,
    listaLugares
}