// Copyright (c) 2021 latot. Licensed under the MIT license (see LICENSE).

export {}

declare global{
  interface Set<T>{
    cmp(subset: Set<T>): boolean,
    union(subset: Set<T>): Set<T>
    isSuperset(subset: Set<T>): boolean
    intersection(subset: Set<T>): Set<T>
    difference(subset: Set<T>): Set<T>
    cmp(subset: Set<T>): boolean
    ncmp(subset: Set<T>): boolean
    deepcopy(): Set<T>
  }
  interface String{
    cmp(str: string): boolean
    ncmp(str: string): boolean
    deepcopy(): String
  }
  interface Number{
    cmp(num: number): boolean
    ncmp(num: number): boolean
    deepcopy(): Number
  }
  interface Array<T>{
    cmp(arr: Array<T>): boolean
    ncmp(arr: Array<T>): boolean
    deepcopy(): Array<T>
  }
  interface Object{
    cmp(dict: Object): boolean
    ncmp(dict: Object): boolean
    deepcopy(): Object
  }
}