const API_KEY = "f01b1f55-6648-4052-9e65-b3a9624691e4";
const API_URL_FILM = "https://kinopoiskapiunofficial.tech/api/v2.2/films/";
const API_URL_BOX_OFFICE = "https://kinopoiskapiunofficial.tech/api/v2.2/films/";
const API_URL_STAFF = "https://kinopoiskapiunofficial.tech/api/v1/staff?filmId=";
const API_TREILER = "https://kinopoiskapiunofficial.tech/api/v2.2/films/";
const href = document.location.href;

let flag = 0;
let valueIndex = href.indexOf("=");
let value = "";

for(let i = valueIndex+1; i < href.length; i++){
    value+=href[i];
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

async function getTreiler(url,value){
    const resp = await fetch(url+value+"/videos",{
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
    const dataTreiler = await getTreiler(API_TREILER, value);

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
            <a class="movie__button_add" style="display: block; width: 30%; text-decoration: none;" target="_blank"
                href="${dataTreiler.items.find(video => video.site === "YOUTUBE" 
                && (video.name.indexOf("трейлер") != -1 || video.name.indexOf("Трейлер")!= -1)).url}">Смотреть</a>
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
    <button class="movie__button_add" id="add_Feedback" onclick="addFeedback()">Добавить отзыв</button>
    <div id="conteiner_Feedback" style="display:none;">
            <div class="conteiner_Feedback-inner">
                <input type="text" style="width:30%" id="username" placeholder="Имя">
                <input type="text" style="width:50%" id="userjob" placeholder="Род занятий">
            </div>
            <textarea id="feedback"  rows="5" placeholder="Текст отзыва"></textarea >
            <input id="film_score" type="number" min="1" max="10" style="width: 18%;"  placeholder="Оценка фильма">
            <button class="movie__button_add" style="width: 20%; margin-left: 80%;" id="send_Feedback" onclick="sendFeedback()">Отправить отзыв</button>
    </div>
    <div id="conteiner__feedbacks"></div>
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

function goToVideo(value){
    console.log(value);
}

function addFeedback(){
    if(flag == 0){
        document.getElementById("conteiner_Feedback").style.display = "block";
        flag = 1;
    } else {
        document.getElementById("conteiner_Feedback").style.display = "none";
        flag = 0;
    }
}

function sendFeedback(){
    let name_user = document.getElementById("username");
    let job_user = document.getElementById("userjob");
    let feedback = document.getElementById("feedback");
    let film_score = document.getElementById("film_score");

    let feedbackObject = {
        name_user: name_user.value,
        job_user: job_user.value,
        feedback: feedback.value,
        film_score: film_score.value,
        id_film: value
    };

    let arrFeedbackStor = JSON.parse (localStorage.getItem("arrFeedback"));
    if(arrFeedbackStor == null){
        arrFeedbackStor = [feedbackObject];
    }else{
        arrFeedbackStor.push(feedbackObject);
    }
    localStorage.setItem("arrFeedback", JSON.stringify(arrFeedbackStor));
}

showFeedbacks(value);

function showFeedbacks(value){
    const conteiner_feed = document.getElementById("conteiner__feedbacks");
    let dataFeed = JSON.parse (localStorage.getItem("arrFeedback"));
    let dataFeedFilm = dataFeed.filter(feedback => feedback.id_film === value);


    dataFeedFilm.forEach(feedback => {
        console.log(feedback);
        let feedbackEl = document.createElement("div");
        feedbackEl.setAttribute("class", "conteiner_feedback");
        feedbackEl.innerHTML = `
            <div class="feedback-inner">
                <p class="feedback_userName">${feedback.name_user}</p>
                <p class="feedback_score feedback_score--${getClassByRating(feedback.film_score)}"">${feedback.film_score}</p>
            </div>
            <p class="feedback_userJob">${feedback.job_user}</p>
            <p class="feedback_text">${feedback.feedback}</p>
        `
        conteiner_feed.appendChild(feedbackEl);
    });
}

function getClassByRating(value){
    if(value > 6.5) return "green";
    if(value < 4) return "red";
    return "yellow";
}