// Copyright (c) 2021 latot. Licensed under the MIT license (see LICENSE).

import {stage, i_Flow} from "./Flow.js"

export function Load(gui: HTMLElement, parents: Set<string>, elements: any, context: i_Context): Set<string>{
    if (elements.constructor == Array){
        let container_set: Set<string> = new Set() 
        for (let i = 0;i < elements.length;i++){
            container_set = container_set.union(Load(gui, parents, elements[i], context))
        }
        return container_set
    }
    if (elements instanceof stage){
        elements.parents = parents.union(elements.parents)
        window.Game.Flow.register(elements)
        elements.setContext(context)
        elements.init(gui)
        return new Set([elements.id])
    }
    if (elements instanceof Context){
        let ret = Load(gui, parents, elements.tmp_data, context.sub(elements))
        elements.tmp_data = undefined
        return ret
    }
    console.log(elements)
    throw "This element is not supported to be loaded"
}

/*
The context class will pass the context over the elements
while new contexts can be defined

The type of context depends in how the new context will inherit the options

Overwrite: the new context will overwrite the existing features
Zero: the new context will no inherit nothing from the conext

*/

export interface i_Context{
    properties: {[index: string]: any}
    type: string
    tmp_data: any
    sub(cons: i_Context): i_Context
}

export class Context{
    properties: {[index: string]: any}
    type: string
    tmp_data: any
    constructor(properties: {[index: string]: any} = {}, type: string = "overwrite", tmp_data: any = undefined){
        this.properties = properties
        this.type = type
        this.tmp_data = tmp_data
    }
    sub(cons: i_Context): i_Context{
        switch (cons.type){
            case "overwrite":
                let ret = new Context(this.properties, "overwrite")
                for (let opt in cons.properties){
                    ret.properties[opt] = cons.properties[opt]
                }
                return ret
            case "zero":
                return cons
        }
        throw "The constext type is not detected"
    }
}