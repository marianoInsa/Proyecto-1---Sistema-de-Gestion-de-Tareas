import { cargarTareas, obtenerTareas } from "./moduloCargarTareas.js";

function mostrarTareasPorConsola(tareas) {
    console.log('ID  -        DESCRIPCION               -     ESTADO')
    for (let i = 0; i < tareas.length; i++) {
        console.log(`${tareas[i].id}   -   ${tareas[i].descripcion}   -   ${tareas[i].estado ? 'Completado' : 'Sin Completar'}`)
    }
    console.log(`Cantidad de Tareas: ${contTareas}
    Completadas: ${contTareasCompetadas}
    Sin Completar: ${contTareasSinCompletar}
    Porcentaje Completado: ${((contTareasCompetadas / contTareas) * 100).toFixed(2)}%`)
}

const ulGeneral = document.createElement('ul');
ulGeneral.setAttribute('id', 'listaGeneral');

const ulCompletadas = document.createElement('ul');
ulCompletadas.setAttribute('id', 'listaCompletadas');
    
const ulSinCompletar = document.createElement('ul');
ulSinCompletar.setAttribute('id', 'listaSinCompletar');

const contenedorListadoGeneral = document.getElementById('listadoGeneral');
contenedorListadoGeneral.appendChild(ulGeneral);

const contenedorListadoCompletadas = document.getElementById('listadoCompletadas');
contenedorListadoCompletadas.appendChild(ulCompletadas);

const contenedorListadoSinCompletar = document.getElementById('listadoSinCompletar');
contenedorListadoSinCompletar.appendChild(ulSinCompletar);

let contTareas = 0;
let contTareasCompetadas = 0;
let contTareasSinCompletar = 0;

function crearTarea(tarea) {
    const liGeneral = document.createElement('li');
    liGeneral.setAttribute('id', `tareaGen${tarea.id}`);
    liGeneral.innerText = `${tarea.id} - ${tarea.descripcion} - ${tarea.estado ? 'Completado' : 'Sin completar'}`;
    ulGeneral.append(liGeneral);
    contTareas++;
    if (tarea.estado) {
        const liCompletadas = document.createElement('li');
        liCompletadas.setAttribute('id', `tareaCom${tarea.id}`);
        liCompletadas.innerText = `${tarea.id} - ${tarea.descripcion}`;
        ulCompletadas.append(liCompletadas);
        contTareasCompetadas++;
    } else {
        const liSinCompletar = document.createElement('li');
        liSinCompletar.setAttribute('id', `tareaSin${tarea.id}`);
        liSinCompletar.innerText = `${tarea.id} - ${tarea.descripcion}`;
        ulSinCompletar.append(liSinCompletar);
        contTareasSinCompletar++;
    }
}

function mostrarTareas(tareas) {
    tareas.forEach(function(tarea) {    
        crearTarea(tarea);
    });
}

async function main() {
    await cargarTareas(); // Espera a que se carguen las tareas

    let tareas = obtenerTareas();
    console.log(tareas);
    let contID = tareas.length + 1;

    // Mostrar tareas
    mostrarTareas(tareas);
    console.log('Lista inicial de tareas: ');
    mostrarTareasPorConsola(tareas);

    // Agregar tarea
    botonAgregarTarea.addEventListener('click', event => {
        event.preventDefault();
        let desc = prompt('Ingrese una descripcion para su tarea: ');
        tareas.push({id: contID, descripcion: desc, estado: false});
        crearTarea(tareas[tareas.length - 1]);
        console.log(`Tarea agregada: 
        ID = ${tareas[tareas.length - 1].id}
        Descripcion: ${[tareas.length - 1].descripcion}
        Estado: Sin Completar`);
        contID++;
        console.log('Nueva lista de tareas: ');
        mostrarTareasPorConsola(tareas);
    });

    // Completar tarea
    botonCompletarTarea.addEventListener('click', () => {
        if (ulSinCompletar.childNodes.length > 0) {
            const idTarea = parseInt(prompt('Ingrese el ID de la tarea a completar:'));
            let bandera = false;
            let indice;
            for (let i = 0; i < tareas.length; i++) {
                if (idTarea == tareas[i].id && (!tareas[i].estado)) {
                    bandera = true;
                    indice = i;
                    break;
                }
            }
            if (bandera) {
                console.log(`Tarea a completar encontrada.
                ID Buscado: ${idTarea}
                ID Encontrado: ${tareas[indice].id}`);
                tareas[indice].estado = true;
                console.log('Nueva lista de tareas: ');
                contTareasCompetadas++;
                contTareasSinCompletar--;
                mostrarTareasPorConsola(tareas);
                let aux = document.getElementById(`tareaGen${tareas[indice].id}`);
                aux.innerText = `${tareas[indice].id} - ${tareas[indice].descripcion} - Completado`;

                // eliminarla del apartado de tareas sin completar
                aux = document.getElementById(`tareaSin${tareas[indice].id}`);
                aux.parentNode.removeChild(aux);

                // agregarla al apartado de tareas completadas
                aux = document.createElement('li');
                aux.setAttribute('id', `tareaCom${tareas[indice].id}`);
                aux.innerText = `${tareas[indice].id} - ${tareas[indice].descripcion}`;
                ulCompletadas.append(aux);
            } else {
                console.log(`No se encontro la tarea de id: ${idTarea}`)
            }
        } else {
            alert('No quedan tareas por completar! :D')
        }
    });

    // Eliminar tarea
    botonEliminarTarea.addEventListener('click', () => {
        if (ulGeneral.childNodes.length > 0) {
            const idTarea = parseInt(prompt('Ingrese el ID de la tarea a eliminar:'));
            let bandera = false;
            let indice;
            for (let i = 0; i < tareas.length; i++) {
                if (idTarea == tareas[i].id) {
                    bandera = true;
                    indice = i;
                    break;
                }
            }
            if (bandera) {
                console.log(`Tarea a eliminar encontrada.
                ID Buscado: ${idTarea}
                ID Encontrado: ${tareas[indice].id}`);
                let aux = document.getElementById(`tareaGen${idTarea}`);
                aux.parentNode.removeChild(aux);
                contTareas--;
                if (tareas[indice].estado) {
                    aux = document.getElementById(`tareaCom${idTarea}`);
                    aux.parentNode.removeChild(aux);
                    contTareasCompetadas--;
                } else {
                    aux = document.getElementById(`tareaSin${idTarea}`);
                    aux.parentNode.removeChild(aux);
                    contTareasSinCompletar--;
                }
                tareas.splice(indice, 1);
                console.log('Nueva lista de tareas: ');
                mostrarTareasPorConsola(tareas);
            } else {
                console.log(`No se encontro la tarea de id: ${idTarea}`)
            }
        } else {
            alert('No hay tareas!')
        }
    });

    // Actualizar tarea
    botonActualizarTarea.addEventListener('click', event => {
        event.preventDefault();
        if (ulGeneral.childNodes.length > 0) {
            const idTarea = parseInt(prompt('Ingrese el ID de la tarea a actualizar:'));
            let bandera = false;
            let indice;
            for (let i = 0; i < tareas.length; i++) {
                if (idTarea == tareas[i].id) {
                    bandera = true;
                    indice = i;
                    break;
                }
            }
            if (bandera) {
                const nuevaDesc = prompt('Ingrese la nueva descripcion para la tarea: ');
                let aux = document.getElementById('')
            }
        } else {
            alert('No hay tareas!');
        }
    });

}

main();