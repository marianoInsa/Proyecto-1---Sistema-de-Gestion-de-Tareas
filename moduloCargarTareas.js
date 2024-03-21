let tareas = [];

export async function cargarTareas() {

    const response = await fetch('tareas.json');
    const tareasJSON = await response.json();

    tareasJSON.forEach(function (tareaJSON) {
        // cargar las tareas en un arreglo de diccionarios
        tareas.push({id: tareaJSON.id, descripcion: tareaJSON.descripcion, estado: tareaJSON.estado});
    });
}

export function obtenerTareas() {
    return tareas;
}