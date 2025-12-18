interface KitabContent {
    chapter: number;
    title: string;
    content: string[];
    translation?: string[];
    footnotes?: string[];
}

export const ajurrumiyahContent: KitabContent[] = [
    {
        chapter: 1,
        title: 'Muqaddimah (Pendahuluan)',
        content: [
            'الْكَلَامُ هُوَ اللَّفْظُ الْمُرَكَّبُ الْمُفِيدُ بِالْوَضْعِ',
            'وَأَقْسَامُهُ ثَلَاثَةٌ: اِسْمٌ، وَفِعْلٌ، وَحَرْفٌ جَاءَ لِمَعْنًى',
        ],
        translation: [
            'Kalam adalah lafaz (kata) yang tersusun dan berfaidah menurut kesepakatan (bahasa Arab)',
            'Dan pembagiannya ada tiga: Isim (kata benda), Fi\'il (kata kerja), dan Huruf yang datang untuk suatu makna',
        ],
        footnotes: [
            'Kalam: Kalimat sempurna yang memberikan faedah/makna lengkap',
            'Lafaz murakkab: tersusun dari minimal 2 kata',
            'Mufid bil-wadh\': memberikan faedah menurut kesepakatan bahasa Arab',
            'Tiga pembagian Kalimah: Isim, Fi\'il, Huruf',
        ]
    },
    {
        chapter: 2,
        title: 'Al-Kalam wa ma Yatarakkabu minhu (Kalam dan Komponennya)',
        content: [
            'فَالِاسْمُ يُعْرَفُ بِالْخَفْضِ، وَالتَّنْوِينِ، وَدُخُولِ الْأَلِفِ وَاللَّامِ',
            'وَحُرُوفِ الْخَفْضِ، وَهِيَ: مِنْ، وَإِلَى، وَعَنْ، وَعَلَى، وَفِي، وَرُبَّ، وَالْبَاءُ، وَالْكَافُ، وَاللَّامُ',
            'وَحُرُوفُ الْقَسَمِ، وَهِيَ: الْوَاوُ، وَالْبَاءُ، وَالتَّاءُ',
        ],
        translation: [
            'Adapun Isim dapat dikenali dengan Khafdh (Jar), Tanwin, dan masuknya Alif-Lam',
            'Dan huruf-huruf Khafdh (Jar) yaitu: Min, Ila, \'An, \'Ala, Fi, Rubba, Ba, Kaf, dan Lam',
            'Dan huruf-huruf Qasam (sumpah) yaitu: Waw, Ba, dan Ta',
        ],
        footnotes: [
            'Tanda-tanda Isim: bisa di-jar, bisa ditanwin, bisa ditambah alif-lam',
            'Huruf Jar: 10 huruf yang meng-jar isim setelahnya',
            'Min: untuk permulaan atau sebagian, Ila: untuk tujuan akhir',
            '\'An: untuk menjauh, \'Ala: untuk tempat di atas',
            'Fi: untuk tempat di dalam, Rubba: untuk sedikit',
            'Ba: untuk menempel/dengan, Kaf: untuk perumpamaan, Lam: untuk kepemilikan',
            'Huruf Qasam: Waw (demi), Ba (dengan), Ta (dengan)',
        ]
    },
    {
        chapter: 3,
        title: 'Al-I\'rab (Tanda I\'rab)',
        content: [
            'الْإِعْرَابُ هُوَ تَغْيِيرُ أَوَاخِرِ الْكَلِمِ، لِاخْتِلَافِ الْعَوَامِلِ الدَّاخِلَةِ عَلَيْهَا لَفْظًا أَوْ تَقْدِيرًا',
            'وَأَقْسَامُهُ أَرْبَعَةٌ: رَفْعٌ، وَنَصْبٌ، وَخَفْضٌ، وَجَزْمٌ',
            'فَلِلْأَسْمَاءِ مِنْ ذَلِكَ: الرَّفْعُ، وَالنَّصْبُ، وَالْخَفْضُ، وَلَا جَزْمَ فِيهَا',
            'وَلِلْأَفْعَالِ مِنْ ذَلِكَ: الرَّفْعُ، وَالنَّصْبُ، وَالْجَزْمُ، وَلَا خَفْضَ فِيهَا',
        ],
        translation: [
            'I\'rab adalah perubahan akhir kata, karena berbedanya \'amil yang masuk padanya, baik secara lafaz maupun takdir',
            'Dan pembagiannya ada empat: Rafa\', Nashab, Khafdh (Jar), dan Jazm',
            'Untuk Isim dari itu ada: Rafa\', Nashab, dan Khafdh, dan tidak ada Jazm di dalamnya',
            'Dan untuk Fi\'il dari itu ada: Rafa\', Nashab, dan Jazm, dan tidak ada Khafdh di dalamnya',
        ],
        footnotes: [
            'I\'rab: perubahan harakat akhir kata karena \'amil (kata yang mempengaruhi)',
            'Empat macam I\'rab: Rafa\' (dhammah), Nashab (fathah), Khafdh/Jar (kasrah), Jazm (sukun)',
            'Isim memiliki 3 i\'rab: Rafa\', Nashab, Jar (tidak ada Jazm)',
            'Fi\'il memiliki 3 i\'rab: Rafa\', Nashab, Jazm (tidak ada Jar)',
            'Lafzan: perubahan terlihat jelas, Taqdiran: perubahan tersembunyi',
        ]
    },
    {
        chapter: 4,
        title: 'Al-Af\'al (Kata Kerja)',
        content: [
            'وَالْأَفْعَالُ ثَلَاثَةٌ: مَاضٍ، وَمُضَارِعٌ، وَأَمْرٌ',
            'فَالْمَاضِي: مَا دَلَّ عَلَى زَمَانِ قَبْلَ زَمَانِكَ، نَحْوُ: ذَهَبَ',
            'وَالْمُضَارِعُ: مَا دَلَّ عَلَى زَمَانِكَ أَوْ بَعْدَهُ، نَحْوُ: يَذْهَبُ',
            'وَالْأَمْرُ: مَا دَلَّ عَلَى طَلَبِ فِعْلِ شَيْءٍ لَمْ يَكُنْ قَبْلَ زَمَانِكَ، نَحْوُ: اِذْهَبْ',
        ],
        translation: [
            'Dan Fi\'il ada tiga: Madhi (lampau), Mudhari\' (sekarang/akan datang), dan Amar (perintah)',
            'Adapun Madhi: yang menunjukkan waktu sebelum waktumu, seperti: Dzahaba (telah pergi)',
            'Dan Mudhari\': yang menunjukkan waktumu atau sesudahnya, seperti: Yadzhabu (sedang/akan pergi)',
            'Dan Amar: yang menunjukkan permintaan melakukan sesuatu yang belum terjadi sebelum waktumu, seperti: Idzhab (Pergilah)',
        ],
        footnotes: [
            'Tiga jenis Fi\'il berdasarkan waktu kejadian',
            'Fi\'il Madhi: menunjukkan waktu lampau/sudah terjadi',
            'Fi\'il Mudhari\': menunjukkan waktu sekarang atau akan datang',
            'Fi\'il Amar: perintah untuk melakukan sesuatu',
            'Contoh: Dzahaba (pergi-lampau), Yadzhabu (pergi-sekarang/akan), Idzhab (Pergilah!)',
        ]
    },
    {
        chapter: 5,
        title: 'Marfu\'atil Asma (Isim yang Marfu\')',
        content: [
            'الْمَرْفُوعَاتُ سَبْعَةٌ، وَهِيَ: الْفَاعِلُ، وَالْمَفْعُولُ الَّذِي لَمْ يُسَمَّ فَاعِلُهُ',
            'وَالْمُبْتَدَأُ وَخَبَرُهُ، وَاسْمُ كَانَ وَأَخَوَاتِهَا، وَخَبَرُ إِنَّ وَأَخَوَاتِهَا',
            'وَالتَّابِعُ لِلْمَرْفُوعِ، وَهُوَ أَرْبَعَةُ أَشْيَاءَ: النَّعْتُ، وَالْعَطْفُ، وَالتَّوْكِيدُ، وَالْبَدَلُ',
        ],
        translation: [
            'Yang marfu\' ada tujuh, yaitu: Fa\'il (pelaku), Maf\'ul yang tidak disebutkan pelakunya (Na\'ibul Fa\'il)',
            'Dan Mubtada beserta Khabarnya, Isim Kana dan saudara-saudaranya, dan Khabar Inna dan saudara-saudaranya',
            'Dan yang mengikuti yang marfu\', yaitu empat hal: Na\'t (sifat), \'Athaf (sambungan), Taukid (penguat), dan Badal (pengganti)',
        ],
        footnotes: [
            'Tujuh macam Isim yang selalu Marfu\' (dhammah)',
            '1. Fa\'il: pelaku perbuatan',
            '2. Na\'ibul Fa\'il: pengganti fa\'il dalam kalimat pasif',
            '3. Mubtada: kata pertama dalam kalimat ismiyyah',
            '4. Khabar: predikat dari mubtada',
            '5. Isim Kana: subjek dari kata kerja Kana dan saudaranya',
            '6. Khabar Inna: predikat dari huruf Inna dan saudaranya',
            '7. Tabi\' Marfu\': Na\'t, \'Athaf, Taukid, Badal yang mengikuti kata marfu\'',
        ]
    },
    {
        chapter: 6,
        title: 'Fa\'il (Pelaku)',
        content: [
            'الْفَاعِلُ هُوَ الِاسْمُ الْمَرْفُوعُ الْمَذْكُورُ قَبْلَهُ فِعْلُهُ',
            'وَهُوَ عَلَى قِسْمَيْنِ: ظَاهِرٌ، وَمُضْمَرٌ',
            'فَالظَّاهِرُ نَحْوُ قَوْلِكَ: قَامَ زَيْدٌ، وَيَقُومُ زَيْدٌ، وَقَامَ الزَّيْدَانِ، وَيَقُومُ الزَّيْدَانِ',
            'وَقَامَ الزَّيْدُونَ، وَيَقُومُ الزَّيْدُونَ، وَقَامَ الرِّجَالُ، وَيَقُومُ الرِّجَالُ',
        ],
        translation: [
            'Fa\'il adalah Isim Marfu\' yang disebutkan sebelumnya Fi\'ilnya',
            'Dan ia terbagi dua: Zhahir (jelas/tampak) dan Mudhmar (tersembunyi)',
            'Zhahir seperti ucapanmu: Qama Zaidun (Zaid telah berdiri), Yaqumu Zaidun (Zaid sedang berdiri)',
            'Qamal-Zaidani (dua Zaid telah berdiri), Yaqumulz-Zaidani (dua Zaid sedang berdiri)',
            'Qamalz-Zaiduna (para Zaid telah berdiri), Yaqumulz-Zaiduna (para Zaid sedang berdiri)',
            'Qamalr-Rijalu (para laki-laki telah berdiri), Yaqumulr-Rijalu (para laki-laki sedang berdiri)',
        ],
        footnotes: [
            'Fa\'il: pelaku perbuatan, selalu marfu\' (dhammah)',
            'Fa\'il disebutkan setelah fi\'il dalam kalimat fi\'liyyah',
            'Fa\'il Zhahir: tampak jelas (bukan kata ganti)',
            'Fa\'il Mudhmar: tersembunyi dalam fi\'il (kata ganti)',
            'Contoh: Qama Zaidun - Zaidun adalah fa\'il zhahir',
            'Fi\'il harus sesuai dengan fa\'il dalam jumlah (mufrad, mutsanna, jama\')',
        ]
    },
    {
        chapter: 7,
        title: 'Mubtada wal Khabar (Subjek dan Predikat)',
        content: [
            'الْمُبْتَدَأُ هُوَ الِاسْمُ الْمَرْفُوعُ الْعَارِي عَنِ الْعَوَامِلِ اللَّفْظِيَّةِ',
            'وَالْخَبَرُ هُوَ الِاسْمُ الْمَرْفُوعُ الْمُسْنَدُ إِلَيْهِ',
            'نَحْوُ قَوْلِكَ: زَيْدٌ قَائِمٌ، وَالزَّيْدَانِ قَائِمَانِ، وَالزَّيْدُونَ قَائِمُونَ',
        ],
        translation: [
            'Mubtada adalah Isim Marfu\' yang kosong dari \'awamil lafzhiyyah',
            'Dan Khabar adalah Isim Marfu\' yang disandarkan kepadanya',
            'Seperti ucapanmu: Zaidun Qa\'imun (Zaid sedang berdiri), Az-Zaidani Qa\'imani (dua Zaid sedang berdiri)',
            'Az-Zaiduna Qa\'imuna (para Zaid sedang berdiri)',
        ],
        footnotes: [
            'Mubtada: subjek, kata pertama dalam kalimat ismiyyah',
            'Khabar: predikat yang memberi keterangan tentang mubtada',
            'Mubtada dan Khabar keduanya marfu\'',
            '\'Awamil lafzhiyyah: kata-kata yang mempengaruhi i\'rab seperti fi\'il, huruf jar, dll',
            'Mubtada "kosong" artinya tidak didahului oleh \'amil',
            'Contoh: Zaidun Qa\'imun - Zaidun (mubtada), Qa\'imun (khabar)',
        ]
    },
    {
        chapter: 8,
        title: 'Nawasikh (Kata yang Mengubah)',
        content: [
            'وَالنَّوَاسِخُ الدَّاخِلَةُ عَلَى الْمُبْتَدَإِ وَالْخَبَرِ ثَلَاثَةُ أَشْيَاءَ: كَانَ وَأَخَوَاتُهَا',
            'وَإِنَّ وَأَخَوَاتُهَا، وَظَنَنْتُ وَأَخَوَاتُهَا',
            'فَأَمَّا كَانَ وَأَخَوَاتُهَا، فَإِنَّهَا تَرْفَعُ الِاسْمَ وَتَنْصِبُ الْخَبَرَ',
            'وَهِيَ: كَانَ، وَأَمْسَى، وَأَصْبَحَ، وَأَضْحَى، وَظَلَّ، وَبَاتَ، وَصَارَ، وَلَيْسَ، وَمَا زَالَ، وَمَا انْفَكَّ، وَمَا فَتِئَ، وَمَا بَرِحَ، وَمَا دَامَ',
        ],
        translation: [
            'Dan Nawasikh yang masuk pada Mubtada dan Khabar ada tiga hal: Kana dan saudaranya',
            'Dan Inna dan saudaranya, dan Zhanantu dan saudaranya',
            'Adapun Kana dan saudaranya, maka ia meninggikan (marfu\') Isim dan merendahkan (nashab) Khabar',
            'Yaitu: Kana, Amsa, Ashbaha, Adhha, Zhalla, Bata, Shara, Laisa, Ma Zala, Manfakka, Ma Fati\'a, Ma Bariha, Ma Dama',
        ],
        footnotes: [
            'Nawasikh: kata yang mengubah i\'rab mubtada-khabar',
            'Tiga jenis Nawasikh: Kana wa akhwatuha, Inna wa akhwatuha, Zhanna wa akhwatuha',
            'Kana wa akhwatuha: men-rafa\' isim, men-nashab khabar',
            'Ada 13 fi\'il yang termasuk Kana wa akhwatuha',
            'Kana: adalah/menjadi, Amsa: menjadi di sore, Ashbaha: menjadi di pagi',
            'Laisa: bukan, Ma Zala: masih terus, Shara: menjadi',
        ]
    },
    {
        chapter: 9,
        title: 'Man Mansub (Yang Mansub)',
        content: [
            'الْمَنْصُوبَاتُ خَمْسَةَ عَشَرَ، وَهِيَ: الْمَفْعُولُ بِهِ، وَالْمَصْدَرُ، وَظَرْفُ الزَّمَانِ',
            'وَظَرْفُ الْمَكَانِ، وَالْحَالُ، وَالتَّمْيِيزُ، وَالْمُسْتَثْنَى، وَاسْمُ لَا',
            'وَالْمُنَادَى، وَالْمَفْعُولُ مِنْ أَجْلِهِ، وَالْمَفْعُولُ مَعَهُ',
            'وَخَبَرُ كَانَ وَأَخَوَاتِهَا، وَاسْمُ إِنَّ وَأَخَوَاتِهَا، وَالتَّابِعُ لِلْمَنْصُوبِ',
        ],
        translation: [
            'Yang mansub ada lima belas, yaitu: Maf\'ul Bih, Mashdar, Zharf Zaman (keterangan waktu)',
            'Dan Zharf Makan (keterangan tempat), Hal, Tamyiz, Mustatsna (yang dikecualikan), Isim La',
            'Dan Munada (yang dipanggil), Maf\'ul Min Ajlihi, Maf\'ul Ma\'ahu',
            'Dan Khabar Kana wa akhwatuha, Isim Inna wa akhwatuha, dan Tabi\' yang mengikuti yang mansub',
        ],
        footnotes: [
            'Lima belas macam Isim yang mansub (fathah)',
            '1. Maf\'ul Bih: objek dari perbuatan',
            '2. Maf\'ul Muthlaq (Mashdar): penguat fi\'il',
            '3. Zharf Zaman: keterangan waktu',
            '4. Zharf Makan: keterangan tempat',
            '5. Hal: keterangan keadaan',
            '6. Tamyiz: penjelas',
            '7. Mustatsna: yang dikecualikan dengan illa',
            'Dan masih ada 8 lagi yang disebutkan',
        ]
    },
    {
        chapter: 10,
        title: 'Maf\'ul (Objek)',
        content: [
            'الْمَفْعُولُ بِهِ وَهُوَ الِاسْمُ الْمَنْصُوبُ الَّذِي وَقَعَ عَلَيْهِ فِعْلُ الْفَاعِلِ',
            'نَحْوُ قَوْلِكَ: ضَرَبْتُ زَيْدًا، وَرَكِبْتُ الْفَرَسَ',
            'وَهُوَ عَلَى قِسْمَيْنِ: ظَاهِرٌ وَمُضْمَرٌ',
            'فَالظَّاهِرُ مَا تَقَدَّمَ ذِكْرُهُ، وَالْمُضْمَرُ اثْنَا عَشَرَ، نَحْوُ: ضَرَبَنِي وَضَرَبَنَا',
        ],
        translation: [
            'Maf\'ul Bih yaitu Isim Mansub yang terkena perbuatan Fa\'il',
            'Seperti ucapanmu: Dharabtu Zaidan (aku memukul Zaid), Rakibtul-Farasa (aku mengendarai kuda)',
            'Dan ia terbagi dua: Zhahir (tampak) dan Mudhmar (tersembunyi)',
            'Zhahir telah disebutkan sebelumnya, dan Mudhmar ada dua belas, seperti: Dharabani (dia memukulku) dan Dharabana (dia memukul kami)',
        ],
        footnotes: [
            'Maf\'ul Bih: objek yang dikenai perbuatan, selalu mansub',
            'Maf\'ul Bih menerima akibat dari perbuatan fa\'il',
            'Contoh: Dharabtu Zaidan - Zaidan adalah maf\'ul bih',
            'Maf\'ul bih zhahir: tampak jelas (bukan kata ganti)',
            'Maf\'ul bih mudhmar: kata ganti yang menjadi objek',
            'Ada 12 dhamir yang bisa menjadi maf\'ul bih',
        ]
    },
    {
        chapter: 11,
        title: 'Makhfudhat (Yang Majrur)',
        content: [
            'الْمَخْفُوضَاتُ ثَلَاثَةٌ: مَخْفُوضٌ بِالْحَرْفِ، وَمَخْفُوضٌ بِالْإِضَافَةِ، وَتَابِعٌ لِلْمَخْفُوضِ',
            'فَأَمَّا الْمَخْفُوضُ بِالْحَرْفِ فَهُوَ: مَا خُفِضَ بِمِنْ، وَإِلَى، وَعَنْ، وَعَلَى',
            'وَفِي، وَرُبَّ، وَالْبَاءِ، وَالْكَافِ، وَاللَّامِ، وَحُرُوفِ الْقَسَمِ وَهِيَ: الْوَاوُ، وَالْبَاءُ، وَالتَّاءُ',
        ],
        translation: [
            'Yang makhfudh ada tiga: Makhfudh dengan Huruf, Makhfudh dengan Idhafah, dan Tabi\' yang mengikuti yang makhfudh',
            'Adapun Makhfudh dengan Huruf yaitu: yang di-khafdh dengan Min, Ila, \'An, \'Ala',
            'Dan Fi, Rubba, Ba, Kaf, Lam, dan huruf-huruf Qasam yaitu: Waw, Ba, dan Ta',
        ],
        footnotes: [
            'Makhfudh (Majrur): i\'rab jar dengan kasrah',
            'Tiga cara men-jar isim: dengan huruf jar, idhafah, atau tabi\'',
            'Huruf Jar ada 10: Min, Ila, \'An, \'Ala, Fi, Rubba, Ba, Kaf, Lam, Mundzu/Mudzu',
            'Huruf Qasam: Waw, Ba, Ta (untuk sumpah)',
            'Idhafah: penyandaran isim kepada isim, contoh: Kitabu Zaididin',
            'Tabi\': na\'t, \'athaf, taukid, badal yang mengikuti majrur',
        ]
    },
    {
        chapter: 12,
        title: 'Tawabi\' (Kata Pengikut)',
        content: [
            'التَّوَابِعُ أَرْبَعَةٌ: النَّعْتُ، وَالْعَطْفُ، وَالتَّوْكِيدُ، وَالْبَدَلُ',
            'فَالنَّعْتُ: تَابِعٌ لِلْمَنْعُوتِ فِي رَفْعِهِ وَنَصْبِهِ وَخَفْضِهِ وَتَعْرِيفِهِ وَتَنْكِيرِهِ',
            'وَالْعَطْفُ: هُوَ التَّابِعُ الْمُتَوَسِّطُ بَيْنَهُ وَبَيْنَ مَتْبُوعِهِ أَحَدُ حُرُوفِ الْعَطْفِ',
            'وَحُرُوفُ الْعَطْفِ عَشَرَةٌ، وَهِيَ: الْوَاوُ، وَالْفَاءُ، وَثُمَّ، وَأَوْ، وَأَمْ، وَلَا، وَبَلْ، وَلَكِنْ، وَحَتَّى، وَإِمَّا',
        ],
        translation: [
            'Tawabi\' ada empat: Na\'t (sifat), \'Athaf (sambungan), Taukid (penguat), dan Badal (pengganti)',
            'Na\'t: mengikuti yang disifati dalam rafa\', nashab, khafdh, ma\'rifah dan nakirahnya',
            '\'Athaf: yang mengikuti yang di-tengahi dengannya dan dengan yang diikutinya salah satu huruf \'athaf',
            'Dan huruf \'athaf ada sepuluh, yaitu: Waw, Fa, Tsumma, Au, Am, La, Bal, Lakin, Hatta, dan Imma',
        ],
        footnotes: [
            'Tawabi\': kata yang mengikuti i\'rab kata sebelumnya',
            'Na\'t (Sifat): mengikuti man\'ut dalam semua i\'rab',
            'Contoh: Ja\'a rajulun karimun - karimun mengikuti rajulun (marfu\')',
            '\'Athaf: penyambungan dengan huruf \'athaf',
            'Huruf \'Athaf: Waw (dan), Fa (lalu), Tsumma (kemudian), Au (atau)',
            'Taukid: penguat dengan lafaz yang sama atau semakna',
            'Badal: pengganti, ada 4 jenis: badal kull, badal ba\'dh, badal isytimal, badal ghalath',
        ]
    }
];
