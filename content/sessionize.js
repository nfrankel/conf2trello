'use strict'

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function parseDate(dateString) {
    const parts = dateString.split(' ')
    const day = parseInt(parts[0])
    const month = months.findIndex(item => parts[1] == item)
    const year = parseInt(parts[2])
    const date = new Date(year, month, day)
    return date
}

function parseCountry(locationString) {
    const parts = locationString.split(', ')
    return parts[parts.length - 1]
}

function getConference() {

    const name = document.querySelector('h4').innerText

    const calendars = document.querySelectorAll('.fa-calendar')
    const start = calendars[0].parentElement.parentElement.getElementsByTagName('h2')[0].innerText
    const end = calendars[1]?.parentElement?.parentElement?.getElementsByTagName('h2')[0]?.innerText ?? start

    const deadline = Array.from(document.querySelectorAll('.text-navy'))
                          .filter(elem => elem.textContent.startsWith('Call closes'))[0]
                          .parentElement.parentElement.querySelector('h2').innerText

    const location = document.getElementsByClassName('fa-map-marker')[0]
                             .parentElement.parentElement.getElementsByTagName('h2')[0].innerText

    const website = document.getElementsByClassName('fa-globe')[0]
                            ?.parentElement.parentElement.getElementsByTagName('h2')[0]
                            ?.getElementsByTagName('a')[0]
                            ?.href ?? window.location.href

    return new Conference(name,
        parseCountry(location),
        website,
        window.location.href,
        parseDate(start),
        parseDate(end),
        parseDate(deadline)
    )
}
