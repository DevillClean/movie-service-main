const API_KEY = "f01b1f55-6648-4052-9e65-b3a9624691e4";
const API_URL_POPULAR = "https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_250_BEST_FILMS&page=1";
const API_SEARCH = "https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=";

getMovies(API_URL_POPULAR);

async function getMovies(url){
    const resp = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            "X-API-KEY": API_KEY
        },
    });
    const respData = await resp.json();
    showMovies(respData);
}

function getClassByRating(rating){
    if(rating > 6.5) return "green";
    if(rating < 4) return "red";
    return "yellow";
}

function showPageFilm(value){
    document.location.href = "C:/Institute/Web/MovieService/html/pageFilm.html?filmID=" + value;
}

function addFilmInStorage(value){
    let arrIdStor = localStorage.getItem("arrId");
    if(arrIdStor == null){
        arrIdStor = value;
    } else {
        arrIdStor = arrIdStor+","+value;
    }
    localStorage.setItem("arrId", arrIdStor);
}

function showMovies(data){
    const moviesEl = document.querySelector(".movies");

    data.films.forEach(movie => {
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
        <div class="movie__average movie__average--${getClassByRating(movie.rating)}">${movie.rating}</div>
        `
        moviesEl.appendChild(movieEl);
    });
}

async function searchFilms(keyWord){
    const resp = await fetch(API_SEARCH+keyWord+"&page=1",{
        headers: {
            "Content-Type": "application/json",
            "X-API-KEY": API_KEY
        },
    });
    const respData = await resp.json();
    showMovies(respData);
}

let input = document.getElementById("input-search");
input.onclick = function(){
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            const moviesEl = document.querySelector(".movies");
            moviesEl.innerHTML = "";
            if(input.value == ""){
                getMovies(API_URL_POPULAR);
                return;
            }
            searchFilms(input.value);
        }
      });
}


