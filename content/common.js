browser.runtime.onMessage.addListener((message, sender) => {
    const conference = getConference()
    return Promise.resolve(conference)
});
