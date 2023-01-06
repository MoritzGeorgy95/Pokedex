// script variables
let pokemonAmount = 500;
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
  let pokemonCard = createPokemonCardElement(pokemon);
  let image1 = createImageElement(pokemon.sprites.other.dream_world.front_default);
  let image2 = createImageElement("images/pokeball.png");
  let descriptionContainer = createDescriptionContainerElement();
  let id = createPokemonIdElement(pokemon.id);

  pokedexContainer.append(pokemonCard);
  pokemonCard.append(image1);
  pokemonCard.append(image2);
  pokemonCard.append(descriptionContainer);
  pokemonCard.append(id);
  addTypesToDescriptionContainer(pokemon.types, descriptionContainer);
}

function createPokemonCardElement(pokemon) {
  let pokemonCard = document.createElement("div");
  pokemonCard.classList.add("pokemon-card");
  pokemonCard.style.backgroundColor = `var(--c-${pokemon.types[0].type.name})`;
  pokemonCard.addEventListener("click", function () {
    openCard(i);
  });
  return pokemonCard;
}

function createImageElement(src) {
  let image = document.createElement("img");
  image.src = src;
  return image;
}

function createDescriptionContainerElement() {
  let descriptionContainer = document.createElement("div");
  descriptionContainer.classList.add("flex-column");
  return descriptionContainer;
}

function createPokemonIdElement(id) {
  let element = document.createElement("p");
  element.innerText = `#${id}`;
  element.classList.add("pokemon-id");
  return element;
}

function addTypesToDescriptionContainer(types, descriptionContainer) {
  for (let i = 0; i < types.length; i++) {
    descriptionContainer.innerHTML += `<p>${types[i].type.name}</p>`;
  }
}

function openCard(i) {
    removeTargetBorder();
    let pokemon = datasets[i];
    pokedexContainer.classList.add("d-none");
    let overlay = createOverlayElement(pokemon);
    main.append(overlay);
    let cardZoomInfo = createCardZoomInfoElement(pokemon);
    let cardZoomDescription = createCardZoomDescriptionElement();
    let cardZoomDescriptionNavbar = createCardZoomDescriptionNavbarElement();
    let cardZoomDescriptionContent = createCardZoomDescriptionContentElement();
  
    overlay.append(cardZoomInfo);
    overlay.append(cardZoomDescription);
    cardZoomDescription.append(cardZoomDescriptionNavbar);
    cardZoomDescription.append(cardZoomDescriptionContent);
    addEventListenersToCardZoomDescriptionNavbar(cardZoomDescriptionContent);
  }
  
  function createOverlayElement(pokemon) {
    let overlay = document.createElement("div");
    overlay.classList.add("overlay");
    return overlay;
  }
  
  function createCardZoomInfoElement(pokemon) {
    let cardZoomInfo = document.createElement("div");
    cardZoomInfo.classList.add("card-zoom-info");
    cardZoomInfo.style.backgroundColor = `var(--c-${pokemon.types[0].type.name})`;
    let cardZoomInfoHeader = createCardZoomInfoHeaderElement();
    let cardZoomInfoTypes = createCardZoomInfoTypesElement(pokemon);
    let pokeball = createImageElement("images/pokeball.png");
  
    cardZoomInfo.append(cardZoomInfoHeader);
    cardZoomInfo.append(cardZoomInfoTypes);
    cardZoomInfo.append(pokeball);
    return cardZoomInfo;
  }
  
  function createCardZoomInfoHeaderElement() {
    let cardZoomInfoHeader = document.createElement("div");
    cardZoomInfoHeader.classList.add("card-zoom-info__header");
    let closeZoomIn = document.createElement("p");
    closeZoomIn.id = "close-zoom-in";
    closeZoomIn.innerText = "←";
    let id = document.createElement("p");
    id.innerText = `#${pokemon.id}`;
    cardZoomInfoHeader.append(closeZoomIn);
    cardZoomInfoHeader.append(id);
    return cardZoomInfoHeader;
  }
  
  function createCardZoomInfoTypesElement(pokemon) {
    let cardZoomInfoTypes = document.createElement("div");
    cardZoomInfoTypes.classList.add("card-zoom-info__types");
    let name = document.createElement("h1");
    name.innerText = capitalizeFirstLetter(pokemon.name);
    let type = document.createElement("p");
    type.innerText = pokemon.types[0].type.name;
    cardZoomInfoTypes.append(name);
    cardZoomInfoTypes.append(type);
    return cardZoomInfoTypes;
  }
  
  function createCardZoomDescriptionElement() {
    let cardZoomDescription = document.createElement("div");
    cardZoomDescription.classList.add("card-zoom-description");
    return cardZoomDescription;
  }
  
  function createCardZoomDescriptionNavbarElement() {
    let cardZoomDescriptionNavbar = document.createElement("div");
    cardZoomDescriptionNavbar.classList.add("card-zoom-description__navbar");
    let about = document.createElement("a");
    about.id = "about";
    about.innerText = "About";
    let stats = document.createElement("a");
    stats.id = "stats";
    stats.innerText = "Base Stats";
    let moves = document.createElement("a");
    moves.id = "moves";
    moves.innerText = "Moves";
    cardZoomDescriptionNavbar.append(about);
    cardZoomDescriptionNavbar.append(stats);
    cardZoomDescriptionNavbar.append(moves);
    return cardZoomDescriptionNavbar;
  }
  
  function createCardZoomDescriptionContentElement() {
    let cardZoomDescriptionContent = document.createElement("div");
    cardZoomDescriptionContent.classList.add("card-zoom-description__content");
    cardZoomDescriptionContent.id = "dynamic-content";
    return cardZoomDescriptionContent;
  }
  
  function addEventListenersToCardZoomDescriptionNavbar(cardZoomDescriptionContent) {
    let about = document.getElementById("about");
    let stats = document.getElementById("stats");
    let moves = document.getElementById("moves");
    about.addEventListener("click", function () {
      openTab(about, stats, moves, "about", pokemon, cardZoomDescriptionContent);
    });
    stats.addEventListener("click", function () {
      openTab(stats, about, moves, "stats", pokemon, cardZoomDescriptionContent);
    });
    moves.addEventListener("click", function () {
      openTab(moves, about, stats, "moves", pokemon, cardZoomDescriptionContent);
    });
  }
  
  
