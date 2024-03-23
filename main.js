import { cargarTareas, obtenerTareas } from "./moduloCargarTareas.js";

function mostrarTareasPorConsola(tareas) {
    console.log('ID  -        DESCRIPCION               -     ESTADO')
    for (let i = 0; i < tareas.length; i++) {
        console.log(`${tareas[i].id}   -   ${tareas[i].descripcion}   -   ${tareas[i].estado ? 'Completado' : 'Sin Completar'}`)
    }
    if (contTareasCompletadas == 0 || contTareas == 0) {
        porcentaje = 0;
    } else {
        porcentaje = ((contTareasCompletadas / contTareas) * 100).toFixed(2);
    }
    console.log(`Cantidad de Tareas: ${contTareas}
    Completadas: ${contTareasCompletadas}
    Sin Completar: ${contTareasSinCompletar}
    Porcentaje Completado: ${porcentaje}%`)
}

const ulGeneral = document.createElement('ul');
ulGeneral.setAttribute('id', 'listaGeneral');

const ulCompletadas = document.createElement('ul');
ulCompletadas.setAttribute('id', 'listaCompletadas');
    
const ulSinCompletar = document.createElement('ul');
ulSinCompletar.setAttribute('id', 'listaSinCompletar');

const contenedorListadoGeneral = document.getElementById('listadoGeneral');
if (contenedorListadoGeneral !== null) {
    contenedorListadoGeneral.appendChild(ulGeneral);
}

const contenedorListadoCompletadas = document.getElementById('listadoCompletadas');
if (contenedorListadoCompletadas !== null) {
    contenedorListadoCompletadas.appendChild(ulCompletadas);
}

const contenedorListadoSinCompletar = document.getElementById('listadoSinCompletar');
if (contenedorListadoSinCompletar !== null) {
    contenedorListadoSinCompletar.appendChild(ulSinCompletar);
}

let contTareas = 0;
let contTareasCompletadas = 0;
let contTareasSinCompletar = 0;
let porcentaje = 0;
// Variable que almacena la url de la pagina que se visualiza actualmente
var paginaActual = window.location.pathname;

