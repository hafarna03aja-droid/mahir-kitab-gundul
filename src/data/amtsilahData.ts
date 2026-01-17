// Matan Al-Amtsilah at-Tashrifiyyah - Complete Content
// Author: Muhammad Ma'sum bin Ali
// Category: Sharaf (Morfologi Arab)
// Level: Pemula-Menengah
// Popularity: ⭐⭐⭐⭐⭐ (Standar di hampir semua pesantren Indonesia)

export interface KitabContent {
    chapter: number;
    title: string;
    content: string[];
    translation?: string[];
    footnotes?: string[];
}

export const amtsilahContent: KitabContent[] = [
    {
        chapter: 1,
        title: 'Muqaddimah (Pendahuluan)',
        content: [
            'بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ',
            'الْحَمْدُ للهِ رَبِّ الْعَالَمِيْنَ، وَالصَّلاَةُ وَالسَّلاَمُ عَلَى سَيِّدِنَا مُحَمَّدٍ وَعَلَى آلِهِ وَصَحْبِهِ أَجْمَعِيْنَ',
            'وَبَعْدُ، فَهَذِهِ أَمْثِلَةٌ فِي التَّصْرِيْفِ، جَمَعْتُهَا لِتَسْهِيْلِ الطُّلاَّبِ',
            'اَلتَّصْرِيْفُ: تَحْوِيْلُ الأَصْلِ الوَاحِدِ إِلَى أَمْثِلَةٍ مُخْتَلِفَةٍ',
        ],
        translation: [
            'Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang',
            'Segala puji bagi Allah Tuhan semesta alam, shalawat dan salam atas junjungan kami Muhammad dan keluarga serta sahabatnya semua',
            'Wa ba\'du (selanjutnya), maka ini adalah contoh-contoh dalam tashrif, aku kumpulkan untuk memudahkan para pelajar',
            'Tashrif: mengubah satu asal kata ke contoh-contoh yang berbeda',
        ],
        footnotes: [
            'Al-Amtsilah at-Tashrifiyyah adalah kitab sharaf PALING POPULER di Indonesia',
            'Digunakan di hampir 95% pesantren sebagai kitab standar',
            'Pengarang: Muhammad Ma\'sum bin Ali',
            'Kitab ini berisi contoh-contoh praktis tashrif',
        ]
    },
    {
        chapter: 2,
        title: 'Tashrif Lughawi 1 - Tsulasi Mujarrad',
        content: [
            'مِثَالُ الفِعْلِ الثُّلاَثِيِّ المُجَرَّدِ: ضَرَبَ - نَصَرَ - فَتَحَ',
            'الفِعْلُ المَاضِي: ضَرَبَ (فَعَلَ)',
            'الفِعْلُ المُضَارِعُ: يَضْرِبُ (يَفْعِلُ)',
            'فِعْلُ الأَمْرِ: اِضْرِبْ (اِفْعِلْ)',
            'المَصْدَرُ: ضَرْبٌ (فَعْلٌ)',
            'اِسْمُ الفَاعِلِ: ضَارِبٌ (فَاعِلٌ)',
            'اِسْمُ المَفْعُوْلِ: مَضْرُوْبٌ (مَفْعُوْلٌ)',
            'ظَرْفُ المَكَانِ: مَضْرِبٌ (مَفْعِلٌ)',
            'ظَرْفُ الزَّمَانِ: مَضْرِبٌ (مَفْعِلٌ)',
        ],
        translation: [
            'Contoh fi\'il tsulasi mujarrad: dharaba - nashara - fataha',
            'Fi\'il Madhi: dharaba (fa\'ala) - telah memukul',
            'Fi\'il Mudhari\': yadhribu (yaf\'ilu) - sedang/akan memukul',
            'Fi\'il Amar: idhrib (if\'il) - pukullah!',
            'Mashdar: dharbun (fa\'lun) - pukulan',
            'Isim Fa\'il: dhāribun (fā\'ilun) - yang memukul/pemukul',
            'Isim Maf\'ul: madhrūbun (maf\'ūlun) - yang dipukul',
            'Zharf Makan: madhribun (maf\'ilun) - tempat memukul',
            'Zharf Zaman: madhribun (maf\'ilun) - waktu memukul',
        ],
        footnotes: [
            'Tashrif lughawi dari dharaba (memukul)',
            'Ini adalah pola dasar yang harus dihafal',
            'Dari 1 kata dasar bisa jadi 8-9 bentuk berbeda',
            'Setiap bentuk punya fungsi dan makna tersendiri',
        ]
    },
    {
        chapter: 3,
        title: 'Tashrif Lughawi 2 - Bab af\'ala (أَفْعَلَ)',
        content: [
            'مِثَالُ بَابِ أَفْعَلَ: أَكْرَمَ',
            'الفِعْلُ المَاضِي: أَكْرَمَ (أَفْعَلَ)',
            'الفِعْلُ المُضَارِعُ: يُكْرِمُ (يُفْعِلُ)',
            'فِعْلُ الأَمْرِ: أَكْرِمْ (أَفْعِلْ)',
            'المَصْدَرُ: إِكْرَامٌ (إِفْعَالٌ)',
            'اِسْمُ الفَاعِلِ: مُكْرِمٌ (مُفْعِلٌ)',
            'اِسْمُ المَفْعُوْلِ: مُكْرَمٌ (مُفْعَلٌ)',
        ],
        translation: [
            'Contoh bab af\'ala: akrama (memuliakan)',
            'Fi\'il Madhi: akrama (af\'ala) - telah memuliakan',
            'Fi\'il Mudhari\': yukrimu (yuf\'ilu) - sedang/akan memuliakan',
            'Fi\'il Amar: akrim (af\'il) - muliakanlah!',
            'Mashdar: ikrāmun (if\'ālun) - pemuliaan',
            'Isim Fa\'il: mukrimun (muf\'ilun) - yang memuliakan',
            'Isim Maf\'ul: mukramun (muf\'alun) - yang dimuliakan',
        ],
        footnotes: [
            'Bab af\'ala: menambah hamzah di awal',
            'Makna: ta\'diyah (membuat muta\'addi), masharah (menjadikan)',
            'Contoh lain: a\'lama (memberitahu), a\'thā (memberikan)',
        ]
    },
    {
        chapter: 4,
        title: 'Tashrif Lughawi 3 - Bab fa\'\'ala (فَعَّلَ)',
        content: [
            'مِثَالُ بَابِ فَعَّلَ: عَلَّمَ',
            'الفِعْلُ المَاضِي: عَلَّمَ (فَعَّلَ)',
            'الفِعْلُ المُضَارِعُ: يُعَلِّمُ (يُفَعِّلُ)',
            'فِعْلُ الأَمْرِ: عَلِّمْ (فَعِّلْ)',
            'المَصْدَرُ: تَعْلِيمٌ (تَفْعِيلٌ)',
            'اِسْمُ الفَاعِلِ: مُعَلِّمٌ (مُفَعِّلٌ)',
            'اِسْمُ المَفْعُوْلِ: مُعَلَّمٌ (مُفَعَّلٌ)',
        ],
        translation: [
            'Contoh bab fa\'\'ala: \'allama (mengajar)',
            'Fi\'il Madhi: \'allama (fa\'\'ala) - telah mengajar',
            'Fi\'il Mudhari\': yu\'allimu (yufa\'\'ilu) - sedang/akan mengajar',
            'Fi\'il Amar: \'allim (fa\'\'il) - ajarlah!',
            'Mashdar: ta\'līmun (taf\'īlun) - pengajaran',
            'Isim Fa\'il: mu\'allimun (mufa\'\'ilun) - yang mengajar/guru',
            'Isim Maf\'ul: mu\'allamun (mufa\'\'alun) - yang diajarkan/murid',
        ],
        footnotes: [
            'Bab fa\'\'ala: tasydid (menggandakan) huruf tengah',
            'Makna: taksir/ta\'diyah (membuat banyak/intensif)',
            'Contoh: darasa → darrasa (mengajarkan), kasara → kassara (menghancurkan berkeping)',
        ]
    },
    {
        chapter: 5,
        title: 'Tashrif Lughawi 4 - Bab fā\'ala (فَاعَلَ)',
        content: [
            'مِثَالُ بَابِ فَاعَلَ: قَاتَلَ',
            'الفِعْلُ المَاضِي: قَاتَلَ (فَاعَلَ)',
            'الفِعْلُ المُضَارِعُ: يُقَاتِلُ (يُفَاعِلُ)',
            'فِعْلُ الأَمْرِ: قَاتِلْ (فَاعِلْ)',
            'المَصْدَرُ: قِتَالٌ أَوْ مُقَاتَلَةٌ (فِعَالٌ أَوْ مُفَاعَلَةٌ)',
            'اِسْمُ الفَاعِلِ: مُقَاتِلٌ (مُفَاعِلٌ)',
            'اِسْمُ المَفْعُوْلِ: مُقَاتَلٌ (مُفَاعَلٌ)',
        ],
        translation: [
            'Contoh bab fā\'ala: qātala (memerangi)',
            'Fi\'il Madhi: qātala (fā\'ala) - telah memerangi',
            'Fi\'il Mudhari\': yuqātilu (yufā\'ilu) - sedang/akan memerangi',
            'Fi\'il Amar: qātil (fā\'il) - perangilah!',
            'Mashdar: qitālun atau muqātalatun (fi\'ālun/mufā\'alatun) - peperangan',
            'Isim Fa\'il: muqātilun (mufā\'ilun) - yang memerangi/pejuang',
            'Isim Maf\'ul: muqātalun (mufā\'alun) - yang diperangi',
        ],
        footnotes: [
            'Bab fā\'ala: menambah alif setelah fa\'',
            'Makna: musyārakah (bersama-sama), atau makna ta\'diyah',
            'Contoh: kātaba (saling menulis), shāraha (berterus terang)',
        ]
    },
    {
        chapter: 6,
        title: 'Tashrif Lughawi 5 - Bab tafa\'\'ala (تَفَعَّلَ)',
        content: [
            'مِثَالُ بَابِ تَفَعَّلَ: تَعَلَّمَ',
            'الفِعْلُ المَاضِي: تَعَلَّمَ (تَفَعَّلَ)',
            'الفِعْلُ المُضَارِعُ: يَتَعَلَّمُ (يَتَفَعَّلُ)',
            'فِعْلُ الأَمْرِ: تَعَلَّمْ (تَفَعَّلْ)',
            'المَصْدَرُ: تَعَلُّمٌ (تَفَعُّلٌ)',
            'اِسْمُ الفَاعِلِ: مُتَعَلِّمٌ (مُتَفَعِّلٌ)',
            'اِسْمُ المَفْعُوْلِ: مُتَعَلَّمٌ (مُتَفَعَّلٌ)',
        ],
        translation: [
            'Contoh bab tafa\'\'ala: ta\'allama (belajar)',
            'Fi\'il Madhi: ta\'allama (tafa\'\'ala) - telah belajar',
            'Fi\'il Mudhari\': yata\'allamu (yatafa\'\'alu) - sedang/akan belajar',
            'Fi\'il Amar: ta\'allam (tafa\'\'al) - belajarlah!',
            'Mashdar: ta\'allumun (tafa\'\'ulun) - pembelajaran',
            'Isim Fa\'il: muta\'allimun (mutafa\'\'ilun) - yang belajar/pelajar',
            'Isim Maf\'ul: muta\'allamun (mutafa\'\'alun) - yang dipelajari',
        ],
        footnotes: [
            'Bab tafa\'\'ala: ta\' di awal + tasydid tengah',
            'Makna: mutāwa\'ah (menerima pekerjaan), takaluf (berpura-pura)',
            'Contoh: ta\'allama (belajar), takallama (berbicara)',
        ]
    },
    {
        chapter: 7,
        title: 'Tashrif Lughawi 6 - Bab tafā\'ala (تَفَاعَلَ)',
        content: [
            'مِثَالُ بَابِ تَفَاعَلَ: تَقَاتَلَ',
            'الفِعْلُ المَاضِي: تَقَاتَلَ (تَفَاعَلَ)',
            'الفِعْلُ المُضَارِعُ: يَتَقَاتَلُ (يَتَفَاعَلُ)',
            'فِعْلُ الأَمْرِ: تَقَاتَلْ (تَفَاعَلْ)',
            'المَصْدَرُ: تَقَاتُلٌ (تَفَاعُلٌ)',
            'اِسْمُ الفَاعِلِ: مُتَقَاتِلٌ (مُتَفَاعِلٌ)',
            'اِسْمُ المَفْعُوْلِ: مُتَقَاتَلٌ (مُتَفَاعَلٌ)',
        ],
        translation: [
            'Contoh bab tafā\'ala: taqātala (saling berperang)',
            'Fi\'il Madhi: taqātala (tafā\'ala) - telah saling berperang',
            'Fi\'il Mudhari\': yataqātalu (yatafā\'alu) - sedang/akan saling berperang',
            'Fi\'il Amar: taqātal (tafā\'al) - berperanglah!',
            'Mashdar: taqātulun (tafā\'ulun) - saling berperang',
            'Isim Fa\'il: mutaqātilun (mutafā\'ilun) - yang saling berperang',
            'Isim Maf\'ul: mutaqātalun (mutafā\'alun) - yang saling diperangi',
        ],
        footnotes: [
            'Bab tafā\'ala: ta\' di awal + alif setelah fa\'',
            'Makna: musyārakah (saling), tazhāhur (pura-pura)',
            'Contoh: tajāhala (pura-pura bodoh), tasābaha (saling memukul)',
        ]
    },
    {
        chapter: 8,
        title: 'Tashrif Lughawi 7 - Bab infa\'ala (اِنْفَعَلَ)',
        content: [
            'مِثَالُ بَابِ اِنْفَعَلَ: اِنْكَسَرَ',
            'الفِعْلُ المَاضِي: اِنْكَسَرَ (اِنْفَعَلَ)',
            'الفِعْلُ المُضَارِعُ: يَنْكَسِرُ (يَنْفَعِلُ)',
            'فِعْلُ الأَمْرِ: اِنْكَسِرْ (اِنْفَعِلْ)',
            'المَصْدَرُ: اِنْكِسَارٌ (اِنْفِعَالٌ)',
            'اِسْمُ الفَاعِلِ: مُنْكَسِرٌ (مُنْفَعِلٌ)',
            'اِسْمُ المَفْعُوْلِ: مُنْكَسَرٌ (مُنْفَعَلٌ)',
        ],
        translation: [
            'Contoh bab infa\'ala: inkasara (patah/pecah)',
            'Fi\'il Madhi: inkasara (infa\'ala) - telah patah',
            'Fi\'il Mudhari\': yankasiru (yanfa\'ilu) - sedang/akan patah',
            'Fi\'il Amar: inkasir (infa\'il) - patahlah!',
            'Mashdar: inkisārun (infi\'ālun) - kepatahan',
            'Isim Fa\'il: munkasi run (munfa\'ilun) - yang patah',
            'Isim Maf\'ul: munkasarun (munfa\'alun) - yang dipatahkan',
        ],
        footnotes: [
            'Bab infa\'ala: nun sākinah + fa\'ala',
            'Makna: muthāwa\'ah (pasif dari fa\'\'ala)',
            'Contoh: inhazama (kalah), inqalaba (terbalik)',
        ]
    },
    {
        chapter: 9,
        title: 'Tashrif Lughawi 8 - Bab ifta\'ala (اِفْتَعَلَ)',
        content: [
            'مِثَالُ بَابِ اِفْتَعَلَ: اِجْتَمَعَ',
            'الفِعْلُ المَاضِي: اِجْتَمَعَ (اِفْتَعَلَ)',
            'الفِعْلُ المُضَارِعُ: يَجْتَمِعُ (يَفْتَعِلُ)',
            'فِعْلُ الأَمْرِ: اِجْتَمِعْ (اِفْتَعِلْ)',
            'المَصْدَرُ: اِجْتِمَاعٌ (اِفْتِعَالٌ)',
            'اِسْمُ الفَاعِلِ: مُجْتَمِعٌ (مُفْتَعِلٌ)',
            'اِسْمُ المَفْعُوْلِ: مُجْتَمَعٌ (مُفْتَعَلٌ)',
        ],
        translation: [
            'Contoh bab ifta\'ala: ijtama\'a (berkumpul)',
            'Fi\'il Madhi: ijtama\'a (ifta\'ala) - telah berkumpul',
            'Fi\'il Mudhari\': yajtami\'u (yafta\'ilu) - sedang/akan berkumpul',
            'Fi\'il Amar: ijtami\' (ifta\'il) - berkumpullah!',
            'Mashdar: ijtimā\'un (ifti\'ālun) - perkumpulan',
            'Isim Fa\'il: mujtami\'un (mufta\'ilun) - yang berkumpul',
            'Isim Maf\'ul: mujtama\'un (mufta\'alun) - tempat berkumpul',
        ],
        footnotes: [
            'Bab ifta\'ala: hamzah + ta\' + fa\'ala',
            'Makna: mutāwa\'ah, ittihādz (mengambil untuk diri sendiri)',
            'Contoh: ihtaraka (terbakar), iktasaba (berusaha mencari)',
        ]
    },
    {
        chapter: 10,
        title: 'Tashrif Lughawi 9 - Bab if\'alla (اِفْعَلَّ)',
        content: [
            'مِثَالُ بَابِ اِفْعَلَّ: اِحْمَرَّ',
            'الفِعْلُ المَاضِي: اِحْمَرَّ (اِفْعَلَّ)',
            'الفِعْلُ المُضَارِعُ: يَحْمَرُّ (يَفْعَلُّ)',
            'فِعْلُ الأَمْرِ: اِحْمَرَّ (اِفْعَلَّ)',
            'المَصْدَرُ: اِحْمِرَارٌ (اِفْعِلاَلٌ)',
            'اِسْمُ الفَاعِلِ: مُحْمَرٌّ (مُفْعَلٌّ)',
            'لاَ اِسْمَ مَفْعُوْلٍ مِنْهُ',
        ],
        translation: [
            'Contoh bab if\'alla: ihmarra (menjadi merah)',
            'Fi\'il Madhi: ihmarra (if\'alla) - telah menjadi merah',
            'Fi\'il Mudhari\': yahmarru (yaf\'allu) - sedang/akan menjadi merah',
            'Fi\'il Amar: ihmarra (if\'alla) - menjadi merahlah!',
            'Mashdar: ihmirārun (if\'ilālun) - menjadi merah',
            'Isim Fa\'il: muhmarrun (muf\'allun) - yang merah',
            'Tidak ada isim maf\'ul darinya',
        ],
        footnotes: [
            'Bab if\'alla: untuk warna dan cacat',
            'Makna: mushā\'afah (menjadi/berubah menjadi)',
            'Contoh: ishfarra (menguning), ikhdharra (menghijau)',
            'Lazim (intransitif), tidak ada isim maf\'ul',
        ]
    },
    {
        chapter: 11,
        title: 'Tashrif Lughawi 10 - Bab istaf\'ala (اِسْتَفْعَلَ)',
        content: [
            'مِثَالُ بَابِ اِسْتَفْعَلَ: اِسْتَغْفَرَ',
            'الفِعْلُ المَاضِي: اِسْتَغْفَرَ (اِسْتَفْعَلَ)',
            'الفِعْلُ المُضَارِعُ: يَسْتَغْفِرُ (يَسْتَفْعِلُ)',
            'فِعْلُ الأَمْرِ: اِسْتَغْفِرْ (اِسْتَفْعِلْ)',
            'المَصْدَرُ: اِسْتِغْفَارٌ (اِسْتِفْعَالٌ)',
            'اِسْمُ الفَاعِلِ: مُسْتَغْفِرٌ (مُسْتَفْعِلٌ)',
            'اِسْمُ المَفْعُوْلِ: مُسْتَغْفَرٌ (مُسْتَفْعَلٌ)',
        ],
        translation: [
            'Contoh bab istaf\'ala: istaghfara (meminta ampun)',
            'Fi\'il Madhi: istaghfara (istaf\'ala) - telah meminta ampun',
            'Fi\'il Mudhari\': yastaghfiru (yastaf\'ilu) - sedang/akan meminta ampun',
            'Fi\'il Amar: istaghfir (istaf\'il) - mintalah ampun!',
            'Mashdar: istighfārun (istif\'ālun) - permohonan ampun',
            'Isim Fa\'il: mustaghfirun (mustaf\'ilun) - yang meminta ampun',
            'Isim Maf\'ul: mustaghfarun (mustaf\'alun) - yang dimintai ampun',
        ],
        footnotes: [
            'Bab istaf\'ala: sin + ta\' + fa\'ala',
            'Makna: thalab (meminta), tahawwul (berubah menjadi)',
            'Contoh: ista\'māla (menggunakan), istakbara (sombong)',
            'Bab paling produktif dan banyak digunakan',
        ]
    },
    {
        chapter: 12,
        title: 'Tashrif Ishtilahi (Konjugasi dengan Dhamir)',
        content: [
            'التَّصْرِيْفُ الاصْطِلاَحِيُّ هُوَ: تَحْوِيْلُ الكَلِمَةِ بِحَسَبِ الضَّمَائِرِ',
            'مِثَالُ الفِعْلِ المَاضِي مَعَ الضَّمَائِرِ:',
            'ضَرَبَ (هُوَ)، ضَرَبَا (هُمَا)، ضَرَبُوْا (هُمْ)',
            'ضَرَبَتْ (هِيَ)، ضَرَبَتَا (هُمَا)، ضَرَبْنَ (هُنَّ)',
            'ضَرَبْتَ (أَنْتَ)، ضَرَبْتُمَا (أَنْتُمَا)، ضَرَبْتُمْ (أَنْتُمْ)',
            'ضَرَبْتِ (أَنْتِ)، ضَرَبْتُمَا (أَنْتُمَا)، ضَرَبْتُنَّ (أَنْتُنَّ)',
            'ضَرَبْتُ (أَنَا)، ضَرَبْنَا (نَحْنُ)',
        ],
        translation: [
            'Tashrif ishtilahi adalah: mengubah kata sesuai dhamir-dhamir',
            'Contoh fi\'il madhi dengan dhamir:',
            'dharaba (dia lk), dharabā (mereka berdua lk), dharabū (mereka lk)',
            'dharabat (dia pr), dharabatā (mereka berdua pr), dharabna (mereka pr)',
            'dharabta (kamu lk), dharabtumā (kalian berdua lk), dharabtum (kalian lk)',
            'dharabti (kamu pr), dharabtumā (kalian berdua pr), dharabtunna (kalian pr)',
            'dharabtu (aku), dharabnā (kami/kita)',
        ],
        footnotes: [
            'Tashrif ishtilahi = konjugasi dengan 14 dhamir',
            'Dhamir ghaib (dia): huwa, huma, hum, hiya, huma, hunna',
            'Dhamir mukhāthab (kamu): anta, antuma, antum, anti, antuma, antunna',
            'Dhamir mutakallim (aku): ana, nahnu',
            'Wajib dihafal untuk membaca kitab kuning',
        ]
    },
];
