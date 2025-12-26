
import React from 'react';
import { HashRouter, Routes, Route, useParams } from 'react-router-dom';
import Layout from './components/Layout';
import Latest from './pages/Latest';
import VIP from './pages/VIP';
import Trending from './pages/Trending';
import IndoDub from './pages/IndoDub';
import Search from './pages/Search';
import ForYou from './pages/ForYou';
import PopularSearch from './pages/PopularSearch';
import Detail from './pages/Detail';
import Player from './pages/Player';
import AdminPanel from './pages/AdminPanel';

// Helper component to pass params to pages
const DetailPageWrapper = () => {
  const { id } = useParams<{ id: string }>();
  return id ? <Detail bookId={id} /> : null;
};

const PlayerPageWrapper = () => {
  const { bookId, episodeId } = useParams<{ bookId: string, episodeId: string }>();
  return bookId && episodeId ? <Player bookId={bookId} episodeId={episodeId} /> : null;
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Latest />} />
          <Route path="/vip" element={<VIP />} />
          <Route path="/trending" element={<Trending />} />
          <Route path="/dub" element={<IndoDub />} />
          <Route path="/search" element={<Search />} />
          <Route path="/foryou" element={<ForYou />} />
          <Route path="/popular" element={<PopularSearch />} />
          <Route path="/detail/:id" element={<DetailPageWrapper />} />
          <Route path="/player/:bookId/:episodeId" element={<PlayerPageWrapper />} />
          <Route path="/panel" element={<AdminPanel />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
