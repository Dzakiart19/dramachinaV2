
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
  return (
    <Layout>
      <Suspense fallback={
        <div className="container mx-auto px-4 md:px-16 py-20 bg-black min-h-screen animate-pulse">
          <div className="mb-20 space-y-4">
            <div className="h-1 w-12 bg-zinc-900 rounded-full" />
            <div className="h-16 w-1/2 bg-zinc-900 rounded-md" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-6 gap-y-12">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="aspect-[2/3] w-full bg-zinc-900 rounded-xl" />
                <div className="h-4 w-3/4 bg-zinc-900 rounded" />
              </div>
            ))}
          </div>
        </div>
      }>
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
