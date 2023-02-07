import { atom } from 'jotai';

import {
  ISpinSettings,
  IWheelColorPalette,
  IWheelGeometrySettings
} from '../common/interfaces';


export const channelsAtom = atom<string[]>([ 'fiku5golubev' ])
export const maxItemsCountAtom = atom<number>(256);
export const geometrySettingsAtom = atom<IWheelGeometrySettings>({
  radius: 2,
  centerRadiusPercent: 0.02,
  thickness: 0.25,
  outerRingWidth: 0.05,
  textPadding: 0.05,
  resolution: 10,
  pointerThickness: 0.01,
});

export const paletteAtom = atom<IWheelColorPalette>({
  sectorA: "#00c5ff",
  sectorB: "#00acff",
  sectorC: "#ffee00",
  outline: "#300666",
});

export const spinSettingsAtom = atom<ISpinSettings>({
  duration: 10,
  maxVelocity: 20,
  stages: [
    {
      name: 'idle',
      timing: 0,
      velocityPercent: 0,
    },
    {
      name: 'in',
      timing: 0,
      velocityPercent: 2
    },
    {
      name: 'mid',
      timing: 0.25,
      velocityPercent: 1,
    },
    {
      name: 'out',
      timing: 0.5,
      velocityPercent: 0,
      easing: (x: number) => (Math.sqrt(1 - Math.pow(x - 1, 2)))
    }
  ]
});
