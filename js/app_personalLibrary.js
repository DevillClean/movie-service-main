const URL_FILM = "https://kinopoiskapiunofficial.tech/api/v2.2/films/";
const API_KEY = "f01b1f55-6648-4052-9e65-b3a9624691e4";

let arrStr = localStorage.getItem("arrId");
let arr = [];
let tmp = "";
for(let i=0; i < arrStr.length; i++){
    if(arrStr[i] == ","){
        arr.push(tmp);
        tmp = "";
    }else{
        tmp=tmp+arrStr[i];
    }
}
arr.push(tmp);

let filteredStrings = arr.filter((item, index) => {
    return arr.indexOf(item) === index;
});

loopFindFilms(filteredStrings);

function loopFindFilms(filteredStrings){
    for(let i = 0; i < filteredStrings.length; i++){
        getMovie(filteredStrings[i]);
    }
}

async function getMovie(value){
    const resp = await fetch(URL_FILM+value, {
        headers: {
            "Content-Type": "application/json",
            "X-API-KEY": API_KEY
        },
    });
    const respData = await resp.json();
    showMovie(respData);
}

async function showMovie(movie){
    const moviesEl = document.querySelector(".movies");
    const movieEl = document.createElement("div");
        movieEl.classList.add("movie");
        movieEl.setAttribute("id", movie.kinopoiskId);
        movieEl.innerHTML = `
        <div class="movie__cover-inner">
                        
            <img class="movier_cover" src="${movie.posterUrlPreview}" alt="${movie.nameRu}">
            <button id="movie__button_a" onclick="showPageFilm1(value)" value="${movie.kinopoiskId}">
                <div class="movie__cover-darkened"></div>
            </button>
        
        </div>
        <div class="movie__info">
            <div class="movie__title">${movie.nameRu}</div>
            <div class="movie__category">${movie.genres.map(
                (genre) => ` ${genre.genre}`
            )}</div> 
        </div>
        <button class="movie__button-delete" onclick="deleteFilmInStorage(value)" value="${movie.kinopoiskId}">
            <img class="movier_cross" src="../Images/cross.svg">
        </button>
        <div class="movie__average movie__average--${getClassByRating(movie.ratingKinopoisk)}">${movie.ratingKinopoisk}</div>
        `
    moviesEl.appendChild(movieEl);
}

function getClassByRating(rating){
    if(rating > 6.5) return "green";
    if(rating < 4) return "red";
    return "yellow";
}

function deleteFilmInStorage(value){
    document.getElementById(value).remove();
    let strStorage = "";
    let result = [];
    for( let i = 0;i < filteredStrings.length;i++){
        if(filteredStrings[i] != value){
            result.push(filteredStrings[i]);
        }
    }
    filteredStrings = result;
    for(let i = 0; i < filteredStrings.length-1; i++){
        strStorage = strStorage + filteredStrings[i] + ",";
    }
    strStorage += filteredStrings[filteredStrings.length-1];
    localStorage.setItem("arrId", strStorage);
}

function showPageFilm1(value){
    document.location.href = "C:/Institute/Web/MovieService/html/pageFilmPersonal.html?filmID=" + value;
}