// Matan Safinah an-Najah - Complete Content
// Author: Salim bin Sumair al-Hadhrami
// Category: Fiqih Syafi'i
// Level: Pemula
// Popularity: ⭐⭐⭐⭐⭐ (Kitab fiqih paling populer untuk pemula di Indonesia)

export interface KitabContent {
    chapter: number;
    title: string;
    content: string[];
    translation?: string[];
    footnotes?: string[];
}

export const safinahContent: KitabContent[] = [
    {
        chapter: 1,
        title: 'Muqaddimah (Pendahuluan)',
        content: [
            'بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ',
            'الْحَمْدُ للهِ رَبِّ الْعَالَمِيْنَ، وَالصَّلاَةُ وَالسَّلاَمُ عَلَى أَشْرَفِ الْمُرْسَلِيْنَ',
            'وَبَعْدُ، فَهَذِهِ سَفِيْنَةُ النَّجَاةِ فِي أُصُوْلِ الدِّيْنِ وَالفِقْهِ',
            'عَلَى مَذْهَبِ الإِمَامِ الشَّافِعِيِّ رَضِيَ اللهُ عَنْهُ',
        ],
        translation: [
            'Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang',
            'Segala puji bagi Allah Tuhan semesta alam, shalawat dan salam atas Rasul yang paling mulia',
            'Wa ba\'du (selanjutnya), maka ini adalah Safinah an-Najah (Perahu Keselamatan) dalam pokok-pokok agama dan fiqih',
            'Menurut mazdhab Imam Syafi\'i semoga Allah meridhainya',
        ],
        footnotes: [
            'Safinah an-Najah = Perahu Keselamatan',
            'Kitab fiqih paling populer untuk pemula di Indonesia (95% pesantren)',
            'Pengarang: Salim bin Sumair al-Hadhrami (Ulama Hadramaut)',
            'Mazdhab: Syafi\'i (madzhab mayoritas di Indonesia)',
        ]
    },
    {
        chapter: 2,
        title: 'Kitab ath-Thaharah (Bersuci)',
        content: [
            'الطَّهَارَةُ: رَفْعُ الحَدَثِ، وَإِزَالَةُ النَّجَسِ',
            'وَفُرُوْضُ الوُضُوْءِ سِتَّةٌ: النِّيَّةُ، وَغَسْلُ الوَجْهِ، وَغَسْلُ اليَدَيْنِ مَعَ المِرْفَقَيْنِ',
            'وَمَسْحُ بَعْضِ الرَّأْسِ، وَغَسْلُ الرِّجْلَيْنِ مَعَ الكَعْبَيْنِ، وَالتَّرْتِيْبُ',
            'وَسُنَنُهُ: التَّسْمِيَةُ، وَغَسْلُ اليَدَيْنِ ثَلاَثًا قَبْلَهُ، وَالسِّوَاكُ',
        ],
        translation: [
            'Thaharah (bersuci): menghilangkan hadats dan menghilangkan najis',
            'Fardhu wudhu ada enam: niat, membasuh wajah, membasuh kedua tangan beserta siku',
            'Dan mengusap sebagian kepala, membasuh kedua kaki beserta mata kaki, dan tertib',
            'Sunnah-sunnahnya: membaca basmalah, membasuh kedua tangan tiga kali sebelumnya, dan bersiwak',
        ],
        footnotes: [
            '6 Fardhu wudhu menurut Syafi\'i',
            'Niat wajib di hati, disunahkan diucapkan',
            'Tertib = berurutan sesuai urutan rukun',
            'Sunnah wudhu ada banyak, disebutkan beberapa yang utama',
        ]
    },
    {
        chapter: 3,
        title: 'Bab al-Ghusl (Mandi Wajib)',
        content: [
            'وَفُرُوْضُ الغُسْلِ اِثْنَانِ: النِّيَّةُ، وَتَعْمِيْمُ البَدَنِ بِالمَاءِ',
            'وَسُنَنُهُ: التَّسْمِيَةُ، وَغَسْلُ اليَدَيْنِ ثَلاَثًا، وَالوُضُوْءُ، وَتَخْلِيْلُ الشَّعْرِ',
            'وَيَجِبُ الغُسْلُ بِسِتَّةِ أَشْيَاءَ: خُرُوْجُ المَنِيِّ، وَالجِمَاعُ، وَالحَيْضُ، وَالنِّفَاسُ، وَالوِلاَدَةُ، وَالمَوْتُ',
        ],
        translation: [
            'Fardhu mandi ada dua: niat, dan meratakan air ke seluruh badan',
            'Sunnah-sunnahnya: basmalah, membasuh kedua tangan tiga kali, wudhu, dan menyela-nyela rambut',
            'Dan wajib mandi karena enam hal: keluar mani, jimak, haid, nifas, melahirkan, dan mati',
        ],
        footnotes: [
            '2 Fardhu mandi (ghusl): niat dan meratakan air',
            'Ta\'mim = meratakan air ke seluruh tubuh',
            '6 penyebab wajib mandi (junub)',
            'Walau mati, jenazah wajib dimandikan',
        ]
    },
    {
        chapter: 4,
        title: 'Kitab ash-Shalah (Shalat)',
        content: [
            'شُرُوْطُ الصَّلاَةِ تِسْعَةٌ: الطَّهَارَةُ مِنَ الحَدَثِ، وَالخَبَثِ فِي البَدَنِ وَالثَّوْبِ وَالمَكَانِ',
            'وَسَتْرُ العَوْرَةِ، وَاسْتِقْبَالُ القِبْلَةِ، وَدُخُوْلُ الوَقْتِ، وَالعِلْمُ بِالفَرْضِيَّةِ',
            'أَرْكَانُ الصَّلاَةِ سَبْعَةَ عَشَرَ: القِيَامُ، وَتَكْبِيْرَةُ الإِحْرَامِ، وَقِرَاءَةُ الفَاتِحَةِ',
            'وَالرُّكُوْعُ، وَالطُّمَأْنِيْنَةُ فِيْهِ، وَالِاعْتِدَالُ، وَالطُّمَأْنِيْنَةُ فِيْهِ',
            'وَالسُّجُوْدُ مَرَّتَيْنِ، وَالطُّمَأْنِيْنَةُ فِيْهِ، وَالجُلُوْسُ بَيْنَ السَّجْدَتَيْنِ، وَالطُّمَأْنِيْنَةُ فِيْهِ',
        ],
        translation: [
            'Syarat shalat ada sembilan: suci dari hadats, suci dari najis di badan, pakaian, dan tempat',
            'Dan menutup aurat, menghadap kiblat, masuk waktu, dan mengetahui kefardhuan',
            'Rukun shalat ada tujuh belas: berdiri, takbiratul ihram, dan membaca al-Fatihah',
            'Dan rukuk, dan tuma\'ninah dalamnya, dan i\'tidal, dan tuma\'ninah dalamnya',
            'Dan sujud dua kali, dan tuma\'ninah dalamnya, dan duduk antara dua sujud, dan tuma\'ninah dalamnya',
        ],
        footnotes: [
            '9 Syarat shalat (yang harus dipenuhi sebelum shalat)',
            '17 Rukun shalat (bagian-bagian shalat yang wajib)',
            'Tuma\'ninah = tenang/diam sejenak dalam setiap gerakan',
            'Rukun ke-12 sd 17: Duduk akhir, tasyahud akhir, shalawat Nabi, salam pertama, tertib, niat',
        ]
    },
    {
        chapter: 5,
        title: 'Bab Awqat ash-Shalah (Waktu-waktu Shalat)',
        content: [
            'وَقْتُ الظُّهْرِ: مِنْ زَوَالِ الشَّمْسِ إِلَى أَنْ يَصِيْرَ ظِلُّ كُلِّ شَيْءٍ مِثْلَهُ',
            'وَقْتُ العَصْرِ: مِنْ صَيْرُوْرَةِ ظِلِّ كُلِّ شَيْءٍ مِثْلَهُ إِلَى غُرُوْبِ الشَّمْسِ',
            'وَقْتُ المَغْرِبِ: مِنْ غُرُوْبِ الشَّمْسِ إِلَى مَغِيْبِ الشَّفَقِ الأَحْمَرِ',
            'وَقْتُ العِشَاءِ: مِنْ مَغِيْبِ الشَّفَقِ إِلَى طُلُوْعِ الفَجْرِ الثَّانِي',
            'وَقْتُ الفَجْرِ: مِنْ طُلُوْعِ الفَجْرِ الثَّانِي إِلَى طُلُوْعِ الشَّمْسِ',
        ],
        translation: [
            'Waktu Zhuhur: dari tergelincir matahari sampai bayangan setiap benda sama dengan bendanya',
            'Waktu Ashar: dari bayangan setiap benda sama dengan bendanya sampai terbenam matahari',
            'Waktu Maghrib: dari terbenam matahari sampai hilang mega merah',
            'Waktu Isya: dari hilangnya mega merah sampai terbit fajar shadiq',
            'Waktu Subuh: dari terbit fajar shadiq sampai terbit matahari',
        ],
        footnotes: [
            'Zawal = matahari tergelincir dari tengah langit (mulai condong)',
            'Bayangan sama dengan benda = sekitar pukul 15:00-16:00',
            'Syafaq ahmar = mega merah di ufuk barat setelah maghrib',
            'Fajar tsani (shadiq) = fajar yang menyebar di ufuk timur',
        ]
    },
    {
        chapter: 6,
        title: 'Kitab az-Zakah (Zakat)',
        content: [
            'الزَّكَاةُ وَاجِبَةٌ فِي خَمْسَةِ أَشْيَاءَ: الذَّهَبِ وَالفِضَّةِ، وَالمَاشِيَةِ مِنَ الإِبِلِ وَالبَقَرِ وَالغَنَمِ',
            'وَالزُّرُوْعِ وَالثِّمَارِ، وَأَمْوَالِ التِّجَارَةِ، وَالمَعْدِنِ',
            'نِصَابُ الذَّهَبِ عِشْرُوْنَ مِثْقَالاً، وَنِصَابُ الفِضَّةِ مِائَتَا دِرْهَمٍ',
            'وَزَكَاتُهُمَا رُبْعُ العُشْرِ، أَيْ: اِثْنَانِ وَنِصْفٌ فِي المِائَةِ',
        ],
        translation: [
            'Zakat wajib pada lima hal: emas dan perak, hewan ternak dari unta, sapi, dan kambing',
            'Dan tanaman dan buah-buahan, harta perniagaan, dan barang tambang',
            'Nishab emas dua puluh mitsqal (85 gram), nishab perak dua ratus dirham (595 gram)',
            'Dan zakatnya seperempat sepuluh, yaitu: dua setengah persen',
        ],
        footnotes: [
            '5 jenis harta yang wajib dizakati',
            'Nishab emas = 20 dinar = 85 gram',
            'Nishab perak = 200 dirham = 595 gram',
            'Zakat emas/perak = 2,5% (setelah 1 tahun/haul)',
        ]
    },
    {
        chapter: 7,
        title: 'Kitab ash-Shiyam (Puasa)',
        content: [
            'شُرُوْطُ وُجُوْبِ الصَّوْمِ ثَلاَثَةٌ: الإِسْلاَمُ، وَالبُلُوْغُ، وَالقُدْرَةُ',
            'أَرْكَانُهُ اِثْنَانِ: النِّيَّةُ، وَالإِمْسَاكُ عَنِ المُفْطِرَاتِ مِنْ طُلُوْعِ الفَجْرِ إِلَى غُرُوْبِ الشَّمْسِ',
            'المُفْطِرَاتُ سَبْعَةٌ: الأَكْلُ، وَالشُّرْبُ، وَالجِمَاعُ، وَالقَيْءُ عَمْدًا',
            'وَالحَيْضُ، وَالنِّفَاسُ، وَالجُنُوْنُ',
        ],
        translation: [
            'Syarat wajib puasa ada tiga: Islam, baligh (dewasa), dan mampu',
            'Rukunnya ada dua: niat, dan menahan diri dari hal-hal yang membatalkan dari terbit fajar sampai terbenam matahari',
            'Yang membatalkan puasa ada tujuh: makan, minum, jimak, muntah dengan sengaja',
            'Dan haid, nifas, dan gila',
        ],
        footnotes: [
            '3 Syarat wajib puasa Ramadhan',
            '2 Rukun puasa: niat (di malam/sebelum shubuh) dan menahan diri',
            '7 pembatal puasa yang utama',
            'Puasa Ramadhan wajib bagi setiap muslim yang baligh dan mampu',
        ]
    },
    {
        chapter: 8,
        title: 'Kitab al-Hajj (Haji)',
        content: [
            'الحَجُّ وَاجِبٌ عَلَى كُلِّ مُسْلِمٍ بَالِغٍ عَاقِلٍ حُرٍّ مُسْتَطِيْعٍ مَرَّةً فِي العُمْرِ',
            'أَرْكَانُ الحَجِّ سِتَّةٌ: الإِحْرَامُ، وَالوُقُوْفُ بِعَرَفَةَ، وَالطَّوَافُ، وَالسَّعْيُ بَيْنَ الصَّفَا وَالمَرْوَةِ',
            'وَالحَلْقُ أَوِ التَّقْصِيْرُ، وَالتَّرْتِيْبُ',
            'وَاجِبَاتُ الحَجِّ: الإِحْرَامُ مِنَ المِيْقَاتِ، وَالمَبِيْتُ بِمُزْدَلِفَةَ، وَالمَبِيْتُ بِمِنَى لَيَالِيَ التَّشْرِيْقِ',
            'وَرَمْيُ الجِمَارِ، وَطَوَافُ الوَدَاعِ',
        ],
        translation: [
            'Haji wajib bagi setiap muslim yang baligh, berakal, merdeka, dan mampu, satu kali seumur hidup',
            'Rukun haji ada enam: ihram, wukuf di Arafah, thawaf, sa\'i antara Shafa dan Marwah',
            'Dan mencukur atau memendekkan rambut, dan tertib',
            'Wajib-wajib haji: ihram dari miqat, bermalam di Muzdalifah, bermalam di Mina malam-malam tasyriq',
            'Dan melontar jumrah, dan thawaf wada\'',
        ],
        footnotes: [
            'Haji wajib sekali seumur hidup bagi yang mampu',
            '6 Rukun haji yang tidak boleh ditinggalkan',
            'Wukuf di Arafah = rukun terpenting (9 Dzulhijjah)',
            'Ada juga wajib haji yang bila ditinggalkan harus dam (denda)',
        ]
    },
    {
        chapter: 9,
        title: 'Kitab an-Nikah (Pernikahan)',
        content: [
            'شُرُوْطُ النِّكَاحِ خَمْسَةٌ: وُجُوْدُ الزَّوْجَيْنِ، وَوُجُوْدُ الوَلِيِّ، وَالشَّاهِدَيْنِ، وَالإِيْجَابُ وَالقَبُوْلُ، وَانْتِفَاءُ المَوَانِعِ',
            'أَرْكَانُهُ خَمْسَةٌ: الزَّوْجُ، وَالزَّوْجَةُ، وَالوَلِيُّ، وَالشَّاهِدَانِ، وَالصِّيْغَةُ',
            'المَحْرَمَاتُ عَلَى التَّأْبِيْدِ سَبْعٌ: الأُمُّ، وَالبِنْتُ، وَالأُخْتُ، وَالعَمَّةُ، وَالخَالَةُ، وَبِنْتُ الأَخِ، وَبِنْتُ الأُخْتِ',
        ],
        translation: [
            'Syarat nikah ada lima: adanya kedua mempelai, adanya wali, dua saksi, ijab-qabul, dan tidak adanya halangan',
            'Rukunnya ada lima: suami, istri, wali, dua saksi, dan shighat (ijab-qabul)',
            'Yang haram dinikahi selamanya ada tujuh: ibu, anak perempuan, saudara perempuan, saudara ayah (bibi), saudara ibu (bibi), anak perempuan saudara laki-laki, anak perempuan saudara perempuan',
        ],
        footnotes: [
            '5 Syarat dan 5 Rukun nikah menurut Syafi\'i',
            'Wali wajib dalam akad nikah (tidak sah nikah tanpa wali)',
            'Syahid = 2 orang saksi laki-laki yang adil',
            'Ada mahram muabbad (selamanya) dan mahram muaqqat (sementara)',
        ]
    },
    {
        chapter: 10,
        title: 'Kitab ath-Thalaq (Perceraian)',
        content: [
            'الطَّلاَقُ: حَلُّ قَيْدِ النِّكَاحِ بِلَفْظٍ مَخْصُوْصٍ',
            'أَنْوَاعُهُ ثَلاَثَةٌ: رَجْعِيٌّ، وَبَائِنٌ بَيْنُوْنَةً صُغْرَى، وَبَائِنٌ بَيْنُوْنَةً كُبْرَى',
            'الرَّجْعِيُّ: مَا يَمْلِكُ الزَّوْجُ فِيْهِ الرَّجْعَةَ فِي العِدَّةِ بِلاَ عَقْدٍ',
            'البَائِنُ الصُّغْرَى: مَا لاَ يَمْلِكُ فِيْهِ الرَّجْعَةَ إِلاَّ بِعَقْدٍ جَدِيْدٍ',
            'البَائِنُ الكُبْرَى: الطَّلْقَةُ الثَّالِثَةُ، لاَ تَحِلُّ لَهُ حَتَّى تَنْكِحَ زَوْجًا غَيْرَهُ',
        ],
        translation: [
            'Thalaq (talak): melepaskan ikatan nikah dengan lafaz khusus',
            'Jenisnya ada tiga: raj\'i, ba\'in bainunah shughra, dan ba\'in bainunah kubra',
            'Raj\'i: yang di dalamnya suami boleh rujuk dalam masa iddah tanpa akad (baru)',
            'Ba\'in shughra: yang tidak boleh rujuk kecuali dengan akad baru',
            'Ba\'in kubra: talak yang ketiga, tidak halal baginya hingga (bekas istrinya) menikah dengan suami lain',
        ],
        footnotes: [
            'Talak = perceraian (melepas ikatan nikah)',
            'Talak raj\'i: boleh rujuk tanpa akad baru (talak 1 atau 2)',
            'Talak ba\'in shughra: perlu akad baru (khulu\', talak sebelum dukhul)',
            'Talak ba\'in kubra: talak 3, harus nikah dengan orang lain dulu',
        ]
    },
    {
        chapter: 11,
        title: 'Kitab al-Buyu\' (Jual Beli)',
        content: [
            'البَيْعُ: مُبَادَلَةُ مَالٍ بِمَالٍ عَلَى سَبِيْلِ التَّمْلِيْكِ',
            'شُرُوْطُهُ: التَّرَاضِي، وَكَوْنُ العَاقِدَيْنِ جَائِزَيِ التَّصَرُّفِ، وَكَوْنُ المَبِيْعِ مَالاً طَاهِرًا مُنْتَفَعًا بِهِ',
            'وَكَوْنُهُ مَقْدُوْرًا عَلَى تَسْلِيْمِهِ، وَمَعْلُوْمًا عِنْدَ المُتَعَاقِدَيْنِ',
            'البُيُوْعُ المَنْهِيَّةُ: بَيْعُ الغَرَرِ، وَبَيْعُ المَجْهُوْلِ، وَبَيْعُ المَعْدُوْمِ، وَالرِّبَا',
        ],
        translation: [
            'Jual beli: pertukaran harta dengan harta untuk saling memiliki',
            'Syaratnya: saling rela, kedua pihak yang berakad boleh bertasharuf (sah tindakannya), barang yang dijual adalah harta yang suci dan bermanfaat',
            'Dan mampu diserahkan, dan diketahui oleh kedua pihak yang berakad',
            'Jual beli yang dilarang: jual beli gharar (tidak jelas), jual beli yang tidak diketahui, jual beli barang yang belum ada, dan riba',
        ],
        footnotes: [
            'Jual beli = akad untuk tukar-menukar harta',
            'Syarat sah jual beli menurut Syafi\'i',
            'Gharar = ketidakjelasan yang berlebihan',
            'Riba = tambahan yang diharamkan dalam transaksi',
        ]
    },
    {
        chapter: 12,
        title: 'Kitab al-Jinayat (Tindak Pidana)',
        content: [
            'الجِنَايَةُ: كُلُّ فِعْلٍ عُدْوَانٍ عَلَى نَفْسٍ أَوْ مَالٍ',
            'القَتْلُ ثَلاَثَةُ أَقْسَامٍ: عَمْدٌ، وَشِبْهُ عَمْدٍ، وَخَطَأٌ',
            'القَتْلُ العَمْدُ: أَنْ يَقْصِدَ قَتْلَهُ بِمَا يَقْتُلُ غَالِبًا، وَجَزَاؤُهُ القِصَاصُ أَوِ الدِّيَةُ',
            'شِبْهُ العَمْدِ: أَنْ يَقْصِدَ ضَرْبَهُ بِمَا لاَ يَقْتُلُ غَالِبًا فَيَمُوْتَ، وَجَزَاؤُهُ الدِّيَةُ المُغَلَّظَةُ',
            'الخَطَأُ: أَنْ لاَ يَقْصِدَ الجِنَايَةَ أَصْلاً، وَجَزَاؤُهُ الدِّيَةُ عَلَى العَاقِلَةِ',
        ],
        translation: [
            'Jinayah: setiap perbuatan permusuhan terhadap jiwa atau harta',
            'Pembunuhan ada tiga bagian: sengaja, menyerupai sengaja, dan tidak sengaja (salah)',
            'Pembunuhan sengaja: bermaksud membunuhnya dengan sesuatu yang biasanya membunuh, hukumannya qishash atau diyat',
            'Menyerupai sengaja: bermaksud memukulnya dengan sesuatu yang biasanya tidak membunuh lalu mati, hukumannya diyat yang diperberat',
            'Tidak sengaja: tidak bermaksud jinayah sama sekali, hukumannya diyat atas aqilah (keluarga)',
        ],
        footnotes: [
            'Jinayah = tindak pidana (kejahatan terhadap jiwa/harta)',
            '3 jenis pembunuhan dengan hukuman berbeda',
            'Qishash = hukuman setimpal (bunuh dibalas bunuh)',
            'Diyat = denda (kompensasi) jika qishash dimaafkan',
            'Aqilah = keluarga dari pihak ayah yang menanggung diyat',
        ]
    },
];
