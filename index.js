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

BuffTracker.prototype.applyFromSources = function(data) {
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

BuffTracker.prototype.deleteBuff = function(buffid) {
  var self = this
  self.doc.rm(buffid)
}

BuffTracker.prototype.updateBuff = function(buff) {
  var self = this
  var r = self.doc.get(buff.id)
  if (r && r.get('source')) {
    r.set('source', buff.source)
    r.set('type', buff.type)
    r.set('target', buff.target)
    r.set('amount', buff.amount)
    r.set('stacks', buff.stacks)
  } else {
    self.addBuff(buff)
  }
  if (buff.source) self.updateSource(buff.source)
}

BuffTracker.prototype.updateSource = function(source) {
  var self = this
  var persons = []
  self.doc.createSet('source', source).each(function(v) {
    var l = v.get('applies')
    if (l) {
      l.forEach(function(p) {
        if (persons.indexOf(p) < 0) persons.push(p)
      })
    }
  })
  persons.forEach(function(v) {
    self.applySourceToCharacter(source, v)
  })
}

BuffTracker.prototype.deleteBuffsBySource = function(source) {
  var self = this
  self.doc.createSet('source', source).each(function(v) {
    self.doc.rm(v.get('id'))
  })
}

BuffTracker.prototype.addCharacter = function(person) {
  var self = this
  self.doc.add(person)
}

BuffTracker.prototype.removeCharacter = function(personid) {
  var self = this
  self.removeAllFromCharacter(personid)
  self.doc.rm(personid)
}

BuffTracker.prototype.applyBuffToCharacter = function(buffid, personid) {
  var self = this
  var b = self.doc.get(buffid)
  if (!b) return
  var l = b.get('applies')
  if (l) {
    if (l.indexOf(personid) < 0) l.push(personid)
  } else { l = [personid] }
  b.set('applies', l)
}

BuffTracker.prototype.removeBuffFromCharacter = function(buffid, personid) {
  var self = this
  var b = self.doc.get(buffid)
  if (!b) return
  var l = b.get('applies')
  if (!l) return
  var idx = l.indexOf(personid)
  if (idx > -1) {
    l.splice(idx,1)
    b.set('applies', l)
  }
}

BuffTracker.prototype.applySourceToCharacter = function(source, personid) {
  var self = this
  self.doc.createSet('source', source).each(function(v){
    self.applyBuffToCharacter(v.id, personid)
  })
}

BuffTracker.prototype.getAllSourceOnCharacter = function(personid) {
  var self = this
  var arr = []
  self.doc.createSet(function(state) { return (state.source && state.applies && (state.applies.indexOf(personid) > -1)) }).each(function(v) {
    if ( arr.indexOf(v.get('source')) < 0 )
      arr.push(v.get('source'))
  })
  return arr
}

BuffTracker.prototype.removeSourceFromCharacter = function(source, personid) {
  var self = this
  self.doc.createSet('source', source).each(function(v){
    self.removeBuffFromCharacter(v.id, personid)
  })  
}

BuffTracker.prototype.removeAllFromCharacter = function(personid) {
  var self = this
  for (var v in self.doc.rows) {
    var item = self.doc.get(item)
    if ( item.get('source') ) {
      var l = item.get('applies')
      var idx = l.indexOf(personid)
      if (idx > -1) {
        l.splice(idx,1)
        item.set('applies', l)
      }
    }
  }
}

BuffTracker.prototype.getTargetForCharacter = function(target, personid) {
  var self = this
  return self.doc.createSet(function(state) {
    return (state.target === target && state.applies && (state.applies.indexOf(personid) > -1))
  })
}

BuffTracker.prototype.getBonus = function(target, personid) {
  var self = this
  var total = 0
  var cum = {}
  var set = []
  if (personid) { set = self.getTargetForCharacter(target, personid) } else { set = self.doc.createSet('target', target) }
  set.each(function(v) {
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
    if (t && targets.indexOf(t) < 0) targets.push(t)
  }
  return targets
}

BuffTracker.prototype.getSourceList = function() {
  var self = this
  var sources = []
  for (var r in self.doc.rows) {
    var s = self.doc.get(r).get('source')
    if (s && sources.indexOf(s) < 0) sources.push(s)
  }
  return sources
}

BuffTracker.prototype.showBonuses = function(personid) {
  var self = this
  var arr = []
  var targets = self.getTargetList()
  targets.forEach(function(t) {
    var b = self.getBonus(t, personid)
    if (b !== 0)
      arr.push(numeral(b).format('+0') + ' ' + t)
  })
  return arr
}
