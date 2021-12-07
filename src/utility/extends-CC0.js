/*
Functions extensions of JS Set - Support isSuperset/union/intersection/difference

Code copied from: https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Set 

To the extent possible under law, the author(s) have dedicated all copyright and related and neighboring rights to this software to the public domain worldwide. This software is distributed without any warranty.

You should have received a copy of the CC0 Public Domain Dedication along with this software (see LICENCE-CC0). If not, see <http://creativecommons.org/publicdomain/zero/1.0/>. 

Mozilla uses the CC0 licence, all the credit to them
*/

Set.prototype.isSuperset = function(subset) {
  for (var elem of subset) {
      if (!this.has(elem)) {
          return false;
      }
  }
  return true;
}

Set.prototype.union = function(setB) {
  var union = new Set(this);
  for (var elem of setB) {
      union.add(elem);
  }
  return union;
}

Set.prototype.intersection = function(setB) {
  var intersection = new Set();
  for (var elem of setB) {
      if (this.has(elem)) {
          intersection.add(elem);
      }
  }
  return intersection;
}

Set.prototype.difference = function(setB) {
  var difference = new Set(this);
  for (var elem of setB) {
      difference.delete(elem);
  }
  return difference;
}