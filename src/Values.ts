// Copyright (c) 2021 latot. Licensed under the MIT license (see LICENSE).

import { i_Section, i_Section_Sorter } from "./Collector.js"
import {stage, i_stage} from "./Flow.js"
import {Context, Load} from "./Handler.js"

//Collector, every class that will be sorted to the final sorte need a way to organize it self

export interface i_Sort_Stats{
    properties: Array<{[index: string]: string}>
    values: Array<Array<number | string>>
    findProperty(property: {[index: string]: string}): number
    add(istat: i_Stat): void
}

export class Sort_Stats implements i_Sort_Stats, i_Section_Sorter{
    properties: Array<{[index: string]: string}>
    values: Array<Array<number | string>>
    constructor(){
        this.properties = []
        this.values = []
    }
    findProperty(property: {[index: string]: string}): number{
        return this.properties.findIndex((element) => element.cmp(property))
    }
    add(istat: i_Stat): void{
        this._add(istat.properties, [istat.value])
    }
    _add(property: {[index: string]: string}, values: Array<number | string>){
        let id = this.findProperty(property)
        if (id == -1){
            this.properties.push(property)
            this.values.push(values)
        }else{
            this.values[id] = this.values[id].concat(values)
        }
    }
    union(isort: i_Sort_Stats): void{
        for (let sub=0; sub < isort.properties.length;){
            this._add(isort.properties[sub], isort.values[sub])
        }
    }
    cmp(other: i_Sort_Stats){
        if (this.properties.length != other.properties.length){return false}
        if (this.properties.length == 0){return true}
        let checked1 = new Set()
        let checked2 = new Set()
        for (let id1 = 0;id1 < this.properties.length;id1++){
            if (id1 in checked1){continue}
            for (let id2 = 0;id2 < other.properties.length;id2++){
                if (id2 in checked2){continue}
            }

        }
    }
}

interface i_Stat{
    properties: {[index: string]: string}
    value: string | number
}

//A very basic "Stat", like "new Stat('defense', 100)"

export class Stat extends stage implements i_Stat, i_Section{
    properties: {[index: string]: string}
    value: string | number
    constructor(istat: {[index: string]: string}, value: string){
        super(window.Game.Flow)
        this.properties = istat
        this.value = value
    }
    collector(): i_Section_Sorter{
        return new Sort_Stats()
    }
    init(container: HTMLElement){
        let label = document.createElement("div")
        label.innerHTML = this.properties['name'] + ": " + this.value
        container.appendChild(label)
    }
    getData(){
        return this
    }
}

export interface i_Options extends i_stage{
    tmp_data: Array<{[index: string]: any}>;
    values: {[index: string]: HTMLElement};
    values_childs: {[index: string]: Set<string>};
    active: string;
    init:(container: HTMLElement) => void;
    changeOption:(element: HTMLSelectElement) => void;

}

function Options_UpdateGUI(this: HTMLSelectElement){
    (this.stage! as i_Options).changeOption(this)
}

export class Options extends stage implements i_Options{
    //Need to store the options until is specified where to load the gui
    tmp_data: Array<{[index: string]: any}>
    values: {[index: string]: HTMLElement}
    values_childs: {[index: string]: Set<string>}
    active: string
    constructor(ioptions: Array<{[index: string]: any}>){
        super(window.Game.Flow)
        this.tmp_data = ioptions
        this.values = {}
        this.active = "0"
        this.values_childs = {}
    }
    init(container: HTMLElement){
        let here = document.createElement("select")
        let container_opts = document.createElement("div")
        here.stage = this
        for (let id=0; id<this.tmp_data.length;id++){
            let id_ = id.toString()
            let opt = this.tmp_data[id]
            let label = document.createElement("option")
            label.value = id_
            label.innerHTML = opt['name']
            let container_opt = document.createElement("div")
            if (window.debug){
                if (!(this.context instanceof Context)){
                    throw "The context is not defined"
                }
            }
            this.values_childs[id_] = Load(container_opt, new Set([this.id]), opt['data'], this.context!)
            if (id != 0){
                container_opt.style.display = "none"
            }else{
                this.flow.appendParents2Childs(new Set([this.id]), this.values_childs[id_])
                this.childs = this.values_childs["0"]
            }
            this.values[id_] = container_opt
            here.appendChild(label)
            container_opts.appendChild(container_opt)
        }
        here.addEventListener("change", Options_UpdateGUI)
        container.appendChild(here)
        container.appendChild(container_opts)
        this.tmp_data = []
    }
    changeOption(element: HTMLSelectElement){
        //Is there any case when this is triggered and the value does not change?
        //if (this.active == element.value) {return}
        this.values[this.active].style.display = "none"
        this.values[element.value].style.display = ""
        this.flow.removeParentsOfChilds(new Set([this.id]), this.values_childs[this.active])
        this.active = element.value
        this.flow.appendParents2Childs(new Set([this.id]), this.values_childs[this.active])
        this.childs = this.values_childs[this.active]
    }
}