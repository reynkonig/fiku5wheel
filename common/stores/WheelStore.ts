import _ from 'lodash';
import { makeAutoObservable } from 'mobx';

import { ISpinStateSettings } from '../Interfaces';

import store, { Store } from './Store';
import { lerp } from 'maath/misc';

export default class WheelStore {
  public winnerLabel: string;
  public spinStateIndex: number;
  public spinStartTime: number;
  private spinRandom: number;
  private root: Store;

  constructor(root: Store) {
    this.root = root;

    this.winnerLabel = "";

    this.spinStateIndex = 0;
    this.spinStartTime = 0
    this.spinRandom = 0;

    makeAutoObservable(this, {}, {});
  }

  public get labels() {
    return this.root.session.neverEmptyItems.map((item) => item.label);
  }

  public get isSpinning() {
    return this.spinStateIndex !== 0;
  }

  public get nextStateSettings(): ISpinStateSettings {
    const { states } = this.root.settings.spinning;
    return states?.[this.spinStateIndex + 1] ?? states[0];
  }

  public get previewStateSettings(): ISpinStateSettings {
    const { states } = this.root.settings.spinning;
    return states?.[this.spinStateIndex - 1] ?? states[states.length - 1];
  }

  public get currentStateSettings(): ISpinStateSettings {
    return  this.root.settings.spinning.states[this.spinStateIndex];
  }

  public get globalProgress() {
    const pass = (Date.now() - this.spinStartTime);
    const total = (this.root.settings.spinning.duration * 1000);
    return _.clamp(pass / total, 0, 1);
  }

  public get localProgress() {
    const curT: number = this.currentStateSettings.timing;
    const nextT: number = this.root.settings.spinning.states.length - 1 === this.spinStateIndex
      ? 1
      : this.nextStateSettings.timing
    ;
    return _.clamp((this.globalProgress - curT) / (nextT - curT), 0, 1);
  }

  public get velocity() {
    const { velocityPercent, easing } = store.wheel.currentStateSettings;
    const easedLocalProgress = easing ? easing(this.localProgress) : this.localProgress
    return lerp(
      store.wheel.previewStateSettings.velocityPercent * this.randomizedMaxVelocity,
      velocityPercent * this.randomizedMaxVelocity,
      easedLocalProgress
    );
  }

  public get randomizedMaxVelocity() {
    return this.root.settings.spinning.maxVelocity + this.spinRandom * 5;
  }

  public setWinner(label: string = '') {
    this.winnerLabel = label;
  }

  public setSpinState(newSpinStateIndex: number, angle?: number) {
    this.spinStateIndex = this.root.settings.spinning.states.length > newSpinStateIndex
      ? newSpinStateIndex
      : 0
    ;

    if(newSpinStateIndex === 1) {
      this.spinStartTime = Date.now();
      this.spinRandom = Math.random();
    }

    if(angle && this.spinStateIndex === 0) {
      const stepAngle = 360 / this.labels.length;
      const rawWinnerIndex = Math.abs(Math.floor((angle + stepAngle / 2) / stepAngle));
      const normalizedWinnerIndex = rawWinnerIndex >= this.labels.length
        ? rawWinnerIndex - this.labels.length
        : rawWinnerIndex;
      const winner = this.labels[normalizedWinnerIndex];
      this.setWinner(winner);
    }
  }

  public switchToNextSpinState(angle: number) {
    const nextSpinStateIndex = this.spinStateIndex + 1;
    this.setSpinState(nextSpinStateIndex, angle)
  }

  public switchSpinState(angle: number) {
    if(!this.isSpinning && !this.root.session.isItemsEmpty) {
      this.setSpinState(1);
    }
    else {
      this.setSpinState(0, angle);
    }
  }
}
