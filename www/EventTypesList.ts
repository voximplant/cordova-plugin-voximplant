/*
* Copyright (c) 2011-2020, Zingaya, Inc. All rights reserved.
*/


import {ClientEventTypes} from "./Client/ClientEventTypes";
import {
    AuthResult,
    AuthTokenResult,
    ConnectionClosed,
    ConnectionEstablished,
    ConnectionFailed,
    IncomingCall
} from "./Client/ClientEventHandlers";
import {CallEventTypes} from "./Call/CallEventTypes";
import {
    CallEventWithHeaders,
    Disconnected,
    EndpointAdded,
    Failed,
    ICECompleted,
    ICETimeout,
    InfoReceived,
    LocalVideoStreamAdded, LocalVideoStreamRemoved, MessageReceived, ProgressToneStart, ProgressToneStop
} from "./Call/CallEventHandlers"
import {EndpointEventTypes} from "./Call/EndpointEventTypes";
import {InfoUpdated, RemoteVideoStreamAdded, RemoteVideoStreamRemoved, Removed} from "./Call/EndpointEventHandlers";

/**
 * @ignore
 */
export interface ClientEventTypesList {
    [ClientEventTypes.ConnectionEstablished]: ConnectionEstablished,
    [ClientEventTypes.ConnectionFailed]: ConnectionFailed,
    [ClientEventTypes.ConnectionClosed]: ConnectionClosed,
    [ClientEventTypes.AuthResult]: AuthResult,
    [ClientEventTypes.RefreshTokenResult]: AuthTokenResult,
    [ClientEventTypes.IncomingCall]: IncomingCall,
}

/**
 * @ignore
 */
export interface CallEventTypesList {
    [CallEventTypes.Connected]: CallEventWithHeaders,
    [CallEventTypes.Disconnected]: Disconnected,
    [CallEventTypes.EndpointAdded]: EndpointAdded,
    [CallEventTypes.Failed]: Failed,
    [CallEventTypes.ICECompleted]: ICECompleted,
    [CallEventTypes.ICETimeout]: ICETimeout,
    [CallEventTypes.InfoReceived]: InfoReceived,
    [CallEventTypes.LocalVideoStreamAdded]: LocalVideoStreamAdded,
    [CallEventTypes.LocalVideoStreamRemoved]: LocalVideoStreamRemoved,
    [CallEventTypes.MessageReceived]: MessageReceived,
    [CallEventTypes.ProgressToneStart]: ProgressToneStart,
    [CallEventTypes.ProgressToneStop]: ProgressToneStop
}

/**
 * @ignore
 */
export interface EndpointEventTypesList {
    [EndpointEventTypes.InfoUpdated]: InfoUpdated,
    [EndpointEventTypes.RemoteVideoStreamAdded]: RemoteVideoStreamAdded,
    [EndpointEventTypes.RemoteVideoStreamRemoved]: RemoteVideoStreamRemoved,
    [EndpointEventTypes.Removed]: Removed
}
