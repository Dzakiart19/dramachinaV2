import React from 'react';

const Privacy: React.FC = () => {
  return (
    <div className="container mx-auto px-4 md:px-16 py-20 bg-black min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-black text-white mb-8 uppercase tracking-tighter">Kebijakan Privasi</h1>
        <div className="prose prose-invert max-w-none text-zinc-400 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-tight">1. Pengumpulan Informasi</h2>
            <p>Kami menghormati privasi Anda. DZECK STREAM tidak mengumpulkan data pribadi sensitif. Kami hanya menyimpan preferensi penayangan dasar dan statistik anonim untuk meningkatkan pengalaman pengguna.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-tight">2. Keamanan</h2>
            <p>Semua transmisi data dienkripsi untuk memastikan keamanan saat Anda menjelajahi konten kami. Kami menggunakan infrastruktur cloud yang aman untuk meng-host layanan kami.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-tight">3. Hubungi Kami</h2>
            <p>Jika Anda memiliki pertanyaan tentang kebijakan privasi kami, silakan hubungi kami melalui Pusat Bantuan.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
