var fs = require('fs')
var buff = require('../index')()

var sources = JSON.parse(fs.readFileSync('sources.json', {encoding: 'utf-8'}))
delete sources['Shaken']
buff.applyFromSources( sources )

//Oh noes, I added it twice!!!
buff.applyFromSources( sources )

// Yay, CRDT!
console.log( buff.showBonuses().join('\n') )
