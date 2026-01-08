import React from 'react';

const HelpCenter: React.FC = () => {
  return (
    <div className="container mx-auto px-4 md:px-16 py-20 bg-black min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-black text-white mb-8 uppercase tracking-tighter">Pusat Bantuan</h1>
        <div className="space-y-12">
          <section className="bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800">
            <h2 className="text-xl font-bold text-red-600 mb-4 uppercase tracking-widest">Pertanyaan Umum</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-white font-bold mb-2">Bagaimana cara menonton drama?</h3>
                <p className="text-zinc-400">Pilih drama yang ingin Anda tonton dari beranda, klik tombol 'Play Now' atau pilih episode yang tersedia di bagian bawah halaman detail.</p>
              </div>
              <div>
                <h3 className="text-white font-bold mb-2">Video tidak bisa diputar?</h3>
                <p className="text-zinc-400">Pastikan koneksi internet Anda stabil. Jika masih bermasalah, coba gunakan tombol 'Retry' atau muat ulang halaman. Sistem kami memiliki fitur auto-retry dan multi-server untuk memastikan pemutaran tetap lancar.</p>
              </div>
            </div>
          </section>
          
          <section className="bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800">
            <h2 className="text-xl font-bold text-red-600 mb-4 uppercase tracking-widest">Hubungi Kami</h2>
            <p className="text-zinc-400 mb-6">Jika Anda memiliki masalah teknis atau pertanyaan lain, hubungi tim dukungan kami melalui email.</p>
            <div className="bg-black/50 p-4 rounded-lg border border-red-600/20 inline-block">
              <span className="text-white font-mono">support@dzeckstream.com</span>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
