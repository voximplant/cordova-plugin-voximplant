/*
* Copyright (c) 2011-2020, Zingaya, Inc. All rights reserved.
*/


import {EndpointEventTypes} from "./EndpointEventTypes";
import {EndpointEventTypesList} from "../EventTypesList";


/**
 * Class that represents any remote media unit in a call. Current endpoints can be retrieved via the [Call.getEndpoints] method.
 */
export class Endpoint {
    /**
     * The endpoint id
     */
    public id: string;

    /**
     * User display name of the endpoint.
     */
    public displayName: string;

    /**
     * SIP URI of the endpoint
     */
    public sipUri: string;

    /**
     * User name of the endpoint.
     */
    public userName: string;

    /**
     * @ignore
     */
    private _listeners: Map<EndpointEventTypes, Set<Function>> = new Map();

    /**
     * @ignore
     */
    constructor(id: string, displayName: string, sipUri: string, userName: string) {
        this.id = id;
        this.displayName = displayName;
        this.sipUri = sipUri;
        this.userName = userName;
    }

    /**
     * Register a handler for the specified endpoint event.
     * One event can have more than one handler.
     * Use the [Endpoint.off] method to delete a handler.
     * @param eventType
     * @param event
     */
    public on<T extends keyof EndpointEventTypesList>(eventType: T|EndpointEventTypes, event: (ev: EndpointEventTypesList[T]) => void): void {
        if (!event || typeof event !== 'function') {
            console.warn(`Endpoint: on: handler is not a Function`);
            return;
        }
        if (Object.values(EndpointEventTypes).indexOf(eventType) === -1) {
            console.warn(`Endpoint: on: EndpointEventTypes does not contain ${eventType} event`);
            return;
        }
        if(!this._listeners.has(eventType)) {
            this._listeners.set(eventType, new Set());
        }
        // @ts-ignore
        this._listeners.get(eventType).add(event);
    }

    /**
     * Remove a handler for the specified endpoint event.
     * @param eventType
     * @param event Handler function. If not specified, all handlers for the event will be removed.
     */
    public off<T extends keyof EndpointEventTypesList>(eventType: T|EndpointEventTypes, event?: (ev: EndpointEventTypesList[T]) => void): void {
        if (!this._listeners.has(eventType)) {
            return;
        }
        if (Object.values(EndpointEventTypes).indexOf(eventType) === -1) {
            console.warn(`Endpoint: off: EndpointEventTypes does not contain ${eventType} event`);
            return;
        }
        if (event && typeof event === 'function') {
            // @ts-ignore
            this._listeners.get(eventType).delete(event);
        } else {
            this._listeners.set(eventType, new Set());
        }
    }

    _handleEvent(eventType: EndpointEventTypes, params: any) {
        if (eventType === EndpointEventTypes.InfoUpdated) {
            this.displayName = params.displayName;
            this.sipUri = params.sipUri;
            this.userName = params.userName;
            delete params.displayName;
            delete params.sipUri;
            delete params.userName;
        }


        delete params.endpointId;
        params.endpoint = this;

        this._emit(eventType, params);
    }


    /**
     * @ignore
     */
    private _emit(eventType: EndpointEventTypes, event: object) {
        console.log(`VOXCRD: Endpoint._emit: ready to emit event: ${eventType}`);
        const handlers = this._listeners.get(eventType);
        handlers!.forEach(handler => handler(event));
    }
}
