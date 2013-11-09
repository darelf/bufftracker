var numeral = require('numeral')
var es = require('event-stream')
var crdt = require('crdt')
module.exports = BuffTracker

function BuffTracker(doc) {
  var self = this
  if (!doc) doc = new crdt.Doc()
  if (!(self instanceof BuffTracker)) return new BuffTracker(doc)
  self.doc = doc
}

BuffTracker.prototype.importAllBuffs = function(data) {
  var self = this
  for (var b in data) {
    var buff = data[b]
    buff.forEach(function(v) {
      var newbuff = v
      newbuff.source = b
      self.addBuff(newbuff)
    })
  }
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

BuffTracker.prototype.getTargetList = function() {
  var self = this
  var targets = []
  for (var r in self.doc.rows) {
    var t = self.doc.get(r).get('target')
    if (targets.indexOf(t) < 0) targets.push(t)
  }
  return targets
}

BuffTracker.prototype.showAllBonuses = function() {
  var self = this
  var arr = []
  var targets = self.getTargetList()
  targets.forEach(function(v) {
    var b = self.getBonus(v)
    if (b !== 0)
      arr.push(numeral(self.getBonus(v)).format('+0') + ' ' + v)
  })
  return arr
}
