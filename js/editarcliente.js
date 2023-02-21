/* eslint-disable no-useless-return */
/* eslint-disable wrap-iife */
(function () {
  let DB;
  let idCliente;

  const formulario = document.querySelector('#formulario');
  const nombreInput = document.querySelector('#nombre');
  const emailInput = document.querySelector('#email');
  const telefonoInput = document.querySelector('#telefono');
  const empresaInput = document.querySelector('#empresa');

  document.addEventListener('DOMContentLoaded', () => {
    conectarDB();

    // Acrtualiza el registro
    formulario.addEventListener('submit', actualizarCiente);

    // Verificar ID de la URL
    const parametrosURL = new URLSearchParams(window.location.search);
    idCliente = parametrosURL.get('id');

    if (idCliente) {
      setTimeout(() => {
        obtenerCliente(idCliente);
      }, 200);
    }
  });

  function obtenerCliente(id) {
    const transaction = DB.transaction(['crm'], 'readonly');
    const objectStore = transaction.objectStore('crm');
    const cliente = objectStore.openCursor();

    cliente.onsuccess = function (e) {
      const cursor = e.target.result;

      if (cursor) {
        // console.log(cursor.value);
        if (cursor.value.id === Number(id)) {
          llenarFormulario(cursor.value);
        }

        cursor.continue();
      }
    };
  }

  function llenarFormulario(datosCLiente) {
    const { nombre, email, telefono, empresa } = datosCLiente;

    nombreInput.value = nombre;
    emailInput.value = email;
    telefonoInput.value = telefono;
    empresaInput.value = empresa;
  }

  function actualizarCiente(e) {
    e.preventDefault();
    if (
      nombreInput.value === '' ||
      emailInput.value === '' ||
      telefonoInput.value === ''
    ) {
      imprimirAlerta('Todos los campos son obligatorios', 'error');
      return;
    }

    // Actualizar Cliente
    const clienteActualizado = {
      nombre: nombreInput.value,
      email: emailInput.value,
      telefono: telefonoInput.value,
      empresa: empresaInput.value,
      id: Number(idCliente),
    };

    const transaction = DB.transaction(['crm'], 'readwrite');
    const objectStore = transaction.objectStore('crm');

    objectStore.put(clienteActualizado);

    transaction.oncomplete = function () {
      imprimirAlerta('Editado correctamente');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 2500);
    };

    transaction.onerror = function () {
      imprimirAlerta('Hubo un error', 'error');
    };
  }

  function conectarDB() {
    const abrirConexion = window.indexedDB.open('crm', 1);

    abrirConexion.onerror = () => {
      console.log('Hubo un error');
    };

    abrirConexion.onsuccess = () => {
      DB = abrirConexion.result;
    };
  }

  //-----------------------------------
})();
