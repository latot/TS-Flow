// Copyright (c) 2021 latot. Licensed under the MIT license (see LICENSE).

import {i_Flow} from "./Flow.js"

import * as Flow from './Flow.js'
//import * as Collector_Conf from './Stat Config.js'

class Game{
    Flow: i_Flow
    constructor(){
        this.Flow = new Flow.Flow()
    }
}

window.Game = new Game()
//window.Collector_Conf = new Collector_Conf.Collector_Conf()
