browser.runtime.onMessage.addListener(message => {
    switch(message.action) {
        case 'scrape':
            const conference = getConference()
            const isAsync = getConference.constructor.name === 'AsyncFunction'
            if (isAsync) {
                return conference.then(conference => {
                    return { tabId: message.tabId, conference: conference }
                })
            } else {
                return Promise.resolve({ tabId: message.tabId, conference: conference })
            }
            break
        case 'confirm':
            window.alert(`Conference ${message.conference.name} created successfully at ${message.conference.shortUrl}`)
            break
    }
});
