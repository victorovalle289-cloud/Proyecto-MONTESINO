// Definir una constante global para la URL base
const BASE_URL = "http://127.0.0.1:5000";

// Función para visualizar datos en la tabla
function visualizar(data) {
    let tabla = "";

    // Recorre cada elemento en el array "baul" y crea una fila de tabla
    data.baul.forEach(item => {
        tabla += `
            <tr data-id="${item.id_baul}">
                <td>${item.id_baul}</td>
                <td>${item.Plataforma}</td>
                <td>${item.usuario}</td>
                <td>${item.clave}</td>
                <td>
                    <!-- Botón para editar -->
                    <button type="button" class="btn btn-info"
                        onclick="location.href='edit.html?variable1=${item.id_baul}'">
                        <img src='imagenes/edit.png' height='30' width='30'/>
                    </button>
                </td>
                <td>
                    <!-- Botón para eliminar -->
                    <button type="button" class="btn btn-warning"
                        onclick="eliminar(${item.id_baul})">
                        <img src='imagenes/delete.png' height='30' width='30'/>
                    </button>
                </td>
            </tr>`;
    });

    // Inserta las filas generadas en el cuerpo de la tabla
    document.getElementById('data').innerHTML = tabla;
}


// Función para realizar una consulta general (GET)
function consulta_general() {
    fetch(`${BASE_URL}/`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            return response.json();
        })
        .then(data => visualizar(data))
        .catch(error => console.error('Error:', error));
}


// Función para eliminar un registro (DELETE)
function eliminar(id) {
    fetch(`${BASE_URL}/eliminar/${id}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            return response.json();
        })
        .then(res => {
            actualizarDOM(id);
            swal("Mensaje", `Registro ${res.mensaje} exitosamente`, "success");
        })
        .catch(error => console.error('Error:', error));
}


// Función para actualizar el DOM después de eliminar un elemento
function actualizarDOM(id) {
    const row = document.querySelector(`tr[data-id="${id}"]`);

    if (row) {
        row.remove();
    }
}


// Función para registrar un nuevo registro (POST)
function registrar() {

    // Obtiene los valores de los campos de entrada
    const plat = document.getElementById("plataforma").value;
    const usua = document.getElementById("usuario").value;
    const clav = document.getElementById("clave").value;

    // Crea el objeto de datos
    const data = {
        plataforma: plat,
        usuario: usua,
        clave: clav
    };

    fetch(`${BASE_URL}/registro/`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            return response.json();
        })
        .then(response => {

            if (response.mensaje === "Error") {
                swal("Mensaje", "Error en el registro", "error");
            } else {
                consulta_general();
                swal("Mensaje", "Registro agregado exitosamente", "success");
            }
        })
        .catch(error => console.error('Error:', error));
}


// Función para consultar un registro individual (GET)
function consulta_individual(id) {

    fetch(`${BASE_URL}/consulta_individual/${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {

            // Rellena los campos de entrada con los valores obtenidos
            document.getElementById("plataforma").value = data.baul.Plataforma;
            document.getElementById("usuario").value = data.baul.usuario;
            document.getElementById("clave").value = data.baul.clave;
        })
        .catch(error => console.error('Error:', error));
}


// Función para modificar un registro existente (PUT)
function modificar(id) {

    // Obtiene los valores de los campos de entrada
    const plat = document.getElementById("plataforma").value;
    const usua = document.getElementById("usuario").value;
    const clav = document.getElementById("clave").value;

    // Crea el objeto de datos
    const data = {
        plataforma: plat,
        usuario: usua,
        clave: clav
    };

    fetch(`${BASE_URL}/actualizar/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            return response.json();
        })
        .then(response => {

            if (response.mensaje === "Error") {
                swal("Mensaje", "Error al actualizar el registro", "error");
            } else {
                consulta_general();
                swal("Mensaje", "Registro actualizado exitosamente", "success");
            }
        })
        .catch(error => console.error('Error:', error));
}