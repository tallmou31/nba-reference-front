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

const apiUrl = 'api/players';

// Actions

export const getEntities = createAsyncThunk(
  'player/fetch_entity_list',
  async (filter) => {
    const params = new URLSearchParams({
      filter,
    });
    return axios.get(`${apiUrl}?${params}`);
  }
);

export const PlayerSlice = createSlice({
  name: 'player',
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

export default PlayerSlice.reducer;
