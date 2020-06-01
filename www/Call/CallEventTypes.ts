/*
* Copyright (c) 2011-2020, Zingaya, Inc. All rights reserved.
*/



/**
 * The events that are triggered by [Call] instance.
 * Use [Call.on] to subscribe on any of these events.
 * @event
 */
export enum CallEventTypes {
    /**
     * Event is triggered when a realible connection is established for the call.
     * Depending on network conditions there can be a 2-3 seconds delay between first audio data and this event.
     * The handler function receives an event with the following parameters as an argument.
     * @typedef EventHandlers.CallEventWithHeaders
     */
    Connected               = 'Connected',
    /**
     * Event is triggered when a call was disconnected.
     * The handler function receives an event with the following parameters as an argument.
     * @typedef EventHandlers.Disconnected
     */
    Disconnected            = 'Disconnected',
    /**
     * Event is triggered when a new Endpoint is created. [Endpoint] represents an another participant in your call or conference.
     * The handler function receives an event with the following parameters as an argument.
     * @typedef EventHandlers.EndpointAdded
     */
    EndpointAdded           = 'EndpointAdded',
    /**
     * Event is triggered due to a call failure.
     * The handler function receives an event with the following parameters as an argument.
     * @typedef EventHandlers.Failed
     */
    Failed                  = 'Failed',
    /**
     * Event is triggered due to a call operation failure by the [Call.hold], [Call.sendVideo] and [Call.receiveVideo] methods.
     * The handler function receives an event with the following parameters as an argument.
     * @typedef EventHandlers.CallOperationFailed
     */
    CallOperationFailed     = 'CallOperationFailed',
    /**
     * Event is triggered when ICE connection is complete.
     * Handler function receives [CallEventTypes.ICECompleted] params as an argument.
     * @typedef EventHandlers.ICECompleted
     */
    ICECompleted            = 'ICECompleted',
    /**
     * Event is triggered when connection was not established due to a network connection problem between 2 peers.
     * The handler function receives an event with the following parameters as an argument.
     * @typedef EventHandlers.ICETimeout
     */
    ICETimeout              = 'ICETimeout',
    /**
     * Event is triggered when INFO message is received.
     * The handler function receives an event with the following parameters as an argument.
     * @typedef EventHandlers.InfoReceived
     */
    InfoReceived            = 'InfoReceived',
    /**
     * Event is triggered when a text message is received.
     * The handler function receives an event with the following parameters as an argument.
     * @typedef EventHandlers.MessageReceived
     */
    MessageReceived         = 'MessageReceived',
    /**
     * Event is triggered when a progress tone playback starts.
     * The handler function receives an event with the following parameters as an argument.
     * @typedef EventHandlers.ProgressToneStart
     */
    ProgressToneStart       = 'ProgressToneStart',
    /**
     * Event is triggered when a progress tone playback stops.
     * The handler function receives an event with the following parameters as an argument.
     * @typedef EventHandlers.ProgressToneStop
     */
    ProgressToneStop        = 'ProgressToneStop'
}
