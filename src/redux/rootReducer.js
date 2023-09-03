import { combineReducers } from '@reduxjs/toolkit';
import team from './team.reducer';
import season from './season.reducer';

import rank from './rank.reducer';
import player from './player.reducer';
import home from './home.reducer';
import playerStats from './player.stats.reducer';
import teamStats from './team.stats.reducer';

const rootReducer = combineReducers({
  team,
  rank,
  player,
  home,
  playerStats,
  teamStats,
  season,
});

export default rootReducer;
