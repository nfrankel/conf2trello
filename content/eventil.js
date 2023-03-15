'use strict'

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function parseDate(year, monthString, day) {
    const month = months.findIndex(item => monthString == item)
    return new Date(year, month, day, 12, 0, 0)
}

function parseSubtitle(subtitle) {
    const regex = /([a-zA-Z]{3}) (\d\d?)( - (\d\d?))?, (\d{4}) · (.*), ?(.*)/g
    const parts = regex.exec(subtitle)
    const month = parts[1]
    const startDay = parts[2]
    const endDay = parts[4]
    const year = parts[5]
    const country = parts[7]
    const startDate = parseDate(year, month, startDay)
    let endDate = parseDate(year, month, endDay ?? startDay)
    return {
        start: startDate,
        end: endDate,
        country: country
    }
}

async function fetchCfpData() {
    const url = new URL(`${window.location.href}/cfp`)
    const response = await fetch(url.href, { method : 'GET'})
    const html = await response.text()
    const parser = new DOMParser()
    const document = parser.parseFromString(html, 'text/html')
    const deadline = document.querySelector('h6 > span').innerText
    const regex = /([a-zA-Z]{3}) (\d\d?), (\d{4})/g
    const parts = regex.exec(deadline)
    return {
        deadline: parseDate(parts[3], parts[1], parts[2]),
        cfp: document.querySelector('.event a.btn-primary').href
    }
}

async function getConference() {

    const title = document.querySelector('h1.hero-title').innerText.replace(/ \d{4}/, '')
    const subtitle = document.querySelector('.hero-event-date').innerText
    const data = parseSubtitle(subtitle)
    const website = new URL(document.querySelector('ul.widget-content > li > a').href)
    website.search = ''

    const { deadline: deadline, cfp: cfp } = await fetchCfpData()

    const conference = new Conference(title,
        data.country,
        website.toString(),
        cfp,
        data.start,
        data.end,
        deadline
    )

    console.log(conference)
    return conference
}
