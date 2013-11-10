var fs = require('fs')
var buff = require('../index')()

/* conditions.json contains a few examples of conditions that apply negative 'bonuses' */
var sources = JSON.parse(fs.readFileSync('conditions.json', {encoding: 'utf-8'}))

/* apply two conditions, Shaken and Entangled */

var currentConditions = {'Shaken': sources['Shaken'], 'Entangled': sources['Entangled']}
buff.applyFromSources( currentConditions )

console.log( buff.showAllBonuses().join('\n') )
