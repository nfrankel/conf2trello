'use strict'

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

function parseTitle(title) {
    return title.replace(/ \d{4}/, '')
}

function parseDueDate(date) {
    const dateParts = date.match(/(.*) (\d{2}), (\d{4}).*/)
    return parseDateParts(dateParts)
}

function parseDateParts(dateParts) {
    const year = parseInt(dateParts[dateParts.length - 1])
    const day = parseInt(dateParts[dateParts.length - 2])
    const monthString = dateParts[dateParts.length - 3]
    const month = months.findIndex(item => monthString === item)
    return new Date(year, month, day, 12, 0, 0)
}

function parseSubtitle(subtitle) {
    const regex = /(.*) (.*)+ (\d{2}), (\d{4})/i
    const endDateParts = regex.exec(subtitle)
    const endDate = parseDateParts(endDateParts)
    const rest = endDateParts[1]
    let startDate
    let tentativeLocation
    if (regex.test(rest)) {
        const startDateParts = regex.exec(rest)
        startDate = parseDateParts(startDateParts)
        tentativeLocation = startDateParts[1]
    } else {
        startDate = endDate
        tentativeLocation = rest
    }
    const locationParts = tentativeLocation.split(', ')
    const location = locationParts[locationParts.length - 1]
    return {
        start: startDate,
        end: endDate,
        location: location
    }
}

function getConference() {

    const title = document.getElementsByClassName('subheader__title')[0].innerText
    const subtitle = document.getElementsByClassName('subheader__subtitle')[0].innerText
    const { location: location, start: start, end: end } = parseSubtitle(subtitle)
    const deadline = Array.from(document.querySelectorAll('h3 td'))[1].innerText
    const website = document.querySelector('div.subheader__group a').innerText

    const conference = new Conference(parseTitle(title),
        loc2countries[location] ?? location,
        website,
        window.location.href,
        start,
        end,
        parseDueDate(deadline)
    )

    console.log(conference)
    return conference
}