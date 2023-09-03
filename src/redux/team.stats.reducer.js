import axios from 'axios';
import {
  createAsyncThunk,
  createSlice,
  isFulfilled,
  isPending,
  isRejected,
} from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  entities: [],
};

const apiUrl = 'api/players/stats';

// Actions

export const getEntities = createAsyncThunk(
  'teamStats/fetch_entity_list',
  async ({ team, season }) => {
    const params = new URLSearchParams({
      team,
      season,
    });
    return await axios.get(`${apiUrl}?${params}`);
  }
);

export const TeamStatsSlice = createSlice({
  name: 'teamStats',
  initialState,
  extraReducers(builder) {
    builder
      .addMatcher(isFulfilled(getEntities), (state, action) => {
        const { data } = action.payload;
        return {
          ...state,
          loading: false,
          entities: data,
        };
      })
      .addMatcher(isRejected(getEntities), (state) => {
        state.loading = true;
      })

      .addMatcher(isPending(getEntities), (state) => {
        state.loading = true;
      });
  },
});

export default TeamStatsSlice.reducer;
