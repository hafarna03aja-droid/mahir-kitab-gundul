// Hidayatus Shibyan - Complete Content
// Author: Sa'id bin Sa'd Nabhan
// Category: Nahwu (Tata Bahasa Arab)
// Level: Pemula
// Popularity: ⭐⭐⭐⭐⭐ (Sangat populer di Indonesia - Arab-Melayu)

export interface KitabContent {
    chapter: number;
    title: string;
    content: string[];
    translation?: string[];
    footnotes?: string[];
}

export const hidayatushibyanContent: KitabContent[] = [
    {
        chapter: 1,
        title: 'Muqaddimah (Pendahuluan)',
        content: [
            'بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ',
            'الحَمْدُ لِلهِ رَبِّ العَالَمِيْنَ، وَالصَّلاَةُ وَالسَّلاَمُ عَلَى أَشْرَفِ الأَنْبِيَاءِ وَالمُرْسَلِيْنَ',
            'وَبَعْدُ، فَهَذَا كِتَابٌ مُخْتَصَرٌ فِي النَّحْوِ، سَمَّيْتُهُ: هِدَايَةُ الصِّبْيَانِ',
            'لِتَسْهِيْلِ الطُّلاَّبِ الْمُبْتَدِئِيْنَ فِي تَعَلُّمِ اللُّغَةِ العَرَبِيَّةِ',
        ],
        translation: [
            'Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang',
            'Segala puji bagi Allah Tuhan semesta alam, shalawat dan salam atas Nabi dan Rasul yang paling mulia',
            'Wa ba\'du (selanjutnya), maka ini adalah kitab ringkas dalam nahwu, aku namakan: Hidayatus Shibyan',
            'Untuk memudahkan para pelajar pemula dalam mempelajari bahasa Arab',
        ],
        footnotes: [
            'Hidayatus Shibyan = Petunjuk bagi anak-anak/pemula',
            'Kitab nahwu lokal Indonesia, sangat populer di pesantren tradisional',
            'Menggunakan bahasa pengantar Melayu/Jawa Pegon',
            'Pengarang: Sa\'id bin Sa\'d Nabhan',
        ]
    },
    {
        chapter: 2,
        title: 'Bab al-Kalam (Kalam)',
        content: [
            'الكَلاَمُ عِنْدَ النُّحَاةِ: لَفْظٌ مُرَكَّبٌ مُفِيْدٌ بِالوَضْعِ',
            'وَالكَلِمَةُ: لَفْظٌ مَوْضُوعٌ لِمَعْنًى مُفْرَدٍ',
            'وَأَقْسَامُهَا ثَلاَثَةٌ: اِسْمٌ، وَفِعْلٌ، وَحَرْفٌ',
            'الاِسْمُ: كُلُّ لَفْظٍ يُسَمَّى بِهِ شَيْءٌ، كَزَيْدٍ وَرَجُلٍ وَفَرَسٍ',
        ],
        translation: [
            'Kalam menurut ahli nahwu: lafaz yang tersusun, bermanfaat, menurut bahasa Arab',
            'Kalimah: lafaz yang ditetapkan untuk makna yang tunggal',
            'Pembagiannya ada tiga: isim, fi\'il, dan huruf',
            'Isim: setiap lafaz yang dinamakan sesuatu dengannya, seperti Zaid, lelaki, dan kuda',
        ],
        footnotes: [
            'Kalam = kalimat sempurna (minimal 2 kata)',
            'Kalimah = kata tunggal',
            'Contoh isim: zaid (nama orang), rajul (lelaki), faras (kuda)',
        ]
    },
    {
        chapter: 3,
        title: 'Alamat al-Ism (Tanda-tanda Isim)',
        content: [
            'عَلاَمَةُ الاِسْمِ خَمْسَةٌ: الخَفْضُ، وَالتَّنْوِيْنُ، وَدُخُوْلُ الأَلِفِ وَاللاَّمِ',
            'وَالإِسْنَادُ إِلَيْهِ، وَالنِّدَاءُ',
            'مِثَالُ الخَفْضِ: مَرَرْتُ بِزَيْدٍ، مِثَالُ التَّنْوِيْنِ: جَاءَ رَجُلٌ',
            'مِثَالُ أَلْ: جَاءَ الرَّجُلُ، مِثَالُ الإِسْنَادِ: زَيْدٌ قَائِمٌ',
            'مِثَالُ النِّدَاءِ: يَا زَيْدُ',
        ],
        translation: [
            'Tanda isim ada lima: khafdh (kasrah), tanwin, masuknya alif-lam',
            'Dan isnad (menjadi subjek), dan nida\' (panggilan)',
            'Contoh khafdh: marartu bi-zaidin (aku lewat pada Zaid), contoh tanwin: jaa\'a rajulun (datang seorang lelaki)',
            'Contoh al: jaa\'ar-rajulu (datang lelaki itu), contoh isnad: zaidun qa\'imun (Zaid berdiri)',
            'Contoh nida\': ya zaidu (wahai Zaid)',
        ],
        footnotes: [
            '5 tanda isim untuk membedakan dari fi\'il dan huruf',
            'Kalau kata bisa menerima salah satu tanda ini = isim',
            'Isnad: menjadi mubtada\' atau fa\'il',
        ]
    },
    {
        chapter: 4,
        title: 'Alamat al-Fi\'l (Tanda-tanda Fi\'il)',
        content: [
            'عَلاَمَةُ الفِعْلِ ثَلاَثَةٌ:',
            'قَدْ، نَحْوُ: قَدْ قَامَ زَيْدٌ، وَقَدْ يَقُوْمُ زَيْدٌ',
            'السِّيْنُ وَسَوْفَ، نَحْوُ: سَيَقُوْمُ زَيْدٌ، وَسَوْفَ يَقُوْمُ زَيْدٌ',
            'تَاءُ التَّأْنِيْثِ السَّاكِنَةُ، نَحْوُ: قَامَتْ هِنْدٌ',
        ],
        translation: [
            'Tanda fi\'il ada tiga:',
            'Qad, seperti: qad qama zaidun (sungguh Zaid telah berdiri), qad yaqumu zaidun (boleh jadi Zaid berdiri)',
            'Sin dan saufa, seperti: sayaqumu zaidun (Zaid akan berdiri), saufa yaqumu zaidun (nanti Zaid akan berdiri)',
            'Ta\' ta\'nits sakinah, seperti: qamat hindun (Hindun telah berdiri)',
        ],
        footnotes: [
            '3 tanda fi\'il: qad, sin/saufa, ta\' ta\'nits',
            'Qad + madhi = tahqiq (pasti), qad + mudhari\' = taqlil (jarang)',
            'Sin/saufa = untuk mudhari\' (akan datang)',
        ]
    },
    {
        chapter: 5,
        title: 'Bab al-I\'rab (I\'rab)',
        content: [
            'الإِعْرَابُ: تَغْيِيْرُ أَوَاخِرِ الكَلِمِ لِاخْتِلاَفِ العَوَامِلِ',
            'وَأَقْسَامُهُ أَرْبَعَةٌ: رَفْعٌ، وَنَصْبٌ، وَجَرٌّ، وَجَزْمٌ',
            'فَلِلاِسْمِ: الرَّفْعُ، وَالنَّصْبُ، وَالجَرُّ',
            'وَلِلْفِعْلِ: الرَّفْعُ، وَالنَّصْبُ، وَالجَزْمُ',
            'وَالحَرْفُ لاَ إِعْرَابَ لَهُ',
        ],
        translation: [
            'I\'rab: perubahan akhir kata karena berbedanya \'amil',
            'Pembagiannya ada empat: rafa\', nashab, jar, dan jazm',
            'Untuk isim: rafa\', nashab, dan jar',
            'Untuk fi\'il: rafa\', nashab, dan jazm',
            'Huruf tidak ada i\'rabnya',
        ],
        footnotes: [
            'I\'rab = perubahan harakat akhir kata',
            'Isim tidak bisa jazm, fi\'il tidak bisa jar',
            'Huruf mabni (tidak berubah)',
        ]
    },
    {
        chapter: 6,
        title: 'Alamat al-I\'rab (Tanda-tanda I\'rab)',
        content: [
            'عَلاَمَةُ الرَّفْعِ أَرْبَعَةٌ: الضَّمَّةُ، وَالوَاوُ، وَالأَلِفُ، وَالنُّوْنُ',
            'عَلاَمَةُ النَّصْبِ خَمْسَةٌ: الفَتْحَةُ، وَالأَلِفُ، وَالكَسْرَةُ، وَاليَاءُ، وَحَذْفُ النُّوْنِ',
            'عَلاَمَةُ الجَرِّ ثَلاَثَةٌ: الكَسْرَةُ، وَاليَاءُ، وَالفَتْحَةُ',
            'عَلاَمَةُ الجَزْمِ ثَلاَثَةٌ: السُّكُوْنُ، وَحَذْفُ النُّوْنِ، وَحَذْفُ حَرْفِ العِلَّةِ',
        ],
        translation: [
            'Tanda rafa\' ada empat: dhammah, waw, alif, dan nun tetap',
            'Tanda nashab ada lima: fathah, alif, kasrah, ya\', dan hadhf nun',
            'Tanda jar ada tiga: kasrah, ya\', dan fathah',
            'Tanda jazm ada tiga: sukun, hadhf nun, dan hadhf huruf \'illat',
        ],
        footnotes: [
            'Dhammah: tanda asli rafa\'',
            'Waw: untuk jam\' mudzakkar salim dan asma\' khamsah',
            'Alif: untuk mutsanna (rafa\') dan asma\' khamsah (nashab)',
        ]
    },
    {
        chapter: 7,
        title: 'Al-Mu\'rab wal Mabni',
        content: [
            'المُعْرَبُ: مَا تَغَيَّرَ آخِرُهُ بِاخْتِلاَفِ العَوَامِلِ',
            'المَبْنِيُّ: مَا لَزِمَ آخِرُهُ حَالَةً وَاحِدَةً',
            'المَبْنِيُّ مِنَ الأَسْمَاءِ: الضَّمَائِرُ، وَأَسْمَاءُ الإِشَارَةِ، وَالأَسْمَاءُ المَوْصُوْلَةُ',
            'وَأَسْمَاءُ الاِسْتِفْهَامِ، وَأَسْمَاءُ الشَّرْطِ، وَبَعْضُ الظُّرُوْفِ',
        ],
        translation: [
            'Mu\'rab: yang berubah akhirnya karena berbedanya \'amil',
            'Mabni: yang akhirnya tetap pada satu keadaan',
            'Mabni dari isim-isim: dhamir, isim isyarah, isim maushul',
            'Dan isim istifham, isim syarat, dan sebagian zhuruf',
        ],
        footnotes: [
            'Mu\'rab = bisa berubah i\'rabnya (rafa\', nashab, jar)',
            'Mabni = tetap, tidak berubah',
            'Contoh mabni: huwa, hadza, alladzi, man, mata, aina',
        ]
    },
    {
        chapter: 8,
        title: 'Al-Fa\'il (Pelaku)',
        content: [
            'الفَاعِلُ: اِسْمٌ مَرْفُوْعٌ تَقَدَّمَهُ فِعْلٌ وَدَلَّ عَلَى مَنْ فَعَلَ الفِعْلَ',
            'وَهُوَ قِسْمَانِ: ظَاهِرٌ وَمُضْمَرٌ',
            'مِثَالُ الظَّاهِرِ: قَامَ زَيْدٌ، جَاءَتْ فَاطِمَةُ',
            'مِثَالُ المُضْمَرِ: قُمْتُ، قُمْنَا، قُمْتَ، قَامَ (هُوَ)',
        ],
        translation: [
            'Fa\'il: isim marfu\' yang didahului fi\'il dan menunjukkan siapa yang melakukan pekerjaan',
            'Dan ia terbagi dua: zhahir (tampak) dan mudhmar (tersembunyi)',
            'Contoh zhahir: qama zaidun (Zaid berdiri), jaa\'at fathimatu (Fatimah datang)',
            'Contoh mudhmar: qumtu (aku berdiri), qumna (kami berdiri), qumta (kamu berdiri), qama huwa (dia berdiri)',
        ],
        footnotes: [
            'Fa\'il selalu marfu\' (dhammah atau penggantinya)',
            'Zhahir: isim yang tampak jelas',
            'Mudhmar: dhamir tersembunyi dalam fi\'il',
        ]
    },
    {
        chapter: 9,
        title: 'Al-Maf\'ul bih (Objek)',
        content: [
            'المَفْعُوْلُ بِهِ: اِسْمٌ مَنْصُوْبٌ وَقَعَ عَلَيْهِ فِعْلُ الفَاعِلِ',
            'وَهُوَ قِسْمَانِ: ظَاهِرٌ وَمُضْمَرٌ',
            'مِثَالُ الظَّاهِرِ: ضَرَبْتُ زَيْدًا، أَكَلْتُ الطَّعَامَ',
            'مِثَالُ المُضْمَرِ: ضَرَبَنِي زَيْدٌ، أَكَلَهُ عَلِيٌّ',
        ],
        translation: [
            'Maf\'ul bih: isim manshub yang terkena perbuatan fa\'il',
            'Dan ia terbagi dua: zhahir (tampak) dan mudhmar (tersembunyi)',
            'Contoh zhahir: dharabtu zaidan (aku memukul Zaid), akaltu ath-tha\'ama (aku makan makanan)',
            'Contoh mudhmar: dharabani zaidun (Zaid memukulku), akalahu \'aliyyun (Ali memakannya)',
        ],
        footnotes: [
            'Maf\'ul bih selalu manshub (fathah atau penggantinya)',
            'Maf\'ul bih = objek yang dikenai pekerjaan',
            'Contoh dhamir muttashil: -ni (aku), -hu (dia), -ha (dia pr)',
        ]
    },
    {
        chapter: 10,
        title: 'Al-Mubtada\' wal Khabar',
        content: [
            'المُبْتَدَأُ: اِسْمٌ مَرْفُوْعٌ فِي أَوَّلِ الجُمْلَةِ',
            'الخَبَرُ: اِسْمٌ مَرْفُوْعٌ يُخْبَرُ بِهِ عَنِ المُبْتَدَإِ',
            'نَحْوُ: زَيْدٌ قَائِمٌ، الطَّالِبُ مُجْتَهِدٌ، البَيْتُ كَبِيْرٌ',
            'المُبْتَدَأُ وَالخَبَرُ كِلاَهُمَا مَرْفُوْعَانِ',
        ],
        translation: [
            'Mubtada\': isim marfu\' di awal kalimat',
            'Khabar: isim marfu\' yang dikhabarkan tentang mubtada\'',
            'Seperti: zaidun qa\'imun (Zaid berdiri), ath-thalibu mujtahidun (pelajar itu rajin), al-baitu kabirun (rumah itu besar)',
            'Mubtada\' dan khabar keduanya marfu\'',
        ],
        footnotes: [
            'Jumlah ismiyyah: mubtada\' + khabar',
            'Mubtada\' = subjek, Khabar = predikat',
            'Keduanya harus marfu\' kecuali ada nawasikh',
        ]
    },
    {
        chapter: 11,
        title: 'Huruf al-Jarr (Huruf Jar)',
        content: [
            'حُرُوْفُ الجَرِّ عَشَرَةٌ: مِنْ، إِلَى، عَنْ، عَلَى، فِي، رُبَّ، البَاءُ، الكَافُ، اللاَّمُ، حَتَّى',
            'مِنْ: لِلاِبْتِدَاءِ أَوِ التَّبْعِيْضِ، نَحْوُ: سَافَرْتُ مِنَ المَدِيْنَةِ',
            'إِلَى: لِلاِنْتِهَاءِ، نَحْوُ: ذَهَبْتُ إِلَى المَسْجِدِ',
            'عَلَى: لِلْعُلُوِّ، نَحْوُ: الكِتَابُ عَلَى المَكْتَبِ',
            'فِي: لِلظَّرْفِيَّةِ، نَحْوُ: الطَّالِبُ فِي الفَصْلِ',
        ],
        translation: [
            'Huruf jar ada sepuluh: min, ila, \'an, \'ala, fi, rubba, ba, kaf, lam, hatta',
            'Min: untuk permulaan atau sebagian, seperti: safartu minal-madinati (aku berangkat dari Madinah)',
            'Ila: untuk akhir/tujuan, seperti: dzahabtu ilal-masjidi (aku pergi ke masjid)',
            '\'Ala: untuk tempat di atas, seperti: al-kitabu \'alal-maktabi (buku di atas meja)',
            'Fi: untuk keterangan tempat, seperti: ath-thalibu fil-fashli (pelajar di kelas)',
        ],
        footnotes: [
            'Huruf jar men-jar isim setelahnya',
            'Isim setelah huruf jar disebut majrur',
            'Min: من, Ila: إلى, Fi: في, dll',
        ]
    },
    {
        chapter: 12,
        title: 'Khatimah (Penutup)',
        content: [
            'هَذِهِ خُلاَصَةُ عِلْمِ النَّحْوِ لِلْمُبْتَدِئِيْنَ',
            'وَمَنْ أَرَادَ التَّوَسُّعَ فَلْيَطْلُبْ كُتُبَ النَّحْوِ الأُخْرَى',
            'كَالآجُرُّوْمِيَّةِ، وَقَطْرِ النَّدَى، وَأَلْفِيَّةِ ابْنِ مَالِكٍ',
            'وَاللهُ أَعْلَمُ بِالصَّوَابِ، وَإِلَيْهِ المَرْجِعُ وَالمَآبُ',
        ],
        translation: [
            'Ini adalah ringkasan ilmu nahwu untuk pemula',
            'Dan siapa yang ingin memperdalam, hendaklah mencari kitab-kitab nahwu lainnya',
            'Seperti Ajurrumiyyah, Qathrun Nada, dan Alfiyyah Ibnu Malik',
            'Dan Allah lebih mengetahui yang benar, dan kepada-Nya tempat kembali',
        ],
        footnotes: [
            'Hidayatus Shibyan adalah pengantar sebelum Ajurrumiyyah',
            'Urutan belajar: Hidayatus Shibyan → Ajurrumiyyah → Qathrun Nada → Alfiyyah',
            'Doa penutup: memohon ilmu yang bermanfaat',
        ]
    },
];
