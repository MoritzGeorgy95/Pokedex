// script variables
let pokemonAmount = 200;
let pokedexContainer = document.getElementsByClassName("pokedex-container")[0];
let main = document.getElementsByTagName("main")[0];
let datasets = [];
let names = [];
let about;
let stats;
let moves;
let header = document.getElementsByTagName("header")[0];

// get data about the first 200 pokemons from PokeAPI (contains name, stats images etc.)
async function getPokemonData() {
  for (let i = 0; i < pokemonAmount; i++) {
    let url = `https:pokeapi.co/api/v2/pokemon/${i + 1}`;
    let response = await fetch(url);
    let currentPokemonData = await response.json();
    datasets.push(currentPokemonData);
    names.push(currentPokemonData.name);
    // push data to script arrays to make them accessible everywhere
    renderPokemon(currentPokemonData, i);
    // render respective pokemon to screen with img and basic features
  }
}

function renderPokemon(pokemon, i) {
  let pokemonCard = document.createElement("div");
  pokemonCard.classList.add("pokemon-card");
  pokemonCard.style.backgroundColor = `var(--c-${pokemon.types[0].type.name})`;
  pokemonCard.addEventListener("click", function () {
    openCard(i);
  });
  pokedexContainer.append(pokemonCard);
  let image1 = document.createElement("img");
  let image2 = document.createElement("img");
  pokemonCard.append(image1);
  pokemonCard.append(image2);
  image2.src = "images/pokeball.png";
  image1.src = pokemon.sprites.other.dream_world.front_default;
  let descriptionContainer = document.createElement("div");
  pokemonCard.append(descriptionContainer);
  descriptionContainer.classList.add("flex-column");
  descriptionContainer.innerHTML += `<h1 class="title">${capitalizeFirstLetter(
    pokemon.name
  )}</h1>`;
  let id = document.createElement("p");
  pokemonCard.append(id);
  id.innerText = `#${pokemon.id}`;
  id.classList.add("pokemon-id");
  for (let i = 0; i < pokemon.types.length; i++) {
    descriptionContainer.innerHTML += `<p>${pokemon.types[i].type.name}</p>`;
  }
}

function openCard(i) {
  let pokemon = datasets[i];
  pokedexContainer.classList.add("d-none");
  let overlay = document.createElement("div");
  overlay.classList.add("overlay");
  overlay.innerHTML = /*html*/ `
  <div class="card-zoom-info" style="background-color: var(--c-${
    pokemon.types[0].type.name
  })">
    	<div class="card-zoom-info__header">
        <p id="close-zoom-in">	&#8592</p>
        <p># ${pokemon.id}</p>
      </div>
      <div class="card-zoom-info__types">
      <h1>${capitalizeFirstLetter(pokemon.name)}</h1>
      <p> ${pokemon.types[0].type.name}</p>
      </div>
      <img src="images/pokeball.png" alt="pokeball">
  </div>
    <div class="card-zoom-description">
    <img src="${pokemon.sprites.other.dream_world.front_default}">
    <div class="card-zoom-description__navbar">
      <a id="about">About</a>
      <a id="stats">Base Stats</a>
      <a id="moves">Moves</a>
    </div>
    <div class="card-zoom-description__content" id="dynamic-info-container"></div>
  </div>`;
  main.append(overlay);
  getElement("about").addEventListener("click", function () {
    renderAbout(i);
  });
  getElement("stats").addEventListener("click", function () {
    renderStats(i);
  });
  getElement("moves").addEventListener("click", function () {
    renderMoves(i);
  });
  getElement("close-zoom-in").addEventListener("click", function () {
    closePokemonZoom();
  });
  moves = getElement("moves");
  about = getElement("about");
  stats = getElement("stats");
  renderAbout(i);
  header.classList.add("d-none");
}

//helper functions
let getElement = (id) => {
  return document.getElementById(id);
};

