var buff = require('../index')()
var net = require('net')
var es = require('event-stream')

var A = buff.doc
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

net.createServer(function(stream) {
  stream.pipe(A.createStream()).pipe(stream)
  stream.on('error', function(e) {
	console.log("got a stream error")
  })
}).listen(8124)
