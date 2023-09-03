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
  bestPts: undefined,
  bestAst: undefined,
  bestReb: undefined,
};

const apiUrl = 'api/players/ranks';

// Actions

export const getEntities = createAsyncThunk('home/fetch', async () => {
  const params = new URLSearchParams({
    size: 1,
  });
  return await Promise.all([
    axios.get(`${apiUrl}/pts?${params}`),
    axios.get(`${apiUrl}/ast?${params}`),
    axios.get(`${apiUrl}/reb?${params}`),
  ]);
});

export const HomeSlice = createSlice({
  name: 'home',
  initialState,
  extraReducers(builder) {
    builder
      .addMatcher(isFulfilled(getEntities), (state, action) => {
        const respPts = action.payload[0]?.data;
        const respAst = action.payload[1]?.data;
        const respReb = action.payload[2]?.data;

        return {
          ...state,
          loading: false,
          bestPts: respPts?.length > 0 ? respPts[0] : undefined,
          bestAst: respAst?.length > 0 ? respAst[0] : undefined,
          bestReb: respReb?.length > 0 ? respReb[0] : undefined,
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

export default HomeSlice.reducer;
