var es = require('event-stream')
var crdt = require('crdt')
module.exports = BuffTracker

function BuffTracker(doc) {
  var self = this
  if (!doc) doc = new crdt.Doc()
  if (!(self instanceof BuffTracker)) return new BuffTracker(doc)
  self.doc = doc
}

BuffTracker.prototype.createBuff = function(source, type, target, amount, stacks) {
  var self = this
  var b = {source: source, type: type, target: target, amount: amount, stacks: stacks}
  this.addBuff(b)
  return b
}

BuffTracker.prototype.addBuff = function(buff) {
  var self = this
  self.doc.add({id: [buff.source,buff.type,buff.target].join('|'),
               source: buff.source, type: buff.type, amount: buff.amount, target: buff.target, stacks: buff.stacks})
}

BuffTracker.prototype.deleteBuff = function(source) {
  var self = this
  self.doc.createSet('source', source).each(function(v) {
    self.doc.rm(v.get('id'))
  })
}

BuffTracker.prototype.getBonus = function(target) {
  var self = this
  var total = 0
  var cum = {}
  self.doc.createSet('target', target).each(function(v) {
    if (v.get('stacks')) {
      total += v.get('amount')
    } else {
      var key = v.get('type')
      if (cum[key]) cum[key].push(v.get('amount'))
      else cum[key] = [v.get('amount')]
    }
  })
  for (var k in cum) {
    total += Math.max.apply(Math,cum[k])
  }
  return total
}
