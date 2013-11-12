var buff = require('../index')()
var shoe = require('shoe')
var reconnect = require('reconnect')
var es = require('event-stream')
var through = require('through')
var moment = require('moment')

var doc = buff.doc


var r = reconnect(function(stream) {
  var s = doc.createStream()
  s.pipe(stream).pipe(s)
}).connect('/bufftracker')

var pcs = doc.createSet('type', 'PC')
pcs.on('add', updatePCList)
pcs.on('remove', updatePCList)

var srcs = doc.createSet(function(state) { return (state.source) })
srcs.on('add', updateSourceList)
srcs.on('remove', updateSourceList)
srcs.on('changes', function(row) {
  updateSourceList()
})

function updatePCList() {
  var l = document.getElementById('pclist')
  l.innerHTML = '<option>--- Add New ---</option>'
  pcs.forEach(function(v) {
    var item = l.appendChild(document.createElement('option'))
    if (document.getElementById('newpc').value == v.id) {
      item.setAttribute('selected', true)
    }
    item.innerHTML = v.id
  })
  updatePCInfo()
}


document.getElementById('newpcbutton').addEventListener('click', function() {
  var newpc = document.getElementById('newpc')
  var name = newpc.value
  if (name) {
    buff.addCharacter({id: name, type: 'PC'})
    newpc.value = ''
  }
})

function updatePCInfo() {
  var pclist = document.getElementById('pclist')
  var txt = document.getElementById('pcinfo')
  txt.innerHTML = ''
  var pc = pclist.options[pclist.selectedIndex].value
  if (pc == '--- Add New ---') return
  var sources = buff.getAllSourceOnCharacter(pc)
  
  txt.innerHTML = 'Effects: ' + (sources.length ? sources.join(', ') : 'None') + '\n' + buff.showBonuses(pc).join('\n')
}
document.getElementById('pclist').addEventListener('change', function() {
  newpc.value = ''
  updatePCInfo()
})

function updateSourceList() {
  var srclist = document.getElementById('bufflist')
  var s = buff.getSourceList()
  var l = srclist
  l.innerHTML = ''
  s.forEach(function(v) {
    var item = l.appendChild(document.createElement('option'))
    item.innerHTML = v
  })
  updatePCInfo()
}

document.getElementById('buffapplybtn').addEventListener('click', function() {
  var srclist = document.getElementById('bufflist')
  var pclist = document.getElementById('pclist')
  var item = srclist.options[srclist.selectedIndex]
  var pc = pclist.options[pclist.selectedIndex]
  if (item && pc)
    buff.applySourceToCharacter( item.value, pc.value )
  updatePCInfo()
})

document.getElementById('buffremovebtn').addEventListener('click', function() {
  var srclist = document.getElementById('bufflist')
  var item = srclist.options[srclist.selectedIndex]
  var pc = pclist.options[pclist.selectedIndex]
  if (item && pc)
    buff.removeSourceFromCharacter( item.value, pc.value )
  updatePCInfo()
})

updatePCList()
updateSourceList()
updatePCInfo()
