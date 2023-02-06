export enum WheelSpinState {
  Idle,
  Acceleration,
  Damping,
}

export enum ChannelState {
  JoinPlanned = 'join_planned',
  Joining = 'joining',
  Joined = 'joined',
  PartPlanned = 'part_planned',
  Parting = 'parting'
}

export enum TwitchClientState {
  Disconnected = 'disconnected',
  Connecting = 'connecting',
  Connected = 'connected'
}
