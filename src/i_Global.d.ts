// Copyright (c) 2021 latot. Licensed under the MIT license (see LICENSE).

import {i_stage, i_Flow} from "./Flow.js"

declare global {
    interface Window
                    {Game: {Flow: i_Flow;},
                    debug: boolean,
                    }
}

//Bug here, the stage should be i_stage format, but seems TS don't detect clases where are use extends in the type
//and only check over the primary class
declare global{
    //interface HTMLElement {stage?: i_stage}
    interface HTMLElement {stage?: i_stage}
}