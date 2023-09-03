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

const apiUrl = 'api/players/ranks';

// Actions

export const getEntities = createAsyncThunk(
  'rank/fetch_entity_list',
  async (data) => {
    const params = new URLSearchParams({
      size: data.size,
      team: data.team || '',
      season: data.season || '',
    });
    return axios.get(`${apiUrl}/${data.unit}?${params}`);
  }
);

export const RankSlice = createSlice({
  name: 'rank',
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

export default RankSlice.reducer;
