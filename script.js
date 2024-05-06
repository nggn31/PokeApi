const equipos = [];

document.getElementById("agregar").addEventListener("click", async function () {
    const limite = 2;
  
    const nombrePokemon = document.getElementById("nombre").value.toLowerCase(); //<----------------
    if (nombrePokemon === "") {
      alert("Error: Tu campo esta vacio");
      return;
    }
  
    if (navigator.onLine) {
      if (await validarNombrePokemon(nombrePokemon)) {
        equipos.push(nombrePokemon);
        document.getElementById("nombre").value = ""; // Limpiar el campo de entrada
        console.log("Pokémon agregado:", nombrePokemon);
  
        if (equipos.length > limite) {
          document.getElementById("agregar").disabled = true;
          document.getElementById("nombre").disabled = true;
        }
      } else {
        alert("Error: El nombre del Pokémon no es válido");
      }
    } else {
      alert("Error: No cuentas con internet");
    }

    document.getElementById('mostrarHistorialButton').addEventListener('click', mostrarHistorial);
  });
  

async function obtenerPokemon(nombre) {
  const respuesta = await fetch(`https://pokeapi.co/api/v2/pokemon/${nombre}`);
  return respuesta.json();
}

//Validacion del nombre
async function validarNombrePokemon(nombre) {
  const respuesta = await fetch(`https://pokeapi.co/api/v2/pokemon/${nombre}`);
  return respuesta.status === 200;
}

//Empezar de nuevo
let refresh = document.getElementById('empezarDeNuevo');
refresh.addEventListener('click', _ => {
            location.reload();
});


//Mostrar historial
function mostrarHistorial() {
  if (equipos.length === 0) {
    alert('No hay Pokémon agregados aún');
    return;
  }

  // Elementos del historial
  const historialContainer = document.createElement('div');
  historialContainer.id = 'historial-container';

  // Titulo
  const historialTitle = document.createElement('h2');
  historialTitle.textContent = 'Historial de Pokémon';
  historialContainer.appendChild(historialTitle);

//Ordenamiento
  equipos.sort((pokemon1, pokemon2,pokemon3) => {
    return obtenerPokemon(pokemon1).then(p1 => p1.base_experience) - obtenerPokemon(pokemon2).then(p2 => p2.base_experience)-obtenerPokemon(pokemon3).then(p3 => p3.base_experience);
  });

  //Desplega los pookemones anadidos
  equipos.forEach((pokemonName) => {
    const historialItem = document.createElement('div');
    historialItem.classList.add('historial-item');

    // Informacion del pokemon
    obtenerPokemon(pokemonName).then(pokemon => {
      const imagenUrl = pokemon.sprites.front_default;
      const tipos = pokemon.types.map(type => type.type.name).join(", ");
      const habilidad = pokemon.abilities.map(ability => ability.ability.name).join(", ");
      const nombrePokemon = pokemon.name;
      const idPokemon = pokemon.id;
      const experiencia = pokemon.base_experience;

      historialItem.innerHTML = `
        <img src="${imagenUrl}" alt="${nombrePokemon}">
        <p>Nombre: ${nombrePokemon}</p>
        <p>ID: ${idPokemon}</p>
        <p>Tipo(s): ${tipos}</p>
        <p>Experiencia base: ${experiencia}</p>
        <p>Habilidad: ${habilidad}</p>
      `;

      historialContainer.appendChild(historialItem);
    });
  });

  // Borra si existe allgo en el historial
  const existenciaHistorial = document.getElementById('historial-container');
  if (existenciaHistorial) {
    existingHistory.remove();
  }

  document.body.appendChild(historialContainer);
}
