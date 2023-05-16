'use strict'

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

function parseDate(dateString) {
    const parts = dateString.split(' ')
    const month = months.findIndex(item => parts[0] === item)
    const day = parseInt(parts[1])
    const year = parseInt(parts[2])
    return new Date(year, month, day, 12, 0, 0)
}

function parseDeadline(dateString) {
    const parts = dateString.split(' ')
    const month = months.findIndex(item => parts[1] === item)
    const day = parseInt(parts[2])
    const year = parseInt(parts[3])
    return new Date(year, month, day, 12, 0, 0)
}

function getConference() {

    const name = document.getElementsByTagName('h1')[0].innerText

    const start = document.querySelectorAll('div[class="event-page-info-detail"] span[class=""]')[0].innerText
    const end = start

    const deadline = document.querySelector('p[class="cfp-block-subtitle"]').innerText

    const website = document.querySelectorAll('div[class="event-page-info-detail"] span[class=""]')[2].innerText

    const conference = new Conference(name,
        'France',
        website,
        window.location.href,
        parseDate(start),
        parseDate(end),
        parseDeadline(deadline)
    )

    console.log(conference)
    return conference
}
