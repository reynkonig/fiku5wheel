import { autorun } from 'mobx';

import WheelStore from './WheelStore';
import ContentStore from './ContentStore';
import SessionStore from './SessionStore';
import SettingsStore from './SettingsStore';

export class Store {

  public wheel: WheelStore;
  public content: ContentStore;
  public session: SessionStore;
  public settings: SettingsStore

  constructor() {
    this.wheel = new WheelStore(this);
    this.content = new ContentStore(this);
    this.session = new SessionStore(this);
    this.settings = new SettingsStore(this);
  }
}

const store = new Store();

autorun(async () => {
  const { channel } = store.settings;
  const { connected, currentChannel } = store.session;

  if(connected) {
    if(currentChannel !== channel) {
      await store.session.joinChannel(channel);
    }
  }
})


export default store;
