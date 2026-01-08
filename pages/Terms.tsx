import React from 'react';

const Terms: React.FC = () => {
  return (
    <div className="container mx-auto px-4 md:px-16 py-20 bg-black min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-black text-white mb-8 uppercase tracking-tighter">Syarat Penggunaan</h1>
        <div className="prose prose-invert max-w-none text-zinc-400 space-y-8">
          <p className="text-xl text-zinc-300 font-medium">Selamat datang di DZECK STREAM. Dengan mengakses layanan kami, Anda menyetujui ketentuan berikut:</p>
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-tight">1. Penggunaan Layanan</h2>
            <p>DZECK STREAM menyediakan akses ke konten drama untuk penggunaan pribadi dan non-komersial. Anda dilarang mendistribusikan ulang atau menyalin konten tanpa izin.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-tight">2. Ketersediaan Konten</h2>
            <p>Ketersediaan drama dapat berubah sewaktu-waktu tergantung pada hak distribusi dan kebijakan platform.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-tight">3. Batasan Tanggung Jawab</h2>
            <p>Kami berusaha memberikan layanan terbaik, namun kami tidak bertanggung jawab atas gangguan layanan yang disebabkan oleh faktor di luar kendali kami.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;
