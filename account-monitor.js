const { checkAccounts } = require('./lib/main')

addEventListener('scheduled', (event) => {
  event.waitUntil(checkAccounts())
})
