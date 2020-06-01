/*
* Copyright (c) 2011-2020, Zingaya, Inc. All rights reserved.
*/


/**
 * @private
 */
import {Call} from "./Call";
import {Endpoint} from "./Endpoint";


export interface InfoUpdated {
    /**
     * Name of the event
     */
    name: string;
    /**
     * Call which endpoint belongs to
     */
    call: Call;
    /**
     * Endpoint that triggered the event
     */
    endpoint: Endpoint;
}

/**
 * @private
 */
export interface Removed {
    /**
     * Name of the event
     */
    name: string;
    /**
     * Call which endpoint belongs to
     */
    call: Call;
    /**
     * Endpoint that triggered the event
     */
    endpoint: Endpoint;
}
