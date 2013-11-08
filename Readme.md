Buff Tracker
============
Lots of work left to do.

Usage:

    var buff = require('bufftracker')()
    var a = {source:'Bless', type:'Morale', target: 'tohit', amount:1, stacks: false}
    var b = {source:'Divine Favor', type:'Luck', target: 'tohit', amount:2, stacks: false}
    var e = {source:'Careful Teamwork', type:'Morale', target:'tohit', amount:2, stacks: false}
    
    var c = {source:'Dodge Feat', type:'Dodge', target: 'ac', amount: 1, stacks: true}
    var d = {source:'Haste', type: 'Dodge', target: 'ac', amount:1, stacks: true}
    
    buff.addBuff(a)
    buff.addBuff(b)
    buff.addBuff(c)
    buff.addBuff(d)
    buff.addBuff(e)
    
    console.log("AC bonus: " + buff.getBonus('ac'))
    console.log("To Hit Bonus: " + buff.getBonus('tohit'))
  
So, yeah. Keep track of those pesky bonuses during a game, and thanks to the magic of
CRDT (and dominictarr) everyone gets updated.

Oh, well, that part's not done yet, but it's simple enough to hook up the streams on the
Doc instances and off you go. Just pipe() everything and go "Woooooo!!!" or something.

ToDo
----

First, would be useful to have a way to add all the bonuses for a single source at once,
and store them so they can be turned on and off easily.

Next, have nice easy api for listing all bonuses at once.

Then, EVEN MORE COOL STUFF.

Contact
-------
Darel Finkbeiner, you know, etc. copyright and all that.
