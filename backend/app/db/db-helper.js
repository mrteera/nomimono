const Loki = require('lokijs');
const path = require('path');

const adapter = new Loki.LokiFsAdapter()
const db = new Loki(path.join(__dirname, 'db.json'), {
  adapter,
  autoload: false,
  autosave: true,
  autosaveInterval: 4000
});


module.exports = { db }
