const pokemonListElement = document.querySelector('.pokemon-list');
const searchInput = document.querySelector('#search');
let pokemonList = [];
let searchTimeout;

function createSkeleton() {
  const skeleton = document.createElement('div');
  skeleton.className = 'skeleton';
  return skeleton;
}

function loadSkeleton(number = MAX_POKEMON_NUMBER_LIMIT) {
  pokemonListElement.innerHTML = '';
  for (let i = 0; i < number; i++) {
    let skeleton = createSkeleton();
    pokemonListElement.appendChild(skeleton);
  }
}

async function loadAllPokemonFromPokeAPI() {
  try {
    const response = await fetch(`${POKEAPI_URL}/pokemon?limit=${MAX_POKEMON_NUMBER_LIMIT}`);
    const responseJSON = await response.json();
    pokemonList = responseJSON.results;
  } catch (error) {
    console.error('Failed to load pokemon list from API');
  }
}

function makePokemonCardHTML(pokemonDescription, pokemonID) {
  return `
        <div class="pokemon-card" data-url="/details.html?id=${pokemonID}">
            <span class="pokemon-number">#${pokemonID}</span>
            <img src="https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/dream-world/${pokemonID}.svg" class="pokemon-image" />
            <span class="pokemon-name">${capitalizeFirstLetter(pokemonDescription)}</span>
        </div>
    `;
}

function loadPokemonCards(list) {
  pokemonListElement.innerHTML = '';
  let html = '';
  list.forEach((pokemon) => {
    let pokemonID = pokemon.url.split('/')[6].toString();
    html += makePokemonCardHTML(pokemon.name, pokemonID);
  });

  pokemonListElement.innerHTML = html;
  pokemonListElement.querySelectorAll('.pokemon-card').forEach((pokemonCard) => {
    pokemonCard.addEventListener('click', ({ target }) => {
      const className = target.className;
      const currentElement = className === 'pokemon-card' ? target : target.parentNode;
      console.log(currentElement);
      window.location.href = currentElement.dataset.url;
    });
  });
}

document.addEventListener('keyup', async ({ target }) => {
  const search = target.value.trim().toLowerCase();
  const isNumeric = !isNaN(search) && search.length > 0;

  if (search.length <= 0) {
    loadSkeleton(MAX_POKEMON_NUMBER_LIMIT);
    await loadAllPokemonFromPokeAPI();
    loadPokemonList(pokemonList);
    return;
  }

  let filteredData = [];
  if (!isNumeric) {
    filteredData = pokemonList.filter((pokemon) => pokemon.name.includes(search));
  } else {
    filteredData = pokemonList.filter((pokemon) => {
      const pokemonID = pokemon.url.split('/')[6].toString();
      return pokemonID.startsWith(search);
    });
  }

  loadPokemonList(filteredData);
});

function loadPokemonList(list) {
  loadPokemonCards(list);
}

loadSkeleton();
await loadAllPokemonFromPokeAPI();
loadPokemonList(pokemonList);