function crearTarea(tarea) {
    if (paginaActual.includes("index.html") || paginaActual.includes("listadoGeneral.html")){
        const liGeneral = document.createElement('li');
        liGeneral.setAttribute('id', `tareaGen${tarea.id}`);
        liGeneral.innerText = `${tarea.id} - ${tarea.descripcion} - ${tarea.estado ? 'Completado' : 'Sin completar'}`;
        ulGeneral.append(liGeneral);
        contTareas++;
    }
    if (tarea.estado) {
        const liCompletadas = document.createElement('li');
        liCompletadas.setAttribute('id', `tareaCom${tarea.id}`);
        liCompletadas.innerText = `${tarea.id} - ${tarea.descripcion}`;
        ulCompletadas.append(liCompletadas);
        contTareasCompletadas++;
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
    
    if (paginaActual.includes("index.html")) {
        console.log(`La pagina actual es: ${paginaActual}`);
        // Mostrar tareas
        mostrarTareas(tareas);
        console.log('Lista inicial de tareas: ');
        mostrarTareasPorConsola(tareas);
    } else if (paginaActual.includes("listadoGeneral.html")) {
        console.log(`La pagina actual es: ${paginaActual}`);
        // Mostrar tareas
        mostrarTareas(tareas);
        console.log('Lista inicial de tareas: ');
        mostrarTareasPorConsola(tareas);
    } else if (paginaActual.includes("listadoCompletadas.html")) {
        console.log(`La pagina actual es: ${paginaActual}`);
        // Mostrar tareas
        mostrarTareas(tareas.filter(tarea => tarea.estado));
        console.log('Lista inicial de tareas: ');
        mostrarTareasPorConsola(tareas.filter(tarea => tarea.estado));
    } else {
        console.log(`La pagina actual es: ${paginaActual}`);
        // Mostrar tareas
        mostrarTareas(tareas.filter(tarea => !tarea.estado));
        console.log('Lista inicial de tareas: ');
        mostrarTareasPorConsola(tareas.filter(tarea => !tarea.estado));
    }

    // Agregar tarea
    if (!paginaActual.includes("listadoCompletadas.html")) {
        botonAgregarTarea.addEventListener('click', event => {
            event.preventDefault();
            let desc = prompt('Ingrese una descripcion para su tarea: ');
            tareas.push({id: contID, descripcion: desc, estado: false});
            crearTarea(tareas[tareas.length - 1]);
            console.log(`Tarea agregada: 
            ID = ${tareas[tareas.length - 1].id}
            Descripcion: ${tareas[tareas.length - 1].descripcion}
            Estado: Sin Completar`);
            contID++;
            console.log('Nueva lista de tareas: ');
            mostrarTareasPorConsola(tareas);
        });
    }

    // Completar tarea
    if (!paginaActual.includes("listadoCompletadas.html")){
        botonCompletarTarea.addEventListener('click', event => {
            event.preventDefault();
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
                    mostrarTareasPorConsola(tareas);
                    contTareasCompletadas++;
                    contTareasSinCompletar--;
                    let aux;
                    if (paginaActual.includes("index.html") || paginaActual.includes("listadoGeneral.html")){
                        aux = document.getElementById(`tareaGen${tareas[indice].id}`);
                        aux.innerText = `${tareas[indice].id} - ${tareas[indice].descripcion} - Completado`;
                    }
                    if (paginaActual.includes("index.html") || paginaActual.includes("listadoSinCompletar.html")){
                        // eliminarla del apartado de tareas sin completar
                        aux = document.getElementById(`tareaSin${tareas[indice].id}`);
                        aux.parentNode.removeChild(aux);
                    }
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
    }

    // Eliminar tarea
    botonEliminarTarea.addEventListener('click', event => {
        event.preventDefault();
        if (ulCompletadas.childNodes.length > 0 || ulSinCompletar.childNodes.length > 0) {
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
                let aux;
                if (paginaActual.includes("index.html") || paginaActual.includes("listadoGeneral.html")){
                    aux = document.getElementById(`tareaGen${idTarea}`);
                    aux.parentNode.removeChild(aux);
                    contTareas--;
                }
                if (tareas[indice].estado) {
                    aux = document.getElementById(`tareaCom${idTarea}`);
                    aux.parentNode.removeChild(aux);
                    contTareasCompletadas--;
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

    // Editar tarea
    if (!paginaActual.includes("listadoCompletadas.html")){
        botonEditarTarea.addEventListener('click', event => {
            event.preventDefault();
            if (ulGeneral.childNodes.length > 0 || ulSinCompletar.childNodes.length > 0) {
                const idTarea = parseInt(prompt('Ingrese el ID de la tarea a editar:'));
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
                    tareas[indice].descripcion = nuevaDesc;
                    let aux;
                    if (paginaActual.includes("index.html") || paginaActual.includes("listadoGeneral.html")){
                        aux = document.getElementById(`tareaGen${idTarea}`);
                        aux.innerText = `${tareas[indice].id} - ${tareas[indice].descripcion}`;
                        
                        if (tareas[indice].estado) {
                            aux = document.getElementById(`tareaCom${idTarea}`);
                            aux.innerText = `${tareas[indice].id} - ${tareas[indice].descripcion}`;
                        } else {
                            aux = document.getElementById(`tareaSin${idTarea}`);
                            aux.innerText = `${tareas[indice].id} - ${tareas[indice].descripcion}`;
                        }
                    } else {
                        aux = document.getElementById(`tareaSin${idTarea}`);
                        aux.innerText = `${tareas[indice].id} - ${tareas[indice].descripcion}`;
                    }
                    console.log('Nueva lista de tareas: ');
                    mostrarTareasPorConsola(tareas);
                }
            } else {
                alert('No hay tareas!');
            }
        });
    }
}

// Funcion que espera hasta que la pantalla este cargada por completo antes de llamar a main()
window.onload = main();