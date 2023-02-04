import axios from 'axios';
import { makeAutoObservable } from 'mobx';

import { IBadges } from '../Interfaces';

import { Store } from './Store';


export class ContentStore {
  private _badges: IBadges | undefined;
  private _root: Store;

  constructor(root: Store) {
    this._root = root;

    this._badges = undefined;

    makeAutoObservable(this, {}, {});
  }

  public async loadAll() {
    const { channel } = this._root.settings;

    const response = await axios({ method: 'get', url: `/api/badges/${channel}`, params: { channel }})

    this._badges = response.data;
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
