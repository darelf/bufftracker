// Show off the new character stuff
var buff = require('../index')()

// A character
var PC1 = {id: "Lin O'Leum", type: 'PC'}
buff.addCharacter(PC1)

// A couple of sources
var sources = {
	"Bless": [
	  {"type": "Morale", "target": "attacks", "amount": 1, "stacks": false},
	  {"type": "Morale", "target": "saves vs. fear", "amount": 1, "stacks": false}
	],
	"Divine Favor": [
    {"type": "Luck", "target": "attacks", "amount": 1, "stacks": false},
    {"type": "Luck", "target": "weapon damage", "amount": 1, "stacks": false}
	]
}
// Import the sources
buff.applyFromSources(sources)

// Apply one of the sources
buff.applySourceToCharacter( 'Bless', "Lin O'Leum" )
// Show all the current buffs affecting the character
console.log( "Bonuses in effect for Lin O'Leum")
console.log( buff.showBonuses("Lin O'Leum").join('\n') )

// Apply the other source
buff.applySourceToCharacter( 'Divine Favor', "Lin O'Leum" )
console.log( "Now adding Divine Favor...")
console.log( "Bonuses in effect for Lin O'Leum")
console.log( buff.showBonuses("Lin O'Leum").join('\n') )

// Now Bless has worn off...
buff.removeSourceFromCharacter( 'Bless', "Lin O'Leum" )
console.log( "Now Removing Bless...")
console.log( "Bonuses in effect for Lin O'Leum")
console.log( buff.showBonuses("Lin O'Leum").join('\n') )
