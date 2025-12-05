import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-6 py-8 sm:p-10">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Beranda
          </button>

          <h1 className="text-3xl font-bold text-gray-900 mb-8 border-b pb-4">Syarat & Ketentuan</h1>

          <div className="space-y-8 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Layanan Belajar Bahasa Arab</h2>
              <p>
                Selamat datang di <strong>Mahir Arab</strong>. Kami menyediakan platform pembelajaran Bahasa Arab berbasis teknologi
                yang mencakup materi digital, alat bantu analisis bahasa, dan fitur interaktif lainnya untuk membantu Anda menguasai Bahasa Arab.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Pendaftaran dan Akun</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Kewajiban Email yang Sama:</strong> Saat mendaftar dan melakukan pembayaran, Anda <strong>WAJIB</strong> menggunakan alamat email yang <strong>SAMA</strong>.
                  Hal ini diperlukan untuk memastikan proses aktivasi akun premium Anda berjalan secara otomatis dan lancar.
                </li>
                <li>
                  Anda bertanggung jawab penuh atas keamanan akun dan kata sandi Anda.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Pembayaran dan Refund</h2>
              <div className="bg-red-50 border-l-4 border-red-500 p-4">
                <p className="font-medium text-red-700">Kebijakan Tidak Ada Refund (No Refund)</p>
                <p className="mt-1 text-sm text-red-600">
                  Karena sifat produk kami yang merupakan produk digital dan akses layanan yang dapat langsung dinikmati setelah pembayaran,
                  kami <strong>TIDAK MENERIMA PERMINTAAN PENGEMBALIAN DANA (REFUND)</strong> dengan alasan apapun setelah akses diberikan.
                  Mohon pertimbangkan dengan matang sebelum melakukan pembelian.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Penggunaan Layanan</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Larangan Berbagi Akun:</strong> Satu akun hanya boleh digunakan oleh satu pengguna.
                  Dilarang keras membagikan, menyewakan, atau menjual kembali akses akun Anda kepada pihak lain.
                  Pelanggaran terhadap aturan ini dapat mengakibatkan pemblokiran akun permanen tanpa pengembalian dana.
                </li>
                <li>
                  Anda setuju untuk menggunakan layanan ini hanya untuk tujuan pembelajaran yang sah dan tidak melanggar hukum.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Perubahan Syarat</h2>
              <p>
                Kami berhak untuk mengubah syarat dan ketentuan ini sewaktu-waktu. Perubahan akan diberitahukan melalui situs web atau email.
                Penggunaan berkelanjutan atas layanan setelah perubahan tersebut dianggap sebagai persetujuan Anda terhadap syarat yang baru.
              </p>
            </section>

            <section className="pt-6 border-t mt-8">
              <p className="text-sm text-gray-500">
                Jika ada pertanyaan mengenai Syarat & Ketentuan ini, silakan hubungi kami di: <a href="mailto:admin@mahirarab.web.id" className="text-blue-600 hover:underline">admin@mahirarab.web.id</a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
