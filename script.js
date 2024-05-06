const equipos = [];
let contador=0;

//Agrega los pokemones
document.getElementById("agregar").addEventListener("click", async function () {
    const limite = 2;
  
    const nombrePokemon = document.getElementById("nombre").value.toLowerCase(); 
    if (nombrePokemon === "") {
      alert("Error: Tu campo esta vacio");
      return;
    }

        const pokemon = await obtenerPokemon(nombrePokemon); 
        equipos.push(nombrePokemon);
        contador++;
        document.getElementById("nombre").value = ""; 
        console.log("Pokémon agregado:", nombrePokemon);
  
        if (contador > limite) {
          document.getElementById("agregar").disabled = true;
          document.getElementById("nombre").disabled = true;
        }

    document.getElementById('mostrarHistorialButton').addEventListener('click', mostrarHistorial);
  });
  
//Obtiene los pokemones
async function obtenerPokemon(nombre) {
  const respuesta = await fetch(`https://pokeapi.co/api/v2/pokemon/${nombre}`);
  return respuesta.json();
}

//Validacion del nombre
async function validarNombrePokemon(nombre) {
  const respuesta = await fetch(`https://pokeapi.co/api/v2/pokemon/${nombre}`);
  return respuesta.status === 200;
}

//Valida nombre
document.getElementById("nombre").addEventListener("blur", async function () {
  const nombrePokemon = this.value.toLowerCase();
  if (nombrePokemon === "") {
      alert("Error: El campo está vacío");
      return;
  }

  if (await validarNombrePokemon(nombrePokemon)) {
      // El nombre del Pokémon es válido
  } else {
      alert("Error: El nombre del Pokémon no es válido");
  }
});
  
// Valida si hay internet
window.addEventListener('online', function () {
  if (navigator.onLine) {
    alert("¡Conexión a Internet restablecida!");
  } else {
    alert("El navegador indica que hay conexión a Internet, pero no se puede acceder.");
  }
});

window.addEventListener('offline', function () {
  alert("¡No hay conexión a Internet!");
});


//Boton empezar de nuevo
document.getElementById('empezarDeNuevo').addEventListener('click', function () {
  contador = 0; // Reiniciar el contador
  document.getElementById("agregar").disabled = false; 
  document.getElementById("nombre").disabled = false; 
});


//Mostrar historial
async function mostrarHistorial() {
  // Checa si hay equipos
  if (equipos.length === 0) {
    alert('No hay equipos agregados aún');
    return;
  }

  // Quita los elementos del DOM
  const existingHistory = document.getElementById('historial-container');
  if (existingHistory) {
    existingHistory.remove();
  }

  // Crea el historial
  const historialContainer = document.createElement('div');
  historialContainer.id = 'historial-container';

  // Titulo de equipos
  const equipoTitle = document.createElement('h3');
  equipoTitle.textContent = 'Historial de Equipos';
  historialContainer.appendChild(equipoTitle);

  // Fetch para la informacion de los equipos de pokemon
  const pokemonPromises = equipos.map(async (pokemonName) => {
    const pokemon = await obtenerPokemon(pokemonName);
    return pokemon; 
  });

  const pokemonDataArray = await Promise.all(pokemonPromises);

  //Ordena el arreglo
  pokemonDataArray.sort((a, b) => b.base_experience - a.base_experience);

  pokemonDataArray.forEach((pokemon) => {
    const historialItem = document.createElement('div');
    historialItem.classList.add('historial-item');

    // Muestra la informacion
    historialItem.innerHTML = `
      <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
      <p>Nombre: ${pokemon.name}</p>
      <p>ID: ${pokemon.id}</p>
      <p>Tipo(s): ${pokemon.types.map(type => type.type.name).join(", ")}</p>
      <p>Experiencia base: ${pokemon.base_experience}</p>
      <p>Habilidad: ${pokemon.abilities[0].ability.name}</p>
    `;

    historialContainer.appendChild(historialItem);
  });

  document.body.appendChild(historialContainer);
}
