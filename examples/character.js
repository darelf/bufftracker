// Show off the new character stuff
var buff = require('../index')()

// A character
var PC1 = {id: "Lin O'Leum", type: 'PC', room: 'default'}
console.log("Trying to create Lin O'Leum: " + buff.addCharacter(PC1))
console.log("Trying to create Lin O'Leum again: " + buff.addCharacter(PC1))


// A couple of sources
var sources = {
	"Bless": [
	  {"room": "default", "type": "Morale", "target": "attacks", "amount": 1, "stacks": false},
	  {"room": "default", "type": "Morale", "target": "saves vs. fear", "amount": 1, "stacks": false}
	],
	"Divine Favor": [
    {"room": "default", "type": "Luck", "target": "attacks", "amount": 1, "stacks": false},
    {"room": "default", "type": "Luck", "target": "weapon damage", "amount": 1, "stacks": false}
	]
}
// Import the sources
buff.applyFromSources(sources)

buff.createBuff("default", "Acute Sense", "enhancement", "perception", 10, false)

// Apply one of the sources
buff.applySourceToCharacter( 'Bless', "Lin O'Leum" )
buff.applySourceToCharacter( 'Acute Sense', "Lin O'Leum" )
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

var s = buff.doc.createSet(function(state) { return (state.source) })
s.on('changes', console.log)
buff.applyFromSources( { "Fake": [ {"room": "default", "type": "Fake", "target": "Fake", "amount": 1, "stacks": false} ] } )
buff.applySourceToCharacter( 'Bless', "Lin O'Leum" )
