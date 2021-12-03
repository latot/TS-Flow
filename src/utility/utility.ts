// Copyright (c) 2021 latot. Licensed under the MIT license (see LICENSE).

declare var require: any

export function obj2txt(obj: any){
//Enable for nodejs support
    if (typeof window === 'undefined') {
        const util = require('util')
	    return util.inspect(obj, {depth: null});
    }else{
      return JSON.stringify(obj, null, 4);
    }
}

export function printv(obj: any){
	console.log(obj2txt(obj));
}