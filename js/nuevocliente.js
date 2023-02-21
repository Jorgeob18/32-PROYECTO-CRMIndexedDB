/* eslint-disable no-useless-return */

/* eslint-disable wrap-iife */
(function () {
  //-----------------------
  let DB;
  const formulario = document.querySelector('#formulario');

  document.addEventListener('DOMContentLoaded', () => {
    conectarDB();
    formulario.addEventListener('submit', validarCliente);
  });

  function validarCliente(e) {
    e.preventDefault();

    // Leertodos los input
    const nombre = document.querySelector('#nombre').value;
    const email = document.querySelector('#email').value;
    const telefono = document.querySelector('#telefono').value;
    const empresa = document.querySelector('#empresa').value;

    if (nombre === '' || email === '' || telefono === '' || empresa === '') {
      imprimirAlerta('Too lo campos son obligatorios', 'error');

      return;
    }

    // Crear un nuevo objeto con la informacion
    const cliente = {
      nombre,
      email,
      telefono,
      empresa,
      id: Date.now(),
    };
    // console.log(cliente);
    crearNuevoCliente(cliente);
  }

  function crearNuevoCliente(cliente) {
    const transaction = DB.transaction(['crm'], 'readwrite');

    const objectStore = transaction.objectStore('crm');

    objectStore.add(cliente);

    transaction.onerror = function () {
      imprimirAlerta('Hubo un error, o el registro ya existe', 'error');
    };

    transaction.oncomplete = function () {
      imprimirAlerta('El cliente se agrego correctamente');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 2500);
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
  //----------------------
})();
