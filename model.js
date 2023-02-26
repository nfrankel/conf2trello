'use strict'

class Conference {
    constructor(title, country, website, cfp, start, end, deadline) {
        this.name = `${title} (${country})`
        this.country = country
        this.website = website
        this.cfp = cfp
        this.start = start
        this.end = end
        this.deadline = deadline
    }
}
