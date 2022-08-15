import StandingState from './standing-state.js';
import SittingState from './sitting-state.js';
import RunningState from './running-state.js';
import JumpingState from './jumping-state.js';
import FallingState from './falling-state.js';
import RollingState from './rolling-state.js';
import GetHitState from './get-hit-state.js';
import DivingState from './diving-state.js';
import DizzyState from './dizzy-state.js';
import DeadState from './dead-state.js';

export const StateId = {
  Standing: 'Standing',
  Sitting: 'Sitting',
  Running: 'Running',
  Jumping: 'Jumping',
  Falling: 'Falling',
  Rolling: 'Rolling',
  Dizzy: 'Dizzy',
  GetHit: 'GetHit',
  Diving: 'Diving',
  Dead: 'Dead',
};

let stateTable = null;

export function setupStateTable(player) {
  stateTable = {
    [StateId.Standing]: new StandingState(player),
    [StateId.Sitting]: new SittingState(player),
    [StateId.Running]: new RunningState(player),
    [StateId.Jumping]: new JumpingState(player),
    [StateId.Falling]: new FallingState(player),
    [StateId.Rolling]: new RollingState(player),
    [StateId.Dizzy] : new DizzyState(player),
    [StateId.GetHit] : new GetHitState(player),
    [StateId.Diving] : new DivingState(player),
    [StateId.Dead] : new DeadState(player),
  };
  return stateTable;
}

export function getState(stateId) {
  return stateTable[stateId];
}
