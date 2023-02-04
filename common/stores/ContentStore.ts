import { makeAutoObservable } from 'mobx';

import { IBadges } from '../Interfaces';

import { Store } from './Store';


export default class ContentStore {
  private _badges: IBadges | undefined;
  private root: Store;

  constructor(root: Store) {
    this.root = root;

    this._badges = undefined;

    makeAutoObservable(this, {}, {});
  }

  public setBadges(badges: IBadges) {
    this._badges = badges;
  }

  public get badges(): IBadges {
    return this._badges ?? { local: [], global: [] };
  }

  public getBadgeSRC (name: string, versionId?: string): string {
    for (const source of [ this.badges.local, this.badges.global ]) {
      const matchSet = source.find((set) => set.set_id === name);
      if (matchSet) {
        if (versionId) {
          const version = matchSet.versions.find((version) => version.id === versionId);

          if (version) {
            return version.image_url_4x;
          }
        } else {
          return matchSet.versions?.[0]?.image_url_4x ?? "";
        }
      }
    }

    return "";
  }
}
