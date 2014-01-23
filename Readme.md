Buff Tracker
============
Usage:

    // Show off the new character stuff
    var buff = require('bufftracker')()
    
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
  
So, yeah. Keep track of those pesky bonuses during a game, and thanks to the magic of
CRDT (and dominictarr) everyone gets updated.

Oh, well, that part's not done yet, but it's simple enough to hook up the streams on the
Doc instances and off you go. Just pipe() everything and go "Woooooo!!!" or something.

Showing All Bonuses
-------------------
The most useful function for the end user will be the `showBonuses()` function, which
returns an array of all the targets formatted with their calculated bonuses in typical
Pathfinder format. See the `examples` directory for... ummm.. examples.

You will also find the `applyFromSources()` function which takes an object containing
keys of the different sources of buffs along with all the buffs they provide, then
imports them all into the current workspace.

Characters can be added and removed, and sources of bonuses can be applied to them
or removed from them. Removing a source will obviously remove their attachment to that
source as well.

Why Don't You...
----------------
As you might imagine, the BuffTracker is very data oriented.

It may be good to note here that it doesn't try to decide what applys. The important 
thing is to correctly craft the targets to give the player/GM information on when to
apply whatever bonuses are currently in effect. The idea is not to automate the gaming
but serve as an informational tool for the gaming.

One upcoming addition is to combine similar effects. That is, if you have a
+2 resistance bonus to saves and a +1 to save vs. fear, then it should correctly combine
them as a +2 to saves, +3 to save vs. fear.

ToDo
----

EVEN MORE COOL STUFF.

Contact
-------
Darel Finkbeiner, you know, etc. copyright and all that.
