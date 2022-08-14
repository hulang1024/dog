import { BaseGetHitState } from './get-hit-state.js';
import { StateId } from './state.js';

export default class DizzyState extends BaseGetHitState {
  constructor(player) {
    super(StateId.Dizzy, player);
    this.animationName = 'dizzy';
  }
}