function renderAbout(i) {
  let aboutContainer = getElement("dynamic-info-container");
  let pokemon = datasets[i];
  aboutContainer.innerHTML = /*html*/ `<div class="attribute-row flex-row ml-1 mr-1 mt-3 bt">
                <p>Height</p>
                <p>${pokemon.height * 10} cm</p>
            </div>
            <div class="attribute-row flex-row ml-1 mr-1 mt-1">
              <p>Weight</p>
              <p>${pokemon.weight} kg</p>
            </div>
            <div class="attribute-row flex-row ml-1 mr-1 mt-1 bb">
             <p>Abilities</p>
              <p>${pokemon.abilities[0].ability.name}</p>
            </div>
            <h2 class="text-center mt-1">Gallery</h2>
            <div class="evolution-container mt-3">
              <div class="flex-column-center">
                <img src="${pokemon.sprites.other.home.front_shiny}" alt="2">
                <p class="mt-1">Exotic</p>
              </div>
              <div class="flex-column-center">
                <img src="${
                  pokemon.sprites.other.dream_world.front_default
                }" alt="1">
                <p class="mt-1">Dream World</p>
              </div>
              <div class="flex-column-center">
                <img src="${
                  pokemon.sprites.other["official-artwork"].front_default
                }" alt="3">
                <p class="mt-1">Antic</p>
              </div>
            </div>
            `;
  stats.classList.remove("bold");
  moves.classList.remove("bold");
  about.classList.add("bold");
}

function renderStats(i) {
  let statsContainer = getElement("dynamic-info-container");
  statsContainer.innerHTML = "";
  let ctx = document.createElement("canvas");
  ctx.classList.add("mt-3");
  statsContainer.append(ctx);
  let pokemon = datasets[i];
  const myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["HP", "Attack", "Defense", "Sp-Attack", "Sp-Defense", "Speed"],
      datasets: [
        {
          label: "bar",
          data: [
            pokemon.stats[0].base_stat,
            pokemon.stats[1].base_stat,
            pokemon.stats[2].base_stat,
            pokemon.stats[3].base_stat,
            pokemon.stats[4].base_stat,
            pokemon.stats[5].base_stat,
          ],
          backgroundColor: [
            "green",
            "red",
            "#777777",
            "red",
            "#777777",
            "lightblue",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      indexAxis: "y",
      scales: {
        xAxis: {
          display: true,
        },
        yAxis: {
          grid: {
            display: false,
            borderWidth: 0,
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        datalabels: {
          display: true,
          color: "rgb(239, 239, 239)",
        },
        tooltip: {
          enabled: true,
        },
      },
    },
  });
  stats.classList.add("bold");
  moves.classList.remove("bold");
  about.classList.remove("bold");
  window.scrollTo(0, document.body.scrollHeight);
}

function renderMoves(i) {
  let pokemon = datasets[i];
  let movesContainer = getElement("dynamic-info-container");
  movesContainer.innerHTML = `<ul id="moves-list" class="mt-3"></ul>`;
  let list = getElement("moves-list");
  for (let i = 0; i < pokemon.moves.length; i++) {
    let move = document.createElement("li");
    move.innerText = pokemon.moves[i].move.name;
    list.append(move);
  }
  stats.classList.remove("bold");
  moves.classList.add("bold");
  about.classList.remove("bold");
}

function closePokemonZoom() {
  document.getElementsByClassName("overlay")[0].remove();
  pokedexContainer.classList.remove("d-none");
  header.classList.remove("d-none");
}

/* search logic */

let search = document.getElementsByTagName("input")[0];
let resultsHTML = getElement("search-results");

search.oninput = function () {
  const userInput = this.value.toLowerCase();
  resultsHTML.classList.remove("d-none");
  resultsHTML.innerHTML = "";
  if (userInput.length > 0) {
    let results = getResults(userInput);
    for (i = 0; i < results.length; i++) {
      let result = results[i];
      let index = names.findIndex((element) => element == result);
      result = capitalizeFirstLetter(result);
      resultsHTML.innerHTML += /*html*/ `<li class="suggestion" onclick="goToPokemon(${index})">${result}</li>`;
    }
  } else {
    resultsHTML.classList.add("d-none");
  }
};

function getResults(input) {
  const results = [];
  for (i = 0; i < names.length; i++) {
    if (input === names[i].slice(0, input.length)) {
      results.push(names[i]);
    }
  }
  return results;
}

// make first letter uppercase
function capitalizeFirstLetter(word) {
  return word[0].toUpperCase() + word.slice(1);
}

function goToPokemon(index) {
  let pokemonCards = document.getElementsByClassName("pokemon-card");
  let pokemon = pokemonCards[index];
  resultsHTML.classList.add("d-none");
  resultsHTML.innerHTML = "";
  search.value = "";
  pokemon.scrollIntoView({
    block: "center",
  });
}

document.addEventListener("click", function () {
  if (document.activeElement != search) {
    resultsHTML.classList.add("d-none");
  }
});

