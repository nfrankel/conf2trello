'use strict'

const trelloRoot = 'https://api.trello.com/1/cards'
let settings

function readSettings() {
    browser.storage.sync.get()
           .then(data => {
                settings = {
                   listId: data.listId,
                   key: data.key,
                   token: data.token
                }
           }, error => {
               console.error(`Error: ${error}`)
           })
}

async function createTrelloCard(tabIdAndConference) {
    console.log(tabIdAndConference)
    const url = new URL(trelloRoot)
    const conference = tabIdAndConference.conference
    url.searchParams.append('key', settings.key)
    url.searchParams.append('token', settings.token)
    url.searchParams.append('idList', settings.listId)
    url.searchParams.append('name', conference.name)
    url.searchParams.append('due', conference.deadline)
    url.searchParams.append('pos', 'top')
    const label = loc2labels[country2locs[conference.country]]
    if (label) {
        url.searchParams.append('idLabels', [label])
    }
    const response = await fetch(url.href, { method : 'POST'})
    const json = await response.json()
    conference.id = json.id
    conference.shortUrl = json.shortUrl
    conference.url = json.url
    return { tabId:tabIdAndConference.tabId, conference : conference }
}

async function addSite(tabIdAndConference) {
    await addCustomField(tabIdAndConference, '5d7d4c1935fdfa4694ba4aee', 'text', tabIdAndConference.conference.website)
    return tabIdAndConference
}

async function addCfp(tabIdAndConference) {
    await addCustomField(tabIdAndConference, '5d7d4c3f916ba638f02eef34', 'text', tabIdAndConference.conference.cfp)
    return tabIdAndConference
}

async function addStartDate(tabIdAndConference) {
    await addCustomField(tabIdAndConference, '5d7d4c0179ae055927330752', 'date', tabIdAndConference.conference.start)
    return tabIdAndConference
}

async function addEndDate(tabIdAndConference) {
    await addCustomField(tabIdAndConference, '5d7d4c0c9742fc23ee16e9de', 'date', tabIdAndConference.conference.end)
    return tabIdAndConference
}

async function addCustomField(tabIdAndConference, idCustomField, type, value) {
    const conference = tabIdAndConference.conference
    const id = conference.id
    const url = new URL(`${trelloRoot}/${id}/customField/${idCustomField}/item`)
    url.searchParams.append('key', settings.key)
    url.searchParams.append('token', settings.token)
    await fetch(url.href, {
        method : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value : { [type] : value }})
    })
    return tabIdAndConference
}

async function confirmCreation(tabIdAndConference) {
    browser.tabs.sendMessage(tabIdAndConference.tabId, {
        action: 'confirm',
        conference: tabIdAndConference.conference
    })
}

function sendMessage(tab) {
      browser.tabs
             .sendMessage(tab.id, {
                action: 'scrape',
                tabId: tab.id
             })
             .then(createTrelloCard)
             .then(addSite)
             .then(addCfp)
             .then(addStartDate)
             .then(addEndDate)
             .then(confirmCreation)
             .catch(error => {
                 console.error(`Error: ${error}`)
             })
}

browser.browserAction.onClicked.addListener(sendMessage)
document.addEventListener('DOMContentLoaded', readSettings)
