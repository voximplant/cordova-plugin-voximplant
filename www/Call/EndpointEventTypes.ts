/*
* Copyright (c) 2011-2020, Zingaya, Inc. All rights reserved.
*/


/**
 * Events that are triggered when Endpoint is updated/edited, removed or started/stopped to receive stream from another Endpoint.
 * @event
 */
export enum EndpointEventTypes {
    /**
     * Event is triggered when endpoint information such as display name, user name and sip uri is updated.
     * The handler function receives an event with the following parameters as an argument.
     * @typedef EventHandlers.InfoUpdated
     */
    InfoUpdated              = 'InfoUpdated',
    /**
     * Event is triggered when an Endpoint is removed.
     * The handler function receives an event with the following parameters as an argument.
     * @typedef EventHandlers.Removed
     */
    Removed                  = 'Removed'
}
