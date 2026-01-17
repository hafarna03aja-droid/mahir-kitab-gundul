// Qathrun Nada wa Ballush Shada - Complete Content
// Author: Ibnu Hisyam Al-Anshari (708-761 H)
// Category: Nahwu (Tata Bahasa Arab)
// Level: Menengah
// Popularity: ⭐⭐⭐⭐⭐ (Kitab nahwu terpopuler setelah Alfiyyah)

export interface KitabContent {
    chapter: number;
    title: string;
    content: string[];
    translation?: string[];
    footnotes?: string[];
}

export const qathrunNadaContent: KitabContent[] = [
    {
        chapter: 1,
        title: 'Muqaddimah (Pendahuluan)',
        content: [
            'بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ',
            'قَالَ الشَّيْخُ الإِمَامُ جَمَالُ الدِّيْنِ أَبُو مُحَمَّدٍ عَبْدُ اللهِ بْنُ يُوسُفَ بْنِ هِشَامٍ الأَنْصَارِيُّ',
            'الحَمْدُ لِلهِ رَبِّ العَالَمِيْنَ، وَصَلَّى اللهُ عَلَى سَيِّدِنَا مُحَمَّدٍ وَآلِهِ أَجْمَعِيْنَ',
            'فَهَذَا كِتَابٌ مُخْتَصَرٌ فِي النَّحْوِ، سَمَّيْتُهُ: قَطْرَ النَّدَى وَبَلَّ الصَّدَى',
        ],
        translation: [
            'Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang',
            'Berkata Syaikh Imam Jamaluddin Abu Muhammad Abdullah bin Yusuf bin Hisyam Al-Anshari',
            'Segala puji bagi Allah Tuhan semesta alam, semoga Allah bershalawat atas junjungan kami Muhammad dan keluarganya',
            'Maka ini adalah kitab ringkas dalam nahwu, aku namakan: Qathrun Nada wa Ballush Shada',
        ],
        footnotes: [
            'Pengarang: Ibnu Hisyam Al-Anshari - ulama nahwu terbesar',
            'Qathrun Nada = Tetes Embun, Ballush Shada = Basah Kehausan',
            'Bridge sempurna antara Ajurrumiyyah dan Alfiyyah',
        ]
    },
    {
        chapter: 2,
        title: 'Al-Kalam (Kalam dan Pembagiannya)',
        content: [
            'الكَلاَمُ: قَوْلٌ مُفِيْدٌ بِالقَصْدِ',
            'وَالكَلِمَةُ: قَوْلٌ مُفْرَدٌ، وَهِيَ: اِسْمٌ، وَفِعْلٌ، وَحَرْفٌ',
            'فَالإِسْمُ: كَلِمَةٌ دَلَّتْ عَلَى مَعْنًى فِي نَفْسِهَا، وَلَمْ تَقْتَرِنْ بِزَمَانٍ',
            'وَالفِعْلُ: كَلِمَةٌ دَلَّتْ عَلَى مَعْنًى فِي نَفْسِهَا، وَاقْتَرَنَتْ بِأَحَدِ الأَزْمِنَةِ الثَّلاَثَةِ',
            'وَالحَرْفُ: كَلِمَةٌ دَلَّتْ عَلَى مَعْنًى فِي غَيْرِهَا',
        ],
        translation: [
            'Kalam: ucapan yang berfaedah dengan sengaja',
            'Kalimah: ucapan mufrad, yaitu: isim, fi\'il, dan huruf',
            'Isim: kalimah yang menunjukkan makna pada dirinya, dan tidak terikat waktu',
            'Fi\'il: kalimah yang menunjukkan makna pada dirinya, dan terikat salah satu dari 3 waktu',
            'Huruf: kalimah yang menunjukkan makna pada selain dirinya',
        ],
        footnotes: [
            'Perbedaan isim dan fi\'il: isim tidak terikat waktu',
            'Tiga waktu: madhi, hal (sekarang), istiqbal (akan datang)',
        ]
    },
    {
        chapter: 3,
        title: 'Al-I\'rab (I\'rab)',
        content: [
            'الإِعْرَابُ: أَثَرٌ ظَاهِرٌ أَوْ مُقَدَّرٌ، يُجْلِبُهُ العَامِلُ فِي آخِرِ الكَلِمَةِ',
            'وَأَقْسَامُهُ أَرْبَعَةٌ: رَفْعٌ، وَنَصْبٌ، وَجَرٌّ، وَجَزْمٌ',
            'فَالأَسْمَاءُ: الرَّفْعُ، وَالنَّصْبُ، وَالجَرُّ',
            'وَالأَفْعَالُ: الرَّفْعُ، وَالنَّصْبُ، وَالجَزْمُ',
        ],
        translation: [
            'I\'rab: bekas yang zhahir atau muqaddar, yang dibawa \'amil di akhir kata',
            'Pembagiannya ada empat: rafa\', nashb, jar, dan jazm',
            'Isim: rafa\', nashb, dan jar (tidak ada jazm)',
            'Fi\'il: rafa\', nashb, dan jazm (tidak ada jar)',
        ],
        footnotes: [
            'I\'rab = perubahan akhir kata karena \'amil',
            'Zhahir = tampak, Muqaddar = tersembunyi',
        ]
    },
    {
        chapter: 4,
        title: 'Al-Marfu\'at (Yang Marfu\')',
        content: [
            'المَرْفُوعَاتُ سَبْعَةٌ: الفَاعِلُ، وَنَائِبُ الفَاعِلِ، وَالمُبْتَدَأُ، وَالخَبَرُ',
            'وَاسْمُ كَانَ، وَخَبَرُ إِنَّ، وَالتَّابِعُ لِلْمَرْفُوعِ',
            'فَالفَاعِلُ: اِسْمٌ أُسْنِدَ إِلَيْهِ فِعْلٌ مُقَدَّمٌ عَلَيْهِ',
            'نَحْوُ: قَامَ زَيْدٌ، وَزَيْدٌ قَائِمٌ أَبُوهُ',
        ],
        translation: [
            'Yang marfu\' ada tujuh: fa\'il, na\'ib fa\'il, mubtada\', khabar',
            'Dan isim kana, khabar inna, dan tabi\' yang mengikuti marfu\'',
            'Fa\'il: isim yang disandarkan kepadanya fi\'il yang didahulukan',
            'Seperti: qama zaidun (Zaid berdiri), zaidun qa\'imun abuhu (Zaid, ayahnya berdiri)',
        ],
        footnotes: [
            '7 marfu\'at menurut Ibnu Hisyam',
            'Fa\'il bisa setelah fi\'il atau isim fa\'il',
        ]
    },
    {
        chapter: 5,
        title: 'An-Na\'ib \'an al-Fa\'il',
        content: [
            'نَائِبُ الفَاعِلِ: اِسْمٌ أُسْنِدَ إِلَيْهِ فِعْلٌ مَبْنِيٌّ لِلْمَفْعُولِ',
            'وَيُحْذَفُ الفَاعِلُ وُجُوبًا فِي ثَلاَثَةِ مَوَاضِعَ:',
            'إِذَا عُلِمَ، نَحْوُ: خُلِقَ الإِنْسَانُ ضَعِيفًا',
            'وَإِذَا جُهِلَ، نَحْوُ: سُرِقَ المَالُ',
            'وَإِذَا خِيفَ عَلَيْهِ أَوْ مِنْهُ',
        ],
        translation: [
            'Na\'ib fa\'il: isim yang disandarkan kepadanya fi\'il yang dibangun untuk maf\'ul',
            'Dan dihapus fa\'il wajib pada tiga tempat:',
            'Jika diketahui, seperti: manusia diciptakan lemah (Allah Penciptanya)',
            'Jika tidak diketahui, seperti: harta telah dicuri (pencurinya tidak tahu)',
            'Dan jika ditakutkan atasnya atau darinya',
        ],
        footnotes: [
            'Na\'ib fa\'il = pengganti fa\'il dalam kalimat pasif',
            'Fi\'il mabni lil-maf\'ul = fi\'il pasif',
        ]
    },
    {
        chapter: 6,
        title: 'Al-Mubtada\' wal Khabar',
        content: [
            'المُبْتَدَأُ: اِسْمٌ مَرْفُوعٌ عَارٍ عَنِ العَوَامِلِ اللَّفْظِيَّةِ',
            'وَالخَبَرُ: هُوَ الجُزْءُ المُتِمُّ الفَائِدَةَ مَعَ المُبْتَدَإِ',
            'وَيَجِبُ تَقْدِيمُ الخَبَرِ فِي مَوَاضِعَ مِنْهَا:',
            'إِذَا كَانَ الخَبَرُ لَهُ الصَّدَارَةُ، نَحْوُ: أَيْنَ زَيْدٌ؟',
            'وَإِذَا كَانَ المُبْتَدَأُ نَكِرَةً، نَحْوُ: فِي الدَّارِ رَجُلٌ',
        ],
        translation: [
            'Mubtada\': isim marfu\' yang kosong dari \'awamil lafzhiyyah',
            'Khabar: bagian yang menyempurnakan faedah bersama mubtada\'',
            'Dan wajib mendahulukan khabar pada beberapa tempat:',
            'Jika khabar punya hak shadarah, seperti: aina zaidun? (Di mana Zaid?)',
            'Dan jika mubtada\' nakirah, seperti: fid-dari rajulun (Di rumah ada lelaki)',
        ],
        footnotes: [
            'Mubtada\' = subjek kalimat ismiyyah',
            'Khabar = predikat yang menyempurnakan',
        ]
    },
    {
        chapter: 7,
        title: 'Kana wa Akhawatiha',
        content: [
            'كَانَ وَأَخَوَاتُهَا: أَفْعَالٌ نَاقِصَةٌ تَرْفَعُ الإِسْمَ وَتَنْصِبُ الخَبَرَ',
            'وَهِيَ ثَلاَثَةَ عَشَرَ: كَانَ، أَصْبَحَ، أَمْسَى، أَضْحَى، ظَلَّ، بَاتَ، صَارَ',
            'وَلَيْسَ، مَا زَالَ، مَا انْفَكَّ، مَا فَتِئَ، مَا بَرِحَ، مَا دَامَ',
            'نَحْوُ: كَانَ زَيْدٌ قَائِمًا',
        ],
        translation: [
            'Kana wa akhawatiha: fi\'il naqishah yang men-rafa\' isim dan men-nashab khabar',
            'Ada 13: kana, ashbaha, amsa, adhha, zhalla, bata, shara',
            'Dan laisa, ma zala, manfakka, ma fati\'a, ma bariha, ma dama',
            'Seperti: kana zaidun qa\'iman (Zaid adalah berdiri)',
        ],
        footnotes: [
            '13 fi\'il kana wa akhawatiha',
            'Mengubah i\'rab mubtada-khabar',
        ]
    },
    {
        chapter: 8,
        title: 'Inna wa Akhawatiha',
        content: [
            'إِنَّ وَأَخَوَاتُهَا: حُرُوفٌ تَنْصِبُ الإِسْمَ وَتَرْفَعُ الخَبَرَ',
            'وَهِيَ سِتَّةٌ: إِنَّ، أَنَّ، لَكِنَّ، كَأَنَّ، لَيْتَ، لَعَلَّ',
            'إِنَّ وَأَنَّ: لِلتَّوْكِيدِ، لَكِنَّ: لِلِاسْتِدْرَاكِ، كَأَنَّ: لِلتَّشْبِيهِ',
            'لَيْتَ: لِلتَّمَنِّي، لَعَلَّ: لِلتَّرَجِّي',
        ],
        translation: [
            'Inna wa akhawatiha: huruf yang men-nashab isim dan men-rafa\' khabar',
            'Ada enam: inna, anna, lakinna, ka\'anna, laita, la\'alla',
            'Inna/anna: untuk ta\'kid, lakinna: istidrak, ka\'anna: tasybih',
            'Laita: untuk tamanni (angan-angan), la\'alla: untuk tarajji (harapan)',
        ],
        footnotes: [
            '6 huruf inna wa akhawatiha',
            'Kebalikan kana: nashab isim, rafa\' khabar',
        ]
    },
    {
        chapter: 9,
        title: 'Al-Mansyubat (Yang Manshub)',
        content: [
            'المَنْصُوبَاتُ خَمْسَةَ عَشَرَ: المَفْعُولُ بِهِ، المَفْعُولُ المُطْلَقُ، المَفْعُولُ فِيهِ',
            'وَالمَفْعُولُ لَهُ، وَالمَفْعُولُ مَعَهُ، وَالحَالُ، وَالتَّمْيِيزُ، وَالمُسْتَثْنَى',
            'وَالمُنَادَى، وَخَبَرُ كَانَ، وَاسْمُ إِنَّ، وَالتَّابِعُ لِلْمَنْصُوبِ',
            'فَالمَفْعُولُ بِهِ: مَا وَقَعَ عَلَيْهِ فِعْلُ الفَاعِلِ، نَحْوُ: ضَرَبْتُ زَيْدًا',
        ],
        translation: [
            '15 manshubat: maf\'ul bih, maf\'ul muthlaq, maf\'ul fih (zharf)',
            'Dan maf\'ul lahu, maf\'ul ma\'ahu, hal, tamyiz, mustatsna',
            'Dan munada, khabar kana, isim inna, dan tabi\' manshub',
            'Maf\'ul bih: yang terkena fi\'il fa\'il, seperti: dharabtu zaidan',
        ],
        footnotes: [
            '15 manshubat (yang di-nashab)',
            '5 macam maf\'ul dalam bahasa Arab',
        ]
    },
    {
        chapter: 10,
        title: 'Al-Majrurat (Yang Majrur)',
        content: [
            'المَجْرُورَاتُ ثَلاَثَةٌ: مَجْرُورٌ بِحَرْفِ الجَرِّ، وَمَجْرُورٌ بِالإِضَافَةِ، وَتَابِعٌ لِلْمَجْرُورِ',
            'وَحُرُوفُ الجَرِّ: مِنْ، إِلَى، عَنْ، عَلَى، فِي، رُبَّ، البَاءُ، الكَافُ، اللاَّمُ',
            'وَالوَاوُ، التَّاءُ، مُذْ، مُنْذُ، خَلاَ، عَدَا، حَاشَا، حَتَّى',
            'والمُضَافُ إِلَيْهِ: اِسْمٌ يُنْسَبُ إِلَيْهِ شَيْءٌ، نَحْوُ: كِتَابُ زَيْدٍ',
        ],
        translation: [
            'Majrur ada 3: majrur dengan huruf jar, dengan idhafah, dan tabi\' majrur',
            'Huruf jar: min, ila, \'an, \'ala, fi, rubba, ba, kaf, lam',
            'Dan waw, ta\', mudz, mundzu, khala, \'ada, hasya, hatta',
            'Mudhaf ilaih: isim yang dinisbahkan kepadanya, seperti: kitabu zaidin',
        ],
        footnotes: [
            'Majrur = di-jar dengan kasrah',
            'Huruf jar ada 17-20 menurut berbagai pendapat',
        ]
    },
    {
        chapter: 11,
        title: 'Al-Majzumat (Yang Majzum)',
        content: [
            'يُجْزَمُ الفِعْلُ المُضَارِعُ إِذَا سَبَقَهُ جَازِمٌ',
            'جَوَازِمُ فِعْلٍ وَاحِدٍ أَرْبَعَةٌ: لَمْ، لَمَّا، لاَمُ الأَمْرِ، لاَ النَّاهِيَةُ',
            'نَحْوُ: لَمْ يَقُمْ، لَمَّا يَقُمْ، لْيَقُمْ، لاَ تَقُمْ',
            'وَجَوَازِمُ فِعْلَيْنِ: إِنْ، مَنْ، مَا، مَهْمَا، مَتَى، أَيْنَ، حَيْثُمَا، أَيُّ',
        ],
        translation: [
            'Di-jazm fi\'il mudhari\' jika didahului jazim',
            'Jazim 1 fi\'il ada 4: lam, lamma, lam amar, la nahiyah',
            'Seperti: lam yaqum (tidak), lamma yaqum (belum), liyaqum (hendaklah), la taqum (jangan)',
            'Jazim 2 fi\'il: in, man, ma, mahma, mata, aina, haitsuma, ayyu',
        ],
        footnotes: [
            'Jazim 1 fi\'il = untuk nafyi atau thalab',
            'Jazim 2 fi\'il = adawat syarat (kata kondisi)',
        ]
    },
    {
        chapter: 12,
        title: 'At-Tawabi\' (Kata Pengikut)',
        content: [
            'التَّوَابِعُ أَرْبَعَةٌ: النَّعْتُ، العَطْفُ، التَّوْكِيدُ، البَدَلُ',
            'فَالنَّعْتُ: تَابِعٌ يُبَيِّنُ صِفَةَ مَتْبُوعِهِ',
            'وَالعَطْفُ: تَابِعٌ يَتَوَسَّطُ بَيْنَهُ وَبَيْنَ مَتْبُوعِهِ حَرْفُ عَطْفٍ',
            'حُرُوفُ العَطْفِ تِسْعَةٌ: الوَاوُ، الفَاءُ، ثُمَّ، أَوْ، أَمْ، لاَ، بَلْ، لَكِنْ، حَتَّى',
            'وَالتَّوْكِيدُ: تَابِعٌ يُقَرِّرُ مَتْبُوعَهُ، وَالبَدَلُ: تَابِعٌ يَحُلُّ مَحَلَّ مَتْبُوعِهِ',
        ],
        translation: [
            'Tawabi\' ada 4: na\'t, \'athaf, taukid, badal',
            'Na\'t: tabi\' yang menjelaskan sifat yang diikutinya',
            '\'Athaf: tabi\' yang di tengahnya ada huruf \'athaf',
            'Huruf \'athaf ada 9: waw, fa, tsumma, au, am, la, bal, lakin, hatta',
            'Taukid: tabi\' yang menegaskan, Badal: tabi\' yang mengganti',
        ],
        footnotes: [
            '4 tawabi\': na\'t, \'athaf, taukid, badal',
            'Semuanya mengikuti i\'rab kata sebelumnya',
        ]
    },
];
