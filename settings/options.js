function saveOptions(e) {
    browser.storage.sync.set({
        listId: document.querySelector('#list-id').value,
        key: document.querySelector('#key').value,
        token: document.querySelector('#token').value,
    })
}

function restoreOptions() {
    browser.storage.sync.get()
           .then(data => {
               document.querySelector('#list-id').value = data.listId || ''
               document.querySelector('#key').value = data.key || ''
               document.querySelector('#token').value = data.token || ''
           }, error => {
               console.error(`Error: ${error}`)
           })
}

document.addEventListener('DOMContentLoaded', restoreOptions)
document.querySelector('form').addEventListener('submit', saveOptions)
