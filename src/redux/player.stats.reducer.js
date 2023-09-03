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

const apiUrl = 'api/players/byName';

// Actions

export const getEntities = createAsyncThunk(
  'playerStats/fetch_entity_list',
  async (name) => {
    const params = new URLSearchParams({
      name,
    });
    return await axios.get(`${apiUrl}?${params}`);
  }
);

export const PlayerStatsSlice = createSlice({
  name: 'playerStats',
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

export default PlayerStatsSlice.reducer;
