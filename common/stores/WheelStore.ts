import _ from 'lodash';
import { makeAutoObservable } from 'mobx';

import { ISpinStateSettings } from '../Interfaces';

import store, { Store } from './Store';
import { lerp } from 'maath/misc';

export default class WheelStore {

  public spinStateIndex: number;

  public spinStartTime: number;

  private spinRandom: number;

  private root: Store;

  constructor(root: Store) {
    this.root = root;

    this.spinStateIndex = 0;
    this.spinStartTime = 0
    this.spinRandom = 0;

    makeAutoObservable(this, {}, {});
  }

  get nextStateSettings(): ISpinStateSettings {
    const { states } = this.root.settings.spinning;
    return states?.[this.spinStateIndex + 1] ?? states[0];
  }
  get previewStateSettings(): ISpinStateSettings {
    const { states } = this.root.settings.spinning;
    return states?.[this.spinStateIndex - 1] ?? states[states.length - 1];
  }
  get currentStateSettings(): ISpinStateSettings {
    return  this.root.settings.spinning.states[this.spinStateIndex];
  }

  get globalProgress() {
    const pass = (Date.now() - this.spinStartTime);
    const total = (this.root.settings.spinning.duration * 1000);
    return _.clamp(pass / total, 0, 1);
  }

  get localProgress() {
    const curT: number = this.currentStateSettings.timing;
    const nextT: number = this.root.settings.spinning.states.length - 1 === this.spinStateIndex
      ? 1
      : this.nextStateSettings.timing
    ;
    return _.clamp((this.globalProgress - curT) / (nextT - curT), 0, 1);
  }

  get velocity() {
    const { velocityPercent, easing } = store.wheel.currentStateSettings;
    const easedLocalProgress = easing ? easing(this.localProgress) : this.localProgress
    return lerp(
      store.wheel.previewStateSettings.velocityPercent * this.randomizedMaxVelocity,
      velocityPercent * this.randomizedMaxVelocity,
      easedLocalProgress
    );
  }

  get randomizedMaxVelocity() {
    return this.root.settings.spinning.maxVelocity + this.spinRandom * 5;
  }

  setSpinState(i: number) {
    this.spinStateIndex = this.root.settings.spinning.states.length > i ? i : 0;

    if(i === 1) {
      this.spinStartTime = Date.now();
      this.spinRandom = Math.random();
    }
  }

  switchToNextSpinState() {
    this.setSpinState(this.spinStateIndex + 1);
  }

  switchSpinState() {
    if(this.spinStateIndex === 0) {
      return this.setSpinState(1);
    }
    else {
      return this.setSpinState(0);
    }
  }
}
