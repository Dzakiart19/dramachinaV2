
import React, { Suspense, lazy, useEffect, useState } from 'react';
import { HashRouter, Routes, Route, useParams } from 'react-router-dom';
import Layout from './components/Layout';
import { PageLoading } from './components/Skeleton';

// Lazy load pages
const Latest = lazy(() => import('./pages/Latest'));
const VIP = lazy(() => import('./pages/VIP'));
const Trending = lazy(() => import('./pages/Trending'));
const IndoDub = lazy(() => import('./pages/IndoDub'));
const Search = lazy(() => import('./pages/Search'));
const ForYou = lazy(() => import('./pages/ForYou'));
const PopularSearch = lazy(() => import('./pages/PopularSearch'));
const Detail = lazy(() => import('./pages/Detail'));
const Player = lazy(() => import('./pages/Player'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));

const DetailPageWrapper = () => {
  const { id } = useParams<{ id: string }>();
  return id ? <Detail bookId={id} /> : null;
};

const PlayerPageWrapper = () => {
  const { bookId, episodeId } = useParams<{ bookId: string, episodeId: string }>();
  return bookId && episodeId ? <Player bookId={bookId} episodeId={episodeId} /> : null;
};

const AppContent = () => {
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsInitialLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (isInitialLoading) return <PageLoading />;

  return (
    <Layout>
      <Suspense fallback={<PageLoading />}>
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
      </Suspense>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
};

export default App;
