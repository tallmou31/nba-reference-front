import {
  RouterProvider,
  createRoutesFromElements,
  createBrowserRouter,
  Route,
  redirect,
} from 'react-router-dom';
import AppLayout from './components/AppLayout';
import HomePage from './pages/home';
import TeamPage from './pages/team';
import StatPage from './pages/stat';
import { Suspense, lazy, useEffect } from 'react';
import Loader from './Loader';
import { useDispatch } from 'react-redux';
import { getEntities } from './redux/team.reducer';
import axios from 'axios';
import PlayerStatPage from './pages/player.stat';
import TeamStatPage from './pages/team.stat';
const PlayerPage = lazy(() => import('./pages/player'));

const TIMEOUT = 1 * 60 * 1000;
axios.defaults.timeout = TIMEOUT;
axios.defaults.baseURL = 'https://nba-reference-api.onrender.com';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<AppLayout />}>
      <Route index element={<HomePage />} />
      <Route path='teams' element={<TeamPage />} />
      <Route path='stats' element={<StatPage />} />

      <Route
        path='players'
        element={
          <Suspense fallback={<Loader />}>
            <PlayerPage />
          </Suspense>
        }
      />
      <Route path='players/byName' element={<PlayerStatPage />} />
      <Route path='teams/byName' element={<TeamStatPage />} />

      <Route path='*' loader={() => redirect('/')} />
    </Route>
  )
);

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getEntities());
  }, [dispatch]);

  return (
    <Suspense fallback={<Loader />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default App;
