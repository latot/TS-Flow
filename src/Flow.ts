// Copyright (c) 2021 latot. Licensed under the MIT license (see LICENSE).

import {i_Context} from "./Handler.js"

export interface i_stage{
    parents: Set<string>;
    childs: Set<string>;
    data: any;
    getData: () => any;
    update: () => void;
    id: string;
    flow: i_Flow;
    destroy: () => void;
    init: (container: HTMLElement) => void;
    setContext: (context: i_Context) => void;
    context?: i_Context;
}

export class stage implements i_stage{
    parents: Set<string>;
    childs: Set<string>;
    data: any;
    id: string;
    flow: i_Flow;
    context?: i_Context;
    type?: string;
    constructor(iflow: i_Flow){
        this.parents = new Set();
        this.childs = new Set();
        this.data = undefined;
        this.flow = iflow;
        this.id = "";
    }
    update(): void{
        this.data = []
        this.childs.forEach(item => this.data.push(this.flow.stages[item].getData()))
    };
    getData(): any {
        if (this.data == undefined){this.update()}
        return this.data
    };
    destroy(): void{}
    init(container: HTMLElement): void{}
    setContext(context: i_Context){
        this.context = context
    }
};

/*Flow

This class handle the flow of calculations and changes, here is register every stage

id_base: just a start name for every automatically generated id for stages without name

count: counter to generate ids for stage

flow: here is registered all the stages

change: if a stage changes, we need to add the id here

new_id: generate a new uniq id for a stage

register: add a stage to the Flow

unregister: remove a stage from the flow

update: update all the stages based in what have been changed in the set "change"

*/

export interface i_Flow{
    id_base: string;
    count: number;
    stages: {[index: string]: stage};
    changes: Set<string>;
    new_id: () => string;
    register: (istage: i_stage) => void;
    unregister: (id: string) => void;
    update: () => void;
    appendChilds2Parents: (parents: Set<string>, childs: Set<string>) => void;
    removeChildsOfParents: (parents: Set<string>, childs: Set<string>) => void;
    appendParents2Childs: (parents: Set<string>, childs: Set<string>) => void;
    removeParentsOfChilds: (parents: Set<string>, childs: Set<string>) => void;
}

export class Flow implements i_Flow{
    id_base: string;
    count: number;
    stages: {[index: string]: stage};
    changes: Set<string>;
    constructor(){
        this.id_base = "FLOW_"
        this.count = 0
        this.stages = {}
        this.changes = new Set()
    }
    new_id(): string{this.count++;return (this.id_base + (this.count - 1))}
    register(istage: i_stage): void{
        if (istage.id == ""){
            istage.id = this.new_id()
        }
        this.stages[istage.id] = istage
    }
    unregister(id: string): void{
        //Unregister, need to remove the only-childs?
        /*
        for (let child of this.stages[id].childs){
            if (child in this.stages){
                this.stages[child].parents.delete(id)
            }
        }
        for (let parent of this.stages[id].parents){
            if (parent in this.stages){
                this.stages[parent].childs.delete(id)
            }
        }
        */
        this.stages[id].destroy()
        delete this.stages[id]
    }
    _update_tree(tree: {[index: string]: Set<string>}){
        while (Object.keys(tree).length != 0){
            let updated: Set<string> = new Set()
            for (let istage in tree){
                if (tree[istage].size == 0){
                    this.stages[istage].update()
                    delete tree[istage]
                    updated.add(istage)
                }
            }
            for (let istage in tree){
                for (let rem of updated){
                    tree[istage].delete(rem)
                }
            }
        }
    }
    update(): void{
        //Stages to update
        let to_update: {[index: string]: Set<string>} = {}
        let set_to_update: Set<string> = new Set()
        for (let child of this.changes){
            for (let istage of genParents(this.stages, child)){
                set_to_update.add(istage)
            }
        }
        for (let istage of set_to_update){
            to_update[istage] = set_to_update.intersection(this.stages[istage].childs)
        }
        this._update_tree(to_update)
    }
    appendChilds2Parents(parents: Set<string>, childs: Set<string>): void{
        for (let parent of parents){
            for (let child of childs){
                this.stages[parent].childs.add(child)
            }
        }
    }
    removeChildsOfParents(parents: Set<string>, childs: Set<string>): void{
        for (let parent of parents){
            for (let child of childs){
                this.stages[parent].childs.delete(child)
            }
        }
    }
    appendParents2Childs(parents: Set<string>, childs: Set<string>): void{
        for (let parent of parents){
            for (let child of childs){
                this.stages[child].parents.add(parent)
            }
        }
    }
    removeParentsOfChilds(parents: Set<string>, childs: Set<string>): void{
        for (let parent of parents){
            for (let child of childs){
                this.stages[child].parents.delete(parent)
            }
        }
    }
}

//Get all the parents of a respective stage
function* genParents(flow: {[index: string]: stage}, child: string): IterableIterator<string>{
    for (let el of flow[child].parents){
        yield el
        for (let _ of genParents(flow, el)){}
    }
}