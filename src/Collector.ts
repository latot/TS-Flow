// Copyright (c) 2021 latot. Licensed under the MIT license (see LICENSE.txt).

export interface i_Section_Sorter{
    add(data: any): void;
    union(data: any): void;
    deepcopy(): any;
}

export interface i_Section{
    collector(): i_Section_Sorter
    deepcopy(): any
}

//This class works in the next way
//data = [
//{'properties': [list of properties we want to append]
//'values': [list of elements we want to append]}
//]
//we want to construct any property, en the end, need to be translated to this format

export interface i_Classes{
    data: {[index: string]: any}
    union(data: i_Classes): void
    add(data: any): void
    deepcopy(): i_Classes
}

//Every collector, need to add a copy of the elements

export class Classes implements i_Classes{
    data: {[index: string]: any}
    constructor(data: any = []){
        this.data = {}
        this.add(data)
    }
    add(data: any): void{
        if (data instanceof Array){
            for (let el of data){
                this.add(el)
            }
            return
        }
        if (data instanceof Classes){
            this.union(data)
        }
        let name = data.constructor.name
        if (!(name in this.data)){
            this.data[name] = data.collector()
        }
        return this.data[name].add(data)
    }
    union(data: i_Classes): void{
        for (let el in data.data){
            if (el in this.data){
                this.data[el].union(data.data[el])
            }else{
                this.data[el] = data.data[el]
            }
        }
    }
    deepcopy(): i_Classes{
        let ret = new Classes()
        ret.data = this.data.deepcopy()
        return ret
    }
}

export interface i_Permutations{
    properties: Array<i_Classes>
    data: any
    union(perm: i_Permutations): void
    deepcopy(): i_Permutations
}

export class Permutations implements i_Permutations{
    properties: Array<i_Classes>
    data: Array<any>
    constructor (properties:Array<any> = [], data: Array<any> = []){
        this.properties = []
        for (let el of properties){
            this.properties.push(new Classes(el))
        }
        this.data = data
    }
    union(perm: i_Permutations): void{
        if (this.properties.length == 0){
            this.properties = perm.properties.deepcopy()
            this.data = perm.data.deepcopy()
        }
        if (perm.properties.length == 0){return}
        let p: Array<i_Classes> = []
        let d = []
        for (let i1 = 0;i1 < this.properties.length;i1++){
            for (let i2 = 0;i2 < perm.properties.length;i2++){
                let np = this.properties[i1].deepcopy()
                np.union(perm.properties[i2])
                p.push(np)
                d.push([this.data[i1].deepcopy(), perm.data[i2].deepcopy()])
            }
        }
        this.properties = p
        this.data = d
        return
    }
    deepcopy(){
        return new Permutations(this.properties.deepcopy(), this.data.deepcopy())
    }
}

/*Should I develop this? can simplify some sections to understand over the solver, but there is no more utility
interface i_S_Permutations{
    properties: Array<i_Classes>
    data: Array<i_Solver>
    union(perm: i_Permutations): void
    deepcopy(): i_Permutations 
}

class S_Permutations extends Permutations implements i_S_Permutations{
    properties: Array<i_Classes>
    data: Array<i_Solver>
    constructor(properties: Array<i_Classes>, data: Array<i_Solver>){
        super(properties, data)
    }
}
*/

export interface i_Solver{
    permutations: i_Permutations
    classes: i_Classes
    add(data: any): void
    solve_permutations(): void
    _add(data: any): void
}

export class Solver{
    permutations: i_Permutations
    classes: i_Classes
    constructor(data: any){
        this.permutations = new Permutations()
        this.classes = new Classes()
        this.add(data)
    }
    add(data: any){
        this._add(data)
        for (let id=0;id < this.permutations.data.length;id++){
            if (!(this.permutations.data[id] instanceof Solver)){
                this.permutations.data[id] = new Solver(this.permutations.data[id])
            }
        }
        this.solve_permutations()
    }
    solve_permutations(){
        //Maybe remove this line?
        if (this.permutations.properties.length == 0){return}
        let p = []
        let d = []
        for (let id1=0;id1 < this.permutations.properties.length;id1++){
            if ((this.permutations.data as i_Solver).permutations.properties.length){
                for (let id2=0;id2 < (this.permutations.data as i_Solver).permutations.properties.length;id2++){
                    let pt = this.permutations.properties[id1].deepcopy()
                    let dt = this.permutations.data[id1].deepcopy() as Solver
                    pt.add(this.permutations.data[id1].permutations.properties[id2])
                    dt.add(this.permutations.data[id1].permutations.data[id2])
                    dt.add(this.permutations.data[id1].classes)
                    p.push(pt)
                    d.push(dt)
                }
            }else{
               p.push(this.permutations.properties[id1])
               d.push(this.permutations.data[id1])
            }
        }
        this.permutations = new Permutations(p, d)
    }
    _add(data: any){
        if (data instanceof Array){
            for (let el of data){
                this.add(el)
            }
            return
        }
        if (data instanceof Permutations){
            this.permutations.union(data)
            return
        }
        this.classes.union(data)
    }
}