//Настройки
const _apiUrl = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/'
const _apiKey = '9ef736d1-56fd-437d-bad3-3ad1be303634'
const options = {
    method: 'GET',
    headers: {
        'X-API-KEY': _apiKey,
        'Content-Type': 'application/json',
    },
}

//DOM элементы
const filmsWrapper = document.querySelector('.films')
const loader = document.querySelector('.loader-wrapper')
const btnShowMore = document.querySelector('.show-more')
btnShowMore.onclick = fetchAndRenderFilms

let page = 1

//Получение и вывод данных
async function fetchAndRenderFilms() {
    loader.classList.remove('none')
    
    const data = await fetchData(_apiUrl + `top?page=${page}`, options)
    if (data.pagesCount > 1) page++
    if (data.pagesCount > 1) btnShowMore.classList.remove('none')

    loader.classList.add('none')

    renderFilms(data.films)

    if (page > data.pagesCount) btnShowMore.classList.add('none')
}

async function fetchData(url, options) {
    const response = await fetch(url, options)
    const data = await response.json()
    return data
}

function renderFilms(films) {
    for (film of films) {
        const card = document.createElement('div')
        card.classList.add('card')
        card.id = film.filmId
        card.onclick = openFilmDetails

        card.innerHTML = `
            <img src=${film.posterUrlPreview}  alt="Cover" class="card__img">
            <h3 class="card__title">${film.nameRu} </h3>
            <p class="card__year">${film.year} </p>
            <p class="card__rate">Рейтинг: ${film.rating}</p>
        `

        filmsWrapper.append(card)
    }
}

async function openFilmDetails(e) {

    if (document.querySelector('.container-right')) {
        document.querySelector('.container-right').remove()
    }

    const id = e.currentTarget.id

    const data = await fetchData(_apiUrl + id, options)
    console.log(data)

    renderFilmData(data)
}

function renderFilmData(data) {
    const containerRight = document.createElement('div')
    const btnClose = document.createElement('button')
    containerRight.classList.add('container-right')
    btnClose.classList.add('btn-close')
    btnClose.onclick = () => {
        containerRight.remove()
    }

    btnClose.innerHTML = `<img src="./img/cross.svg" alt="Close" width="24">`
    const html = `
        <div class="film">

            <div class="film__title">${data.nameRu}</div>

            <div class="film__img">
                <img src=${data.posterUrl}  alt="Cover">
            </div>

            <div class="film__desc">
                <p class="film__details">Год: ${data.year} </p>
                <p class="film__details">Рейтинг: ${data.ratingKinopoisk} </p>
                <p class="film__details">Продолжительность: ${formatFilmLenght(data.filmLength)} </p>
                <p class="film__details">Страна: ${formatCountry(data.countries)} </p>
                <p class="film_text">${data.description}</p>
            </div>
            
        </div>
    `

    containerRight.insertAdjacentElement('afterbegin', btnClose)
    containerRight.insertAdjacentHTML('beforeend', html)
    document.body.insertAdjacentElement('beforeend', containerRight)
}

function formatFilmLenght(value) {
    let res = ''
    let hours, minutes

    hours = Math.floor(value / 60)
    minutes = value % 60
    if (hours > 0) res += hours + ' ч. '
    if (minutes > 0) res += minutes + ' м.'
    
    return res
}

function formatCountry(arr) {
    let res = ''

    for (country of arr) {
        res += country.country
        if(arr.indexOf(country) + 1 < arr.length) res += ', '
    }
    
    return res
}

fetchAndRenderFilms().catch((err) => console.log(err))