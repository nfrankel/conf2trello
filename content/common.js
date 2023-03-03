browser.runtime.onMessage.addListener((message, sender) => {
    const conference = getConference()
    const isAsync = getConference.constructor.name === 'AsyncFunction'
    window.alert(`Conference ${conference.name} parsed successfully`)
    if (isAsync) {
        return conference
    } else {
        return Promise.resolve(conference)
    }
});
