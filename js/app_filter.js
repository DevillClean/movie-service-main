const API_KEY1 = "f01b1f55-6648-4052-9e65-b3a9624691e4";
const API_GET_FILTERS = "https://kinopoiskapiunofficial.tech/api/v2.2/films/filters";
let div_filt_category = document.getElementById("div__filter_category");
let div_filt_country = document.getElementById("div__filter_country");

getFilters(API_GET_FILTERS);

function createSelectCategory(data){
    let filt_category = document.createElement("select");
    filt_category.setAttribute("id", "fil_category");
    const filt_category_El = document.createElement("option");
    filt_category_El.setAttribute("id", "0");
    filt_category_El.setAttribute("value", "0");
    filt_category_El.innerText = "Жанры";
    filt_category_El.setAttribute("selected", true);
    data.genres.forEach(genre => {
        const filt_category_El = document.createElement("option");
        filt_category_El.setAttribute("id", genre.id);
        filt_category_El.setAttribute("value", genre.id);
        filt_category_El.innerText = genre.genre;
        filt_category.appendChild(filt_category_El);
    });
    filt_category.appendChild(filt_category_El);

    div_filt_category.appendChild(filt_category);
    let filt_country = document.createElement("select");
    filt_country.setAttribute("id", "fil_country");
    const filt_country_El = document.createElement("option");
    filt_country_El.setAttribute("id", "0");
    filt_country_El.setAttribute("value", "0");
    filt_country_El.innerText = "Страны";
    filt_country_El.setAttribute("selected", true);
    filt_country.appendChild(filt_country_El);
    data.countries.forEach(country => {
        const filt_country_El = document.createElement("option");
        filt_country_El.setAttribute("id", country.id);
        filt_country_El.setAttribute("value", country.id);
        filt_country_El.innerText = country.country;
        filt_country.appendChild(filt_country_El);
    });
    div_filt_country.appendChild(filt_country);
}

async function getFilters(url){
    const resp = await fetch(url,{
        headers: {
            "Content-Type": "application/json",
            "X-API-KEY": API_KEY1
        },
    })
    const respData = await resp.json();
    createSelectCategory(respData);
}

async function getFilmsWithFilters(url){
    const resp = await fetch(url,{
        headers: {
            "Content-Type": "application/json",
            "X-API-KEY": API_KEY1
        },
    })
    const respData = await resp.json();
    showMovies1(respData);
}

function showMovies1(data){
    const moviesEl = document.querySelector(".movies");
    moviesEl.innerHTML = "";

    data.items.forEach(movie => {
        const movieEl = document.createElement("div");
        movieEl.classList.add("movie");
        movieEl.innerHTML = `
        <div class="movie__cover-inner">
                        
            <img class="movier_cover" src="${movie.posterUrlPreview}" alt="${movie.nameRu}">
            <button id="movie__button_a" onclick="showPageFilm(value)" value="${movie.filmId}">
                <div class="movie__cover-darkened"></div>
            </button>
        
        </div>
        <div class="movie__info">
            <div class="movie__title">${movie.nameRu}</div>
            <div class="movie__category">${movie.genres.map(
                (genre) => ` ${genre.genre}`
            )}</div>
            
            <button class="movie__button-add" onclick="addFilmInStorage(value)" value="${movie.filmId}">Добавить</button>
        </div>
        <div class="movie__average movie__average--${getClassByRating(movie.ratingKinopoisk)}">${movie.ratingKinopoisk}</div>
        `
        moviesEl.appendChild(movieEl);
    });
}




document.getElementById("button_add_filter").onclick = function(){
    let inputDataTo = document.getElementById("inputDataTo");
    let inputDataDo = document.getElementById("inputDataDo");
    let inputCategory = document.getElementById("fil_category");
    let inputCountry = document.getElementById("fil_country");

    let API_URL_FILTERS = "https://kinopoiskapiunofficial.tech/api/v2.2/films?";

    console.log(inputDataTo.value.slice(0,4));
    console.log(inputDataDo.value == null);
    console.log(inputCategory.value);
    console.log(inputCountry.value);
    console.log("dddddddddddddd");

    if(inputDataTo.value == "" && inputDataDo.value == "" && 
        inputCategory.value == 0 && inputCountry.value == 0){
            document.getElementById("text__filter").innerHTML = `
                <p>Фильтры не выбраны</p>
            `
            return;
    }
    if(inputCountry.value != 0) API_URL_FILTERS = API_URL_FILTERS + "countries=" + inputCountry.value + "&";
    if(inputCategory.value != 0)  API_URL_FILTERS = API_URL_FILTERS + "genres=" + inputCategory.value + "&";
    API_URL_FILTERS += "order=RATING&type=ALL&ratingFrom=0&ratingTo=10&yearFrom=";
    if(inputDataTo.value != "") API_URL_FILTERS += inputDataTo.value.slice(0,4);
    else API_URL_FILTERS += "1000";
    API_URL_FILTERS += "&yearTo=";
    if(inputDataDo.value != "") API_URL_FILTERS += inputDataDo.value.slice(0,4);
    else API_URL_FILTERS += "3000";
    API_URL_FILTERS += "&page=1";
    getFilmsWithFilters(API_URL_FILTERS);
}