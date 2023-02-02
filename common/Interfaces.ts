import { Userstate } from 'tmi.js';

export interface IMeshGeometryData {
  vertices: number[];
  triangles?: number[]
}

export interface IWheelColorPalette {
  sectorA: string;
  sectorB: string;
  sectorC: string;
  outline: string;
}

export interface IWheelGeometrySettings {
  radius: number;
  centerRadiusPercent: number;
  thickness: number;
  textPadding: number;
  outerRingWidth: number;
  pointerThickness: number;
  resolution: number;
}

export interface ILabeledItem {
  label: string;
  userstate?: Userstate;
}

export interface IBadgesImageSets {
  global: IBadgeSet[];
  local: IBadgeSet[];
}

export interface IBadgeSet {
  set_id: string;
  versions: IBadgeVersion[];
}

export interface IBadgeVersion {
  id: string;
  image_url_1x: string;
  image_url_2x: string;
  image_url_4x: string;
}

export interface ISpinStateSettings {
  name: string;
  timing: number;
  velocityPercent: number;
  easing?: (x: number) => number;
}

export interface ISpinSettings {
  duration: number;
  maxVelocity: number;
  states: ISpinStateSettings[];
}
