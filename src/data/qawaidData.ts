interface KitabContent {
    chapter: number;
    title: string;
    content: string[];
    translation?: string[];
    footnotes?: string[];
}

export const qawaidContent: KitabContent[] = [
    {
        chapter: 1,
        title: 'Kaidah Umum Bahasa Arab',
        content: [
            'اَللُّغَةُ الْعَرَبِيَّةُ تَتَكَوَّنُ مِنْ ثَلَاثَةِ أَقْسَامٍ: اِسْمٌ وَفِعْلٌ وَحَرْفٌ',
            'الْكَلَامُ هُوَ اللَّفْظُ الْمُرَكَّبُ الْمُفِيدُ بِالْوَضْعِ',
            'الْجُمْلَةُ قِسْمَانِ: جُمْلَةٌ فِعْلِيَّةٌ وَجُمْلَةٌ اسْمِيَّةٌ',
            'الْجُمْلَةُ الْفِعْلِيَّةُ تَبْدَأُ بِالْفِعْلِ، وَالْجُمْلَةُ الِاسْمِيَّةُ تَبْدَأُ بِالِاسْمِ',
        ],
        translation: [
            'Bahasa Arab terdiri dari tiga bagian: Isim, Fi\'il, dan Huruf',
            'Kalam adalah lafaz yang tersusun dan berfaidah menurut kesepakatan',
            'Kalimat ada dua: Jumlah Fi\'liyyah dan Jumlah Ismiyyah',
            'Jumlah Fi\'liyyah dimulai dengan Fi\'il, dan Jumlah Ismiyyah dimulai dengan Isim',
        ],
        footnotes: [
            'Tiga komponen dasar bahasa Arab: Isim (kata benda), Fi\'il (kata kerja), Huruf (partikel)',
            'Kalam minimal terdiri dari 2 kata yang memberi makna sempurna',
            'Jumlah Fi\'liyyah: Fi\'il + Fa\'il, contoh: Qama Zaidun (Zaid berdiri)',
            'Jumlah Ismiyyah: Mubtada + Khabar, contoh: Zaidun Qa\'imun (Zaid sedang berdiri)',
        ]
    },
    {
        chapter: 2,
        title: 'Kaidah Isim',
        content: [
            'الِاسْمُ كَلِمَةٌ تَدُلُّ عَلَى مَعْنًى فِي نَفْسِهَا وَلَا تَقْتَرِنُ بِزَمَانٍ',
            'عَلَامَاتُ الِاسْمِ: الْجَرُّ، وَالتَّنْوِينُ، وَدُخُولُ (أَلْ)، وَالنِّدَاءُ',
            'الِاسْمُ يَنْقَسِمُ إِلَى مُعْرَبٍ وَمَبْنِيٍّ',
            'الِاسْمُ الْمُعْرَبُ يَتَغَيَّرُ آخِرُهُ بِتَغَيُّرِ الْعَوَامِلِ',
        ],
        translation: [
            'Isim adalah kata yang menunjukkan makna pada dirinya dan tidak terikat waktu',
            'Tanda-tanda Isim: Jar, Tanwin, masuknya (Al), dan Nida (panggilan)',
            'Isim terbagi menjadi Mu\'rab dan Mabni',
            'Isim Mu\'rab berubah akhirnya dengan berubahnya \'Awamil',
        ],
        footnotes: [
            'Isim tidak menunjukkan waktu, berbeda dengan Fi\'il',
            'Tanda Isim: bisa di-jar (kasrah), bisa ditanwin, bisa ditambah Al, bisa dipanggil',
            'Mu\'rab: berubah i\'rabnya (rafa\', nashab, jar)',
            'Mabni: tetap tidak berubah, seperti dhamir (kata ganti)',
        ]
    },
    {
        chapter: 3,
        title: 'Kaidah Fi\'il',
        content: [
            'الْفِعْلُ كَلِمَةٌ تَدُلُّ عَلَى حَدَثٍ مَقْتَرِنٍ بِزَمَانٍ',
            'الْأَفْعَالُ ثَلَاثَةٌ: مَاضٍ، وَمُضَارِعٌ، وَأَمْرٌ',
            'الْفِعْلُ الْمَاضِي مَبْنِيٌّ دَائِمًا',
            'الْفِعْلُ الْمُضَارِعُ مُعْرَبٌ إِلَّا إِذَا اتَّصَلَتْ بِهِ نُونُ التَّوْكِيدِ أَوْ نُونُ النِّسْوَةِ',
            'فِعْلُ الْأَمْرِ مَبْنِيٌّ دَائِمًا',
        ],
        translation: [
            'Fi\'il adalah kata yang menunjukkan peristiwa yang terikat dengan waktu',
            'Fi\'il ada tiga: Madhi (lampau), Mudhari\' (sekarang/akan), dan Amar (perintah)',
            'Fi\'il Madhi selalu Mabni (tetap)',
            'Fi\'il Mudhari\' Mu\'rab kecuali jika bersambung dengan Nun Taukid atau Nun Niswah',
            'Fi\'il Amar selalu Mabni',
        ],
        footnotes: [
            'Fi\'il menunjukkan peristiwa dan waktu terjadinya',
            'Madhi: waktu lampau, Mudhari\': sekarang/akan datang, Amar: perintah',
            'Mabni: tidak berubah harakatnya',
            'Nun Taukid: nun penguat, Nun Niswah: nun untuk muannats jama\'',
        ]
    },
    {
        chapter: 4,
        title: 'Kaidah Huruf',
        content: [
            'الْحَرْفُ كَلِمَةٌ تَدُلُّ عَلَى مَعْنًى فِي غَيْرِهَا',
            'الْحَرْفُ لَا يَقْبَلُ عَلَامَاتِ الِاسْمِ وَلَا عَلَامَاتِ الْفِعْلِ',
            'حُرُوفُ الْجَرِّ عِشْرُونَ حَرْفًا',
            'حُرُوفُ النَّصْبِ لِلْفِعْلِ الْمُضَارِعِ: أَنْ، لَنْ، إِذَنْ، كَيْ',
            'حُرُوفُ الْجَزْمِ: لَمْ، لَمَّا، لَامُ الْأَمْرِ، لَا النَّاهِيَةُ',
        ],
        translation: [
            'Huruf adalah kata yang menunjukkan makna pada selainnya',
            'Huruf tidak menerima tanda-tanda Isim dan tidak tanda-tanda Fi\'il',
            'Huruf Jar ada dua puluh huruf',
            'Huruf Nashab untuk Fi\'il Mudhari\': An, Lan, Idzan, Kay',
            'Huruf Jazm: Lam, Lamma, Lam Amar, La Nahiyah',
        ],
        footnotes: [
            'Huruf tidak memiliki makna sendiri, hanya bermakna jika bergabung dengan kata lain',
            'Huruf Jar: min, ila, \'an, \'ala, fi, dst',
            'Huruf Nashab men-nashab fi\'il mudhari\'',
            'Huruf Jazm men-jazm fi\'il mudhari\'',
        ]
    },
    {
        chapter: 5,
        title: 'Kaidah I\'rab',
        content: [
            'الْإِعْرَابُ أَرْبَعَةُ أَنْوَاعٍ: رَفْعٌ، وَنَصْبٌ، وَجَرٌّ، وَجَزْمٌ',
            'لِلْأَسْمَاءِ مِنَ الْإِعْرَابِ: الرَّفْعُ، وَالنَّصْبُ، وَالْجَرُّ',
            'لِلْأَفْعَالِ مِنَ الْإِعْرَابِ: الرَّفْعُ، وَالنَّصْبُ، وَالْجَزْمُ',
            'عَلَامَةُ الرَّفْعِ الضَّمَّةُ، وَعَلَامَةُ النَّصْبِ الْفَتْحَةُ',
            'عَلَامَةُ الْجَرِّ الْكَسْرَةُ، وَعَلَامَةُ الْجَزْمِ السُّكُونُ',
        ],
        translation: [
            'I\'rab ada empat jenis: Rafa\', Nashab, Jar, dan Jazm',
            'Untuk Isim dari I\'rab: Rafa\', Nashab, dan Jar',
            'Untuk Fi\'il dari I\'rab: Rafa\', Nashab, dan Jazm',
            'Tanda Rafa\' adalah Dhammah, tanda Nashab adalah Fathah',
            'Tanda Jar adalah Kasrah, tanda Jazm adalah Sukun',
        ],
        footnotes: [
            'I\'rab: perubahan akhir kata karena pengaruh \'amil',
            'Isim tidak memiliki Jazm, Fi\'il tidak memiliki Jar',
            'Dhammah (ـُ): tanda rafa\'',
            'Fathah (ـَ): tanda nashab',
            'Kasrah (ـِ): tanda jar',
            'Sukun (ـْ): tanda jazm',
        ]
    },
    {
        chapter: 6,
        title: 'Kaidah Mudzakkar Muannats',
        content: [
            'الِاسْمُ يَنْقَسِمُ إِلَى مُذَكَّرٍ وَمُؤَنَّثٍ',
            'الْمُذَكَّرُ مَا دَلَّ عَلَى ذَكَرٍ مِنَ النَّاسِ أَوِ الْحَيَوَانِ',
            'الْمُؤَنَّثُ مَا دَلَّ عَلَى أُنْثَى مِنَ النَّاسِ أَوِ الْحَيَوَانِ',
            'عَلَامَاتُ التَّأْنِيثِ: التَّاءُ الْمَرْبُوطَةُ، وَالْأَلِفُ الْمَقْصُورَةُ، وَالْأَلِفُ الْمَمْدُودَةُ',
        ],
        translation: [
            'Isim terbagi menjadi Mudzakkar dan Muannats',
            'Mudzakkar adalah yang menunjukkan laki-laki dari manusia atau hewan',
            'Muannats adalah yang menunjukkan perempuan dari manusia atau hewan',
            'Tanda-tanda Ta\'nits: Ta Marbutah, Alif Maqshurah, dan Alif Mamdudah',
        ],
        footnotes: [
            'Mudzakkar: kata maskulin/laki-laki',
            'Muannats: kata feminin/perempuan',
            'Ta Marbutah (ة): tanda muannats paling umum',
            'Alif Maqshurah (ى): seperti pada Salma, Lubna',
            'Alif Mamdudah (اء): seperti pada Zahra\', Samra\'',
        ]
    },
    {
        chapter: 7,
        title: 'Kaidah Ma\'rifah Nakirah',
        content: [
            'الِاسْمُ يَنْقَسِمُ إِلَى مَعْرِفَةٍ وَنَكِرَةٍ',
            'الْمَعْرِفَةُ مَا دَلَّ عَلَى شَيْءٍ مُعَيَّنٍ',
            'النَّكِرَةُ مَا دَلَّ عَلَى شَيْءٍ غَيْرِ مُعَيَّنٍ',
            'الْمَعَارِفُ سَبْعَةٌ: الضَّمِيرُ، وَالْعَلَمُ، وَاسْمُ الْإِشَارَةِ، وَالِاسْمُ الْمَوْصُولُ',
            'وَالْمُعَرَّفُ بِأَلْ، وَالْمُضَافُ إِلَى مَعْرِفَةٍ، وَالْمُنَادَى الْمَقْصُودُ',
        ],
        translation: [
            'Isim terbagi menjadi Ma\'rifah dan Nakirah',
            'Ma\'rifah adalah yang menunjukkan sesuatu yang tertentu',
            'Nakirah adalah yang menunjukkan sesuatu yang tidak tertentu',
            'Ma\'arif ada tujuh: Dhamir, \'Alam, Isim Isyarah, Isim Maushul',
            'Dan Mu\'arraf bi Al, Mudhaf ila Ma\'rifah, dan Munada Maqshud',
        ],
        footnotes: [
            'Ma\'rifah: kata yang menunjuk sesuatu yang jelas/tertentu',
            'Nakirah: kata yang menunjuk sesuatu yang umum/tidak tertentu',
            '7 jenis Ma\'rifah: Dhamir (kata ganti), \'Alam (nama diri)',
            'Isim Isyarah (kata tunjuk), Isim Maushul (kata sambung)',
            'Mu\'arraf bi Al (dengan Al), Mudhaf ila Ma\'rifah (disandarkan ke ma\'rifah)',
        ]
    },
    {
        chapter: 8,
        title: 'Kaidah Mufrad Mutsanna Jama\'',
        content: [
            'الِاسْمُ يَنْقَسِمُ إِلَى مُفْرَدٍ، وَمُثَنًّى، وَجَمْعٍ',
            'الْمُفْرَدُ مَا دَلَّ عَلَى وَاحِدٍ',
            'الْمُثَنَّى مَا دَلَّ عَلَى اِثْنَيْنِ بِزِيَادَةِ أَلِفٍ وَنُونٍ أَوْ يَاءٍ وَنُونٍ',
            'الْجَمْعُ ثَلَاثَةُ أَنْوَاعٍ: جَمْعُ الْمُذَكَّرِ السَّالِمُ، وَجَمْعُ الْمُؤَنَّثِ السَّالِمُ، وَجَمْعُ التَّكْسِيرِ',
        ],
        translation: [
            'Isim terbagi menjadi Mufrad, Mutsanna, dan Jama\'',
            'Mufrad adalah yang menunjukkan satu',
            'Mutsanna adalah yang menunjukkan dua dengan tambahan Alif-Nun atau Ya-Nun',
            'Jama\' ada tiga jenis: Jama\' Mudzakkar Salim, Jama\' Muannats Salim, dan Jama\' Taksir',
        ],
        footnotes: [
            'Mufrad: kata tunggal (satu)',
            'Mutsanna: kata dual (dua), tambah ان atau ين',
            'Jama\': kata jamak (banyak, lebih dari dua)',
            'Jama\' Mudzakkar Salim: tambah ون atau ين untuk mudzakkar',
            'Jama\' Muannats Salim: tambah ات untuk muannats',
            'Jama\' Taksir: jamak dengan perubahan bentuk kata',
        ]
    },
    {
        chapter: 9,
        title: 'Kaidah Fa\'il Na\'ibul Fa\'il',
        content: [
            'الْفَاعِلُ اسْمٌ مَرْفُوعٌ يَدُلُّ عَلَى مَنْ فَعَلَ الْفِعْلَ',
            'نَائِبُ الْفَاعِلِ اسْمٌ مَرْفُوعٌ يَقُومُ مَقَامَ الْفَاعِلِ بَعْدَ حَذْفِهِ',
            'الْفِعْلُ يُبْنَى لِلْمَجْهُولِ بِضَمِّ أَوَّلِهِ وَكَسْرِ مَا قَبْلَ آخِرِهِ',
            'نَائِبُ الْفَاعِلِ يَأْخُذُ حُكْمَ الْفَاعِلِ فِي الرَّفْعِ',
        ],
        translation: [
            'Fa\'il adalah isim marfu\' yang menunjukkan siapa yang melakukan fi\'il',
            'Na\'ibul Fa\'il adalah isim marfu\' yang menggantikan posisi fa\'il setelah dihilangkan',
            'Fi\'il dibentuk untuk majhul (pasif) dengan men-dhammah awalnya dan meng-kasrah sebelum akhirnya',
            'Na\'ibul Fa\'il mengambil hukum Fa\'il dalam rafa\'',
        ],
        footnotes: [
            'Fa\'il: pelaku perbuatan, selalu marfu\'',
            'Na\'ibul Fa\'il: pengganti fa\'il dalam kalimat pasif',
            'Contoh aktif: Dharaba Zaidun \'Amran (Zaid memukul Amr)',
            'Contoh pasif: Dhuriba \'Amrun (Amr dipukul)',
            'Dalam pasif, fa\'il dihilangkan dan maf\'ul naib menjadi fa\'il',
        ]
    },
    {
        chapter: 10,
        title: 'Kaidah Maf\'ul Bihi',
        content: [
            'الْمَفْعُولُ بِهِ اسْمٌ مَنْصُوبٌ يَدُلُّ عَلَى مَنْ وَقَعَ عَلَيْهِ الْفِعْلُ',
            'الْمَفْعُولُ بِهِ يَأْتِي بَعْدَ الْفِعْلِ الْمُتَعَدِّي وَفَاعِلِهِ',
            'يَجُوزُ تَقْدِيمُ الْمَفْعُولِ بِهِ عَلَى الْفَاعِلِ',
            'يَجِبُ تَقْدِيمُ الْمَفْعُولِ بِهِ إِذَا كَانَ ضَمِيرًا مُتَّصِلًا وَالْفَاعِلُ اسْمًا ظَاهِرًا',
        ],
        translation: [
            'Maf\'ul Bihi adalah isim mansub yang menunjukkan apa yang terkena fi\'il',
            'Maf\'ul Bihi datang setelah Fi\'il Muta\'addi dan Fa\'ilnya',
            'Boleh mendahulukan Maf\'ul Bihi atas Fa\'il',
            'Wajib mendahulukan Maf\'ul Bihi jika ia dhamir muttashil dan Fa\'il isim zhahir',
        ],
        footnotes: [
            'Maf\'ul Bihi: objek yang dikenai perbuatan, selalu mansub',
            'Fi\'il Muta\'addi: fi\'il yang memerlukan objek',
            'Urutan normal: Fi\'il - Fa\'il - Maf\'ul Bihi',
            'Boleh: Dharaba Zaidun \'Amran atau Dharaba \'Amran Zaidun',
            'Contoh wajib didahulukan: Dharabahu Zaidun (bukan Dharaba Zaidun -hu)',
        ]
    },
    {
        chapter: 11,
        title: 'Kaidah Mubtada Khabar',
        content: [
            'الْمُبْتَدَأُ اسْمٌ مَرْفُوعٌ يُبْدَأُ بِهِ الْجُمْلَةُ الِاسْمِيَّةُ',
            'الْخَبَرُ اسْمٌ مَرْفُوعٌ يُخْبِرُ عَنِ الْمُبْتَدَإِ',
            'الْأَصْلُ فِي الْمُبْتَدَإِ أَنْ يَكُونَ مَعْرِفَةً وَفِي الْخَبَرِ أَنْ يَكُونَ نَكِرَةً',
            'يَجُوزُ حَذْفُ الْمُبْتَدَإِ أَوِ الْخَبَرِ إِذَا دَلَّ عَلَيْهِ دَلِيلٌ',
        ],
        translation: [
            'Mubtada adalah isim marfu\' yang dimulai dengannya jumlah ismiyyah',
            'Khabar adalah isim marfu\' yang mengabarkan tentang mubtada',
            'Asal dalam mubtada adalah ma\'rifah dan dalam khabar adalah nakirah',
            'Boleh menghilangkan mubtada atau khabar jika ada dalil yang menunjukkannya',
        ],
        footnotes: [
            'Mubtada: subjek kalimat, awal jumlah ismiyyah',
            'Khabar: predikat yang memberi informasi tentang mubtada',
            'Keduanya marfu\' (dhammah)',
            'Biasanya mubtada ma\'rifah, khabar nakirah',
            'Contoh: Zaidun \'alimun (Zaid adalah orang alim)',
        ]
    },
    {
        chapter: 12,
        title: 'Kaidah Jar Majrur',
        content: [
            'الْمَجْرُورُ اسْمٌ مَكْسُورٌ يَأْتِي بَعْدَ حَرْفِ الْجَرِّ',
            'حُرُوفُ الْجَرِّ: مِنْ، إِلَى، عَنْ، عَلَى، فِي، رُبَّ، الْبَاءُ، الْكَافُ، اللَّامُ، وَاوُ الْقَسَمِ',
            'الِاسْمُ الْمُضَافُ إِلَيْهِ مَجْرُورٌ دَائِمًا',
            'التَّابِعُ لِلْمَجْرُورِ مَجْرُورٌ مِثْلُهُ',
        ],
        translation: [
            'Majrur adalah isim ber-kasrah yang datang setelah huruf jar',
            'Huruf Jar: Min, Ila, \'An, \'Ala, Fi, Rubba, Ba, Kaf, Lam, Wawul Qasam',
            'Isim Mudhaf Ilaihi selalu majrur',
            'Tabi\' (pengikut) majrur adalah majrur sepertinya',
        ],
        footnotes: [
            'Majrur: i\'rab jar dengan tanda kasrah',
            'Tiga cara men-jar: huruf jar, idhafah, tabi\'',
            'Contoh huruf jar: Fi-l-baiti (di rumah)',
            'Contoh idhafah: Kitabu Zaididin (Kitabnya Zaid)',
            'Mudhaf ilaihi selalu majrur',
        ]
    },
    {
        chapter: 13,
        title: 'Kaidah Na\'t',
        content: [
            'النَّعْتُ تَابِعٌ يَصِفُ مَتْبُوعَهُ',
            'النَّعْتُ يُطَابِقُ الْمَنْعُوتَ فِي أَرْبَعَةِ أَشْيَاءَ مِنْ عَشَرَةٍ',
            'التَّطَابُقُ فِي: الْإِعْرَابِ، وَالتَّعْرِيفِ وَالتَّنْكِيرِ، وَالْعَدَدِ، وَالتَّذْكِيرِ وَالتَّأْنِيثِ',
            'النَّعْتُ نَوْعَانِ: نَعْتٌ حَقِيقِيٌّ وَنَعْتٌ سَبَبِيٌّ',
        ],
        translation: [
            'Na\'t adalah tabi\' yang mensifati yang diikutinya',
            'Na\'t menyesuaikan Man\'ut dalam empat hal dari sepuluh',
            'Penyesuaian dalam: I\'rab, Ta\'rif dan Tankir, \'Adad, Tadzkir dan Ta\'nits',
            'Na\'t ada dua jenis: Na\'t Haqiqi dan Na\'t Sababi',
        ],
        footnotes: [
            'Na\'t (Sifat): mengikuti man\'ut (yang disifati)',
            'Empat penyesuaian: I\'rab (rafa\'/nashab/jar)',
            'Ta\'rif-Tankir (ma\'rifah/nakirah)',
            '\'Adad (mufrad/mutsanna/jama\')',
            'Tadzkir-Ta\'nits (mudzakkar/muannats)',
            'Contoh: Ja\'a rajulun karimun (datang laki-laki yang mulia)',
        ]
    },
    {
        chapter: 14,
        title: 'Kaidah \'Athaf',
        content: [
            'الْعَطْفُ تَابِعٌ يَتَوَسَّطُ بَيْنَهُ وَبَيْنَ مَتْبُوعِهِ أَحَدُ حُرُوفِ الْعَطْفِ',
            'حُرُوفُ الْعَطْفِ تِسْعَةٌ: الْوَاوُ، الْفَاءُ، ثُمَّ، أَوْ، أَمْ، لَا، بَلْ، لَكِنْ، حَتَّى',
            'الْمَعْطُوفُ يُطَابِقُ الْمَعْطُوفَ عَلَيْهِ فِي الْإِعْرَابِ فَقَطْ',
            'حُرُوفُ الْعَطْفِ لَهَا مَعَانٍ مُخْتَلِفَةٌ',
        ],
        translation: [
            '\'Athaf adalah tabi\' yang di tengahi antara dia dan yang diikutinya salah satu huruf \'athaf',
            'Huruf \'Athaf ada sembilan: Waw, Fa, Tsumma, Au, Am, La, Bal, Lakin, Hatta',
            'Ma\'thuf menyesuaikan Ma\'thuf \'Alaihi hanya dalam I\'rab saja',
            'Huruf \'Athaf memiliki makna yang berbeda-beda',
        ],
        footnotes: [
            '\'Athaf: penyambungan dengan huruf \'athaf',
            'Waw (و): dan (tanpa urutan)',
            'Fa (ف): lalu (dengan urutan langsung)',
            'Tsumma (ثم): kemudian (dengan jarak waktu)',
            'Au (أو): atau, Am (أم): atau (dalam pertanyaan)',
            'Ma\'thuf mengikuti i\'rab ma\'thuf \'alaihi',
        ]
    },
    {
        chapter: 15,
        title: 'Kaidah Idhafah',
        content: [
            'الْإِضَافَةُ نِسْبَةٌ بَيْنَ اسْمَيْنِ عَلَى تَقْدِيرِ حَرْفِ الْجَرِّ',
            'الْمُضَافُ لَا يُنَوَّنُ وَلَا يَدْخُلُهُ (أَلْ)',
            'الْمُضَافُ إِلَيْهِ مَجْرُورٌ دَائِمًا',
            'الْإِضَافَةُ نَوْعَانِ: إِضَافَةٌ مَعْنَوِيَّةٌ وَإِضَافَةٌ لَفْظِيَّةٌ',
            'الْإِضَافَةُ الْمَعْنَوِيَّةُ تُفِيدُ التَّعْرِيفَ أَوِ التَّخْصِيصَ',
        ],
        translation: [
            'Idhafah adalah hubungan antara dua isim dengan perkiraan huruf jar',
            'Mudhaf tidak ditanwin dan tidak masuk padanya (Al)',
            'Mudhaf Ilaihi selalu majrur',
            'Idhafah ada dua jenis: Idhafah Ma\'nawiyyah dan Idhafah Lafzhiyyah',
            'Idhafah Ma\'nawiyyah memberi faidah Ta\'rif atau Takhshish',
        ],
        footnotes: [
            'Idhafah: penyandaran isim kepada isim (kata majemuk)',
            'Mudhaf: yang disandarkan (tidak ditanwin, tidak ber-Al)',
            'Mudhaf Ilaihi: yang disandari (selalu majrur)',
            'Contoh: Kitabu Zaididin (Kitabnya Zaid)',
            'Idhafah Ma\'nawiyyah: kepemilikan hakiki',
            'Idhafah Lafzhiyyah: dari isim fa\'il/maf\'ul/sifat musyabbahah',
        ]
    }
];
