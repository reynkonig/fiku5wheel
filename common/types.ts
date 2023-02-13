import { Userstate } from 'tmi.js';
import { IMeshGeometryData, IWheelGeometrySettings } from './interfaces';

export type TwitchMessageHandler = (channel: string, userstate: Userstate, message: string, self: boolean) => void;

export type GetTwitchChannelBadgesMethod = (channel: string) => void;

export type MeshGeometryDataGenerator = (geometrySettings: IWheelGeometrySettings) => IMeshGeometryData;
