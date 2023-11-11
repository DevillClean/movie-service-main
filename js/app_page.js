const API_KEY = "f01b1f55-6648-4052-9e65-b3a9624691e4";
const API_URL_FILM = "https://kinopoiskapiunofficial.tech/api/v2.2/films/";
const API_URL_BOX_OFFICE = "https://kinopoiskapiunofficial.tech/api/v2.2/films/";
const API_URL_STAFF = "https://kinopoiskapiunofficial.tech/api/v1/staff?filmId=";
const href = document.location.href;

let valueIndex = href.indexOf("=");
let value = "";

for(let i = valueIndex+1; i < href.length; i++){
    value+=href[i];
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

showMovie(value);

async function getMovieForId(url,value){
    const resp = await fetch(url+value,{
        headers: {
            "Content-Type": "application/json",
            "X-API-KEY": API_KEY
        },
    });
    const respData = await resp.json();
    return Promise.resolve(respData);
}

async function getStaffMovie(url, value){
    const resp = await fetch(url+value,{
        headers: {
            "Content-Type": "application/json",
            "X-API-KEY": API_KEY
        },
    });
    const respData =  await resp.json();
    return Promise.resolve(respData);
}

async function getBoxOfficeMovie(url,value){
    const resp = await fetch(url+value+"/box_office",{
        headers: {
            "Content-Type": "application/json",
            "X-API-KEY": API_KEY
        },
    });
    const respData = await resp.json();
    return Promise.resolve(respData);
}

async function showMovie(value){
    const dataFilm = await getMovieForId(API_URL_FILM,value);
    const dataStaff = await getStaffMovie(API_URL_STAFF,value);
    const dataBoxOffice = await getBoxOfficeMovie(API_URL_BOX_OFFICE,value);

    const body = document.querySelector("body");
    const conteiner = document.createElement("div");
        conteiner.classList.add("conteiner");
    conteiner.innerHTML = `
    <div class="conteiner_inner">
        <div class="movie__inner">
            <img class="movie__inner_img" src="${dataFilm.posterUrl}">
        </div>
        <div class="movie_information">
            <div class="movie__information_title">
                <h1 class="movie__title">${dataFilm.nameRu}</h1>
                <p class="movie_age">+${dataFilm.ratingAgeLimits.slice(3)}</p>
            </div>
            <p class="movie__description">
                ${dataFilm.description}
            </p>
            <div class="movie__information_inner">
                <p class="information_inner_text">Год производства:</p>
                <p class="information_inner_year">${dataFilm.year}</p>
            </div>
            <div class="movie__information_inner">
                <p class="information_inner_text">Страна:</p>
                <p class="information_inner_year">${dataFilm.countries.map(
                    (country) => ` ${country.country}`
                )}</p>
            </div>
            <div class="movie__information_inner">
                <p class="information_inner_text">Жанры:</p>
                <p class="information_inner_year">${dataFilm.genres.map(
                    (genre) => ` ${genre.genre}`
                )}</p>
            </div>
            <button class="movie__button_add" onclick="addFilmInStorage(value)" value="${value}">Добавить фильм</button>
        </div>
    </div>
    <h2 class="movie__title_second">Подробнее о фильме</h2>
    <div class="movie__information_inner" id="information_inner-second">
        <p class="information_inner_text">Режиссер:</p>
        <p class="information_inner_year">${dataStaff.filter(person => person.professionKey === "DIRECTOR").map(
            (person) => ` ${person.nameRu}`
        )}</p>
    </div>
    <div class="movie__information_inner" id="information_inner-second">
        <p class="information_inner_text">Сценарий:</p>
        <p class="information_inner_year">${dataStaff.filter(person => person.professionKey === "WRITER").map(
            (person) => ` ${person.nameRu}`
        )}</p>
    </div>
    <div class="movie__information_inner" id="information_inner-second">
        <p class="information_inner_text">Продюсер:</p>
        <p class="information_inner_year">${dataStaff.filter(person => person.professionKey === "PRODUCER").map(
            (person) => ` ${person.nameRu}`
        )}</p>
    </div>
    <div class="movie__information_inner" id="information_inner-second">
        <p class="information_inner_text">Оператор:</p>
        <p class="information_inner_year">${dataStaff.filter(person => person.professionKey === "OPERATOR").map(
            (person) => ` ${person.nameRu}`
        )}</p>
    </div>
    <div class="movie__information_inner" id="information_inner-second">
        <p class="information_inner_text">Композитор:</p>
        <p class="information_inner_year">${dataStaff.filter(person => person.professionKey === "COMPOSER").map(
            (person) => ` ${person.nameRu}`
        )}</p>
    </div>
    <div class="movie__information_inner" id="information_inner-second">
        <p class="information_inner_text">Бюджет:</p>
        <p class="information_inner_year">$${dataBoxOffice.items.find(money => money.type === "BUDGET").amount}</p>
    </div>
    <div class="movie__information_inner" id="information_inner-second">
        <p class="information_inner_text">Сборы в мире:</p>
        <p class="information_inner_year">$${dataBoxOffice.items.find(money => money.type === "WORLD").amount}</p>
    </div>
    <div class="movie__information_inner" id="information_inner-second">
        <p class="information_inner_text">Время:</p>
        <p class="information_inner_year">${showTime(dataFilm.filmLength)}</p>
    </div>
    <div class="movie__information_inner" id="information_inner-second">
        <p class="information_inner_text">Премьера в мире:</p>
        <p class="information_inner_year">${showDate(dataFilm.lastSync)}</p>
    </div>
    `
    body.appendChild(conteiner);
}

function showTime(time){
    let hours = Math.floor(time/60);
    let minutes = time - hours*60;
    return hours + " часа " + minutes + " минут";
}

function showDate(date){
    let dateNotTime = date.slice(0,10);
    let day = dateNotTime.slice(8);
    let mouth = dateNotTime.slice(5,7);
    let year = dateNotTime.slice(0,4);
    return day+dateNotTime[7]+mouth+dateNotTime[7]+year;
}