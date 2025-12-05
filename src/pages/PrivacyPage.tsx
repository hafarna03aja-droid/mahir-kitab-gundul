import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
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

                    <h1 className="text-3xl font-bold text-gray-900 mb-8 border-b pb-4">Kebijakan Privasi</h1>

                    <div className="space-y-8 text-gray-700 leading-relaxed">
                        <section>
                            <p>
                                Di <strong>Mahir Arab</strong>, privasi Anda adalah prioritas kami. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan,
                                menggunakan, dan melindungi informasi pribadi Anda saat menggunakan layanan kami.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Informasi yang Kami Kumpulkan</h2>
                            <p className="mb-2">Kami hanya mengumpulkan informasi pribadi yang sangat terbatas dan diperlukan untuk operasional layanan, yaitu:</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><strong>Nama Lengkap:</strong> Untuk identifikasi pengguna.</li>
                                <li><strong>Alamat Email:</strong> Untuk keperluan login, verifikasi akun, dan komunikasi terkait layanan.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Penggunaan Informasi</h2>
                            <p>Data yang kami kumpulkan digunakan semata-mata untuk:</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Memverifikasi identitas Anda saat mendaftar dan login.</li>
                                <li>Memproses aktivasi layanan setelah pembayaran dikonfirmasi.</li>
                                <li>Mengirimkan informasi penting terkait akun atau pembaruan layanan.</li>
                            </ul>
                            <p className="mt-2">Kami <strong>TIDAK</strong> menjual, menyewakan, atau membagikan data pribadi Anda kepada pihak ketiga untuk tujuan pemasaran.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Keamanan Pembayaran</h2>
                            <div className="bg-green-50 border-l-4 border-green-500 p-4">
                                <p className="font-medium text-green-700">Pemrosesan Pihak Ketiga</p>
                                <p className="mt-1 text-sm text-green-600">
                                    Kami tidak menyimpan informasi kartu kredit atau data perbankan sensitif Anda di server kami.
                                    Semua transaksi pembayaran diproses melalui gateway pembayaran pihak ketiga yang terpercaya dan aman (seperti <strong>Midtrans</strong> atau <strong>Mayar</strong>).
                                    Data pembayaran Anda dienkripsi dan diproses sesuai dengan standar keamanan industri yang ketat.
                                </p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Keamanan Data</h2>
                            <p>
                                Kami menerapkan langkah-langkah keamanan teknis dan organisasional yang sesuai untuk melindungi data pribadi Anda dari akses,
                                pengungkapan, perubahan, atau pemusnahan yang tidak sah.
                            </p>
                        </section>

                        <section className="pt-6 border-t mt-8">
                            <p className="text-sm text-gray-500">
                                Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini, silakan hubungi kami di: <a href="mailto:admin@mahirarab.web.id" className="text-blue-600 hover:underline">admin@mahirarab.web.id</a>
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};
