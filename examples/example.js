var fs = require('fs')
var buff = require('../index')()

var sources = JSON.parse(fs.readFileSync('sources.json', {encoding: 'utf-8'}))
buff.importAllBuffs( sources )

console.log( buff.showAllBonuses().join('\n') )
