import { makeAutoObservable } from 'mobx';
import { Store } from './Store';
import {
  ISpinSettings,
  IWheelColorPalette,
  IWheelGeometrySettings
} from '../Interfaces';

export default class SettingsStore {
  public channel: string;
  public maxLabelsCount: number;
  public geometry: IWheelGeometrySettings;
  public palette: IWheelColorPalette;
  public spinning: ISpinSettings;
  private root: Store;

  constructor(root: Store) {
    this.root = root;

    this.channel = 'fiku5golubev';

    this.maxLabelsCount = 256;

    this.geometry = {
      radius: 2,
      centerRadiusPercent: 0.02,
      thickness: 0.25,
      outerRingWidth: 0.05,
      textPadding: 0.05,
      resolution: 10,
      pointerThickness: 0.01,
    }

    this.palette = {
      sectorA: "#00c5ff",
      sectorB: "#00acff",
      sectorC: "#ffee00",
      outline: "#300666",
    }

    this.spinning = {
      duration: 10,
      maxVelocity: 20,
      states: [
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
    };

    makeAutoObservable(this, {}, { deep: true });
  }
}
