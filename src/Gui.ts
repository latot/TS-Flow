// Copyright (c) 2021 latot. Licensed under the MIT license (see LICENSE).

import {stage, i_Flow, i_stage} from "./Flow.js"
import {Context, Load} from "./Handler.js"

//Bug here, the stage should be i_stage format, but seems TS don't detect clases where are use extends in the type
//and only check over the primary class
declare global{
    //interface HTMLElement {stage?: i_stage}
    interface HTMLElement {stage?: i_stage}
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