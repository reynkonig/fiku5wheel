import { makeAutoObservable } from 'mobx';
import { Client, Userstate } from 'tmi.js';
import { ratio } from 'fuzzball';

import { ILabeledItem } from '../Interfaces';

import { Store } from './Store';

export default class SessionStore {
  public labeledItems: ILabeledItem[];
  public open: boolean;
  public ready: boolean;
  public winner: ILabeledItem;
  public joinMessage: string;
  private twitchClient: Client | null
  private root: Store;

  constructor(root: Store) {
    this.root = root;

    this.labeledItems = Array.from('ABCDEFG').map(
      (val) => ({ label: val })
    );

    this.open = false;
    this.ready = false;
    this.winner = { label: '' };

    this.joinMessage = "";

    this.twitchClient = null;

    makeAutoObservable(this, {}, { deep: true });
  }

  private setReady() {
    this.ready = true;
  }

  async joinChannel(channel: string) {
    if(this.twitchClient === null) {
      this.twitchClient = new Client({ channels: [channel] });

      await this.twitchClient.connect();

      this.twitchClient.on('message', (channel, userstate, message, self) => {
        if(!this.open) {
          return;
        }
        const matchPercent = ratio(this.joinMessage, message);

        if((matchPercent >= 60 || this.joinMessage === '') && userstate?.username) {
          this.addLabel(userstate.username, userstate);
        }
      });

      this.setReady();
    }
  }

  setWinner(label: ILabeledItem) {
    this.winner = label;
  }

  setJoinMessage(message: string) {
    this.joinMessage = message;
  }

  addLabel(label: string, userstate?: Userstate) {
    const alreadyInclude = this.labeledItems.filter((item) => item.label === label).length > 0;
    if(this.labeledItems.length < this.root.settings.maxLabelsCount && !alreadyInclude) {
      this.labeledItems = [...this.labeledItems, { label, userstate }];
    }
  }

  removeLabel(label: string) {
    this.labeledItems = this.labeledItems.filter((val) => (val.label !== label));
  }

  clearLabels() {
    this.labeledItems = [];
  }

  switchOpen() {
    this.open = !this.open;
  }
}
