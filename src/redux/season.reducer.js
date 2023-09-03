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

const apiUrl = 'api/seasons';

// Actions

export const getEntities = createAsyncThunk('season/fetch', async () => {
  return await axios.get(apiUrl);
});

export const SeasonSlice = createSlice({
  name: 'season',
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

export default SeasonSlice.reducer;
