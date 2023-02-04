import _ from 'lodash';
import { ratio } from 'fuzzball';
import { makeAutoObservable } from 'mobx';
import { Client, Userstate } from 'tmi.js';

import { IListedItem } from '../Interfaces';

import { Store } from './Store';


const EMPTY_ITEM: IListedItem = { label: '' };

export default class SessionStore {
  public items: IListedItem[];
  public joinUsersFromChat: boolean;
  public joinMessage: string;
  public connected: boolean;
  public currentChannel: string;

  private client: Client;
  private root: Store;

  constructor(root: Store) {
    this.root = root;

    this.client = new Client({});

    this.client.on('message', (...args) => this.onMessageHandler(...args));
    this.client.connect().then(() => this.setConnected(true));

    this.items = [];

    this.currentChannel = '';
    this.joinMessage = '';
    this.connected = false;
    this.joinUsersFromChat = false;

    makeAutoObservable(this, {}, { deep: true });
  }

  public get inChannel() {
    return !_.isEmpty(this.currentChannel);
  }

  public get ready(): boolean {
    return this.connected && this.inChannel;
  }

  public get winner(): IListedItem | undefined {
    return this.items.find((item) => item.label === this.root.wheel.winnerLabel);
  }

  public get isItemsEmpty(): boolean {
    return this.items.length === 0;
  }

  public get neverEmptyItems (): IListedItem[] {
    return this.items.length > 0
      ? this.items
      : [EMPTY_ITEM]
    ;
  }

  public onMessageHandler(channel: string, userstate: Userstate, message: string, self: boolean) {
    console.log(this.joinMessage);
    if(!this.joinUsersFromChat) {
      return;
    }

    const messageMatch =  ratio(message, this.joinMessage) >= 0.6 || _.isEmpty(this.joinMessage);

    if(messageMatch) {
      this.addItem(userstate.username, userstate);
    }
  }

  public setConnected(state: boolean) {
    this.connected = state;
  }

  public setCurrentChannel(channel: string) {
    this.currentChannel = channel;
  }

  public async joinChannel(channel: string) {
    if(_.isEmpty(channel) || !this.connected) {
      return;
    }

    if(this.inChannel) {
      await this.client.part(this.currentChannel);
    }

    await this.client.join(channel);
    this.setCurrentChannel(channel);
  }

  public setJoinMessage(message: string): void {
    this.joinMessage = message;
  }

  public addItem(label: string, userstate?: Userstate): void {
    const alreadyInclude = this.items.filter((item) => item.label === label).length > 0;
    const limitReached = this.items.length >= this.root.settings.maxLabelsCount;
    if(!limitReached && !alreadyInclude) {
      this.items = [...this.items, { label, userstate }];
    }
  }

  public removeItem(label: string): void {
    this.items = this.items.filter((val) => (val.label !== label));
    if(label === this.root.wheel.winnerLabel) {
      this.root.wheel.setWinner();
    }
  }

  public clearItems(): void {
    this.items = [];
  }

  public switchJoinAccess(): void {
    this.joinUsersFromChat = !this.joinUsersFromChat;
  }
}
