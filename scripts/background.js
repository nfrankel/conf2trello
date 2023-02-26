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

async function createTrelloCard(conference) {
    const url = new URL(trelloRoot)
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
    return { conference : conference, id: json.id }
}

async function addSite(conferenceAndId) {
    await addCustomField(conferenceAndId, '5d7d4c1935fdfa4694ba4aee', 'text', conferenceAndId.conference.website)
    return conferenceAndId
}

async function addCfp(conferenceAndId) {
    await addCustomField(conferenceAndId, '5d7d4c3f916ba638f02eef34', 'text', conferenceAndId.conference.cfp)
    return conferenceAndId
}

async function addStartDate(conferenceAndId) {
    await addCustomField(conferenceAndId, '5d7d4c0179ae055927330752', 'date', conferenceAndId.conference.start)
    return conferenceAndId
}

async function addEndDate(conferenceAndId) {
    await addCustomField(conferenceAndId, '5d7d4c0c9742fc23ee16e9de', 'date', conferenceAndId.conference.end)
    return conferenceAndId
}

async function addCustomField(conferenceAndId, idCustomField, type, value) {
    const conference = conferenceAndId.conference
    const id = conferenceAndId.id
    const url = new URL(`${trelloRoot}/${id}/customField/${idCustomField}/item`)
    url.searchParams.append('key', settings.key)
    url.searchParams.append('token', settings.token)
    await fetch(url.href, {
        method : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value : { [type] : value }})
    })
    return conferenceAndId
}

function sendMessage(tab) {
      browser.tabs
             .sendMessage(tab.id, {})
             .then(createTrelloCard)
             .then(addSite)
             .then(addCfp)
             .then(addStartDate)
             .then(addEndDate)
             .then(conferenceAndId => {
                console.log(`Card ${conferenceAndId.conference.name} has been created [id: ${conferenceAndId.id}] `)
             })
             .catch(error => {
                 console.error(`Error: ${error}`)
             })
}

browser.browserAction.onClicked.addListener(sendMessage)
document.addEventListener('DOMContentLoaded', readSettings)
