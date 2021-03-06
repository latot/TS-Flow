// Copyright (c) 2021 latot. Licensed under the MIT license (see LICENSE).

/*Extends to:
cmp: compare if two objects are the same
ncmp: compare if two objects are different
deepcopy: return a copy of the objecto, without any reference variable or similar, check some of them for examples
*/
Array.prototype.cmp = function (arr){
  if (this == arr) return true
  if (this.length != arr.length) return false
  if (this.length == 0) return true
  for (let id = 0;id < this.length;id++){
    if (this[id].ncmp(arr[id])){return false}
  }
  return true
}

//Array.prototype.ncmp = function(arr){return !(this.cmp(arr))}

Array.prototype.ncmp = function(arr){
  if (this == arr) return false
  if (this.length != arr.length) return true
  if (this.length == 0) return false
  for (let id = 0;id < this.length;id++){
    if (this[id].ncmp(arr[id])) return true
  }
  return false
}

String.prototype.cmp = function (str){return this == str}
String.prototype.ncmp = function (str){return this != str}

Number.prototype.cmp = function (num){return this == num}
Number.prototype.ncmp = function (num){return this != num}

Set.prototype.cmp = function (setB){
  if (this == setB) return true
  if (this.size != setB.size) return false
  if (this.isSuperset(setB)) return true
  return false
}

//Set.prototype.ncmp = function (setB){return !(this.cmp(setB))}

Set.prototype.ncmp = function (setB){
  if (this == setB) return false
  if (this.size != setB.size) return true
  if (this.isSuperset(setB)) return false
  return true
}

Object.prototype.cmp = function(dict){
  if (this == dict) return true
  if (Set(Object.keys(this)).ncpm(Set(Object.keys(dict)))) return false
  for (id in this){
    if (this[id].ncmp(dict[id])) return false
  }
  return true
}

//Object.prototype.ncmp = function(dict){return !(this.cmp(dict))}

Object.prototype.ncmp = function(dict){
  if (this == dict) return false
  if (Set(Object.keys(this)).ncpm(Set(Object.keys(dict)))) return true
  for (id in this){
    if (this[id].ncmp(dict[id])) return true
  }
  return false
}

//Deep copy

Object.prototype.deepcopy = function(){
  let one = {}
  for (let obj in this){
    one[obj.deepcopy()] = this[obj].deepcopy()
  }
  return one
}

Array.prototype.deepcopy = function(){
  let one = []
  for (let obj of this){
    one.push(obj.deepcopy())
  }
  return one
}

Set.prototype.deepcopy = function(){
  let one = new Set()
  for (let obj of this){
    one.add(obj.deepcopy())
  }
  return one
}

String.prototype.deepcopy = function(){return this}
Number.prototype.deepcopy = function(){return this}
