// Matan Al-Bina' wal Asas - Complete Content
// Author: Abdullah bin Ahmad Ba'lawi
// Category: Sharaf (Morfologi Arab)
// Level: Pemula

export interface KitabContent {
    chapter: number;
    title: string;
    content: string[];
    translation?: string[];
    footnotes?: string[];
}

export const binaAsasContent: KitabContent[] = [
    {
        chapter: 1,
        title: 'Muqaddimah (Pendahuluan)',
        content: [
            'بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ',
            'الْحَمْدُ للهِ رَبِّ الْعَالَمِيْنَ، وَالصَّلاَةُ وَالسَّلاَمُ عَلَى أَشْرَفِ الْمُرْسَلِيْنَ',
            'وَبَعْدُ، فَهَذَا كِتَابٌ فِي عِلْمِ الصَّرْفِ، سَمَّيْتُهُ: البِنَاءُ وَالأَسَاسُ',
            'عِلْمُ الصَّرْفِ: هُوَ عِلْمٌ بِأُصُوْلٍ يُعْرَفُ بِهَا تَغْيِيْرُ بِنْيَةِ الْكَلِمَةِ لِغَيْرِ الإِعْرَابِ وَالْبِنَاءِ',
        ],
        translation: [
            'Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang',
            'Segala puji bagi Allah Tuhan semesta alam, shalawat dan salam atas Rasul yang paling mulia',
            'Wa ba\'du (selanjutnya), maka ini adalah kitab dalam ilmu Sharaf, aku namakan: Al-Bina\' wal Asas',
            'Ilmu Sharaf adalah: Ilmu tentang dasar-dasar yang dengannya diketahui perubahan bentuk kata bukan karena i\'rab dan bina\'',
        ],
        footnotes: [
            'Al-Bina\' wal Asas adalah kitab sharaf paling populer untuk pemula di Indonesia',
            'Pengarang: Abdullah bin Ahmad Ba\'lawi, ulama Hadramaut',
            'Ilmu Sharaf mempelajari perubahan bentuk kata (tashrif)',
            'Berbeda dengan Nahwu yang mempelajari i\'rab (perubahan akhir kata)',
        ]
    },
    {
        chapter: 2,
        title: 'Al-Af\'al (Pembagian Fi\'il)',
        content: [
            'الْفِعْلُ ثَلاَثَةُ أَقْسَامٍ: مَاضٍ، وَمُضَارِعٌ، وَأَمْرٌ',
            'فَالْمَاضِي: مَا دَلَّ عَلَى حُدُوْثِ شَيْءٍ قَبْلَ زَمَانِ التَّكَلُّمِ، نَحْوُ: ضَرَبَ، كَتَبَ',
            'وَالْمُضَارِعُ: مَا دَلَّ عَلَى حُدُوْثِ شَيْءٍ فِي زَمَانِ التَّكَلُّمِ أَوْ بَعْدَهُ، نَحْوُ: يَضْرِبُ، يَكْتُبُ',
            'وَالأَمْرُ: مَا دَلَّ عَلَى طَلَبِ حُدُوْثِ شَيْءٍ بَعْدَ زَمَانِ التَّكَلُّمِ، نَحْوُ: اِضْرِبْ، اُكْتُبْ',
        ],
        translation: [
            'Fi\'il terbagi menjadi tiga bagian: Madhi (lampau), Mudhari\' (sekarang/akan), dan Amar (perintah)',
            'Madhi: yang menunjukkan terjadinya sesuatu sebelum waktu berbicara, seperti: dharaba (telah memukul), kataba (telah menulis)',
            'Mudhari\': yang menunjukkan terjadinya sesuatu pada waktu berbicara atau setelahnya, seperti: yadhribu (sedang/akan memukul), yaktubu (sedang/akan menulis)',
            'Amar: yang menunjukkan permintaan terjadinya sesuatu setelah waktu berbicara, seperti: idhrib (Pukullah!), uktub (Tulislah!)',
        ],
        footnotes: [
            'Tiga pembagian fi\'il berdasarkan waktu kejadian',
            'Fi\'il Madhi: dharaba, nasara, kataba (bentuk dasar)',
            'Fi\'il Mudhari\': diawali huruf أَنَيْتُ (Hamzah, Nun, Ya\', Ta\')',
            'Fi\'il Amar: diambil dari mudhari\' dengan membuang huruf mudara\'ah',
        ]
    },
    {
        chapter: 3,
        title: 'Al-Mizan ash-Sharfi (Timbangan Sharaf)',
        content: [
            'أَصْلُ الْفِعْلِ ثَلاَثَةُ أَحْرُفٍ، وَمِيْزَانُهُ: فَعَلَ',
            'الْفَاءُ: لِلْحَرْفِ الأَوَّلِ، وَالْعَيْنُ: لِلْحَرْفِ الثَّانِي، وَاللاَّمُ: لِلْحَرْفِ الثَّالِثِ',
            'فَتَقُوْلُ فِي: ضَرَبَ = فَعَلَ، نَصَرَ = فَعَلَ، كَتَبَ = فَعَلَ',
            'وَفِي: يَضْرِبُ = يَفْعِلُ، يَنْصُرُ = يَفْعُلُ، يَكْتُبُ = يَفْعُلُ',
        ],
        translation: [
            'Asal fi\'il ada tiga huruf, dan timbangannya: fa\'ala',
            'Fa: untuk huruf pertama, \'Ain: untuk huruf kedua, Lam: untuk huruf ketiga',
            'Maka kamu katakan dalam: dharaba = fa\'ala, nashara = fa\'ala, kataba = fa\'ala',
            'Dan dalam: yadhribu = yaf\'ilu, yanshuru = yaf\'ulu, yaktubu = yaf\'ulu',
        ],
        footnotes: [
            'Mizan Sharfi (فَعَلَ) adalah timbangan untuk menganalisis kata Arab',
            'Fa (ف) = huruf pertama, \'Ain (ع) = huruf kedua, Lam (ل) = huruf ketiga',
            'Contoh: ضَرَبَ (Dha-Ra-Ba) = فَعَلَ (Fa-\'A-La)',
            'Setiap kata Arab bisa ditimbang dengan sistem ini',
        ]
    },
    {
        chapter: 4,
        title: 'Abwab Tsulasi Mujarrad (6 Pintu Fi\'il Tsulatsi)',
        content: [
            'الفِعْلُ المَاضِي الثُّلاَثِيُّ المُجَرَّدُ لَهُ سِتَّةُ أَبْوَابٍ:',
            'فَعَلَ يَفْعُلُ (بِفَتْحِ العَيْنِ فِي المَاضِي وَضَمِّهَا فِي المُضَارِعِ)، نَحْوُ: نَصَرَ يَنْصُرُ',
            'فَعَلَ يَفْعِلُ (بِفَتْحِ العَيْنِ فِي المَاضِي وَكَسْرِهَا فِي المُضَارِعِ)، نَحْوُ: ضَرَبَ يَضْرِبُ',
            'فَعَلَ يَفْعَلُ (بِفَتْحِ العَيْنِ فِيهِمَا)، نَحْوُ: فَتَحَ يَفْتَحُ',
            'فَعِلَ يَفْعَلُ (بِكَسْرِ العَيْنِ فِي المَاضِي وَفَتْحِهَا فِي المُضَارِعِ)، نَحْوُ: حَسِبَ يَحْسَبُ',
            'فَعُلَ يَفْعُلُ (بِضَمِّ العَيْنِ فِيهِمَا)، نَحْوُ: كَرُمَ يَكْرُمُ',
            'فَعِلَ يَفْعِلُ (بِكَسْرِ العَيْنِ فِيهِمَا)، نَحْوُ: حَسِبَ يَحْسِبُ',
        ],
        translation: [
            'Fi\'il Madhi Tsulasi Mujarrad memiliki 6 pintu (pola):',
            'fa\'ala yaf\'ulu (fathah \'ain di madhi, dhammah di mudhari\'), seperti: nashara yanshuru (menolong)',
            'fa\'ala yaf\'ilu (fathah \'ain di madhi, kasrah di mudhari\'), seperti: dharaba yadhribu (memukul)',
            'fa\'ala yaf\'alu (fathah \'ain di keduanya), seperti: fataha yaftahu (membuka)',
            'fa\'ila yaf\'alu (kasrah \'ain di madhi, fathah di mudhari\'), seperti: hasiba yahsabu (mengira)',
            'fa\'ula yaf\'ulu (dhammah \'ain di keduanya), seperti: karuma yakrumu (mulia)',
            'fa\'ila yaf\'ilu (kasrah \'ain di keduanya), seperti: hasiba yahsibu (mengira)',
        ],
        footnotes: [
            '6 pintu fi\'il tsulasi mujarrad (3 huruf asli tanpa tambahan)',
            'Pintu 1 (فَعَلَ يَفْعُلُ): paling banyak untuk fi\'il muta\'addi',
            'Pintu 2 (فَعَلَ يَفْعِلُ): sangat populer, dharaba yadhribu',
            'Pintu 3 (فَعَلَ يَفْعَلُ): untuk fi\'il huruf halqi',
            'Pintu 4 (فَعِلَ يَفْعَلُ): untuk sifat sementara',
            'Pintu 5 (فَعُلَ يَفْعُلُ): untuk sifat permanen',
            'Pintu 6 (فَعِلَ يَفْعِلُ): jarang digunakan',
        ]
    },
    {
        chapter: 5,
        title: 'Fi\'il Mazid (Fi\'il dengan Tambahan)',
        content: [
            'الفِعْلُ المَزِيْدُ: مَا زِيْدَ عَلَى حُرُوْفِهِ الأَصْلِيَّةِ حَرْفٌ أَوْ أَكْثَرُ',
            'وَحُرُوْفُ الزِّيَادَةِ عَشَرَةٌ، مَجْمُوْعَةٌ فِي قَوْلِكَ: سَأَلْتُمُوْنِيْهَا',
            'المَزِيْدُ الثُّلاَثِيُّ بِحَرْفٍ وَاحِدٍ ثَلاَثَةُ أَبْوَابٍ:',
            'أَفْعَلَ (بِهَمْزَةٍ فِي أَوَّلِهِ)، نَحْوُ: أَكْرَمَ يُكْرِمُ',
            'فَعَّلَ (بِتَضْعِيْفِ عَيْنِهِ)، نَحْوُ: عَلَّمَ يُعَلِّمُ',
            'فَاعَلَ (بِأَلِفٍ بَعْدَ الفَاءِ)، نَحْوُ: قَاتَلَ يُقَاتِلُ',
        ],
        translation: [
            'Fi\'il Mazid: yang ditambahkan pada huruf aslinya satu huruf atau lebih',
            'Huruf tambahan ada sepuluh, terkumpul dalam ucapanmu: sa\'altumūnīha',
            'Mazid tsulasi dengan satu huruf ada 3 pintu:',
            'af\'ala (dengan hamzah di awalnya), seperti: akrama yukrimu (memuliakan)',
            'fa\'\'ala (dengan tasydid \'ainnya), seperti: \'allama yu\'allimu (mengajar)',
            'fa\'ala (dengan alif setelah fa\'nya), seperti: qatala yuqatilu (memerangi)',
        ],
        footnotes: [
            'Fi\'il Mazid: fi\'il yang mendapat tambahan huruf',
            'Huruf ziyādah: س أ ل ت م و ن ي ه ا',
            'Mazid dengan 1 huruf ada 3, dengan 2 huruf ada 6, dengan 3 huruf ada 4',
            'Total 13 wazan fi\'il mazid tsulasi',
            'Setiap wazan memberikan makna tertentu',
        ]
    },
    {
        chapter: 6,
        title: 'Mashdar (Kata Dasar)',
        content: [
            'المَصْدَرُ: اِسْمٌ يَدُلُّ عَلَى الحَدَثِ المُجَرَّدِ عَنِ الزَّمَانِ',
            'مَصْدَرُ الثُّلاَثِيِّ المُجَرَّدِ سَمَاعِيٌّ، نَحْوُ: ضَرَبَ ضَرْبًا، نَصَرَ نَصْرًا',
            'وَمَصْدَرُ أَفْعَلَ: إِفْعَالٌ، نَحْوُ: أَكْرَمَ إِكْرَامًا',
            'وَمَصْدَرُ فَعَّلَ: تَفْعِيلٌ، نَحْوُ: عَلَّمَ تَعْلِيمًا',
            'وَمَصْدَرُ فَاعَلَ: مُفَاعَلَةٌ أَوْ فِعَالٌ، نَحْوُ: قَاتَلَ مُقَاتَلَةً أَوْ قِتَالاً',
        ],
        translation: [
            'Mashdar: kata benda yang menunjukkan peristiwa yang terlepas dari waktu',
            'Mashdar tsulasi mujarrad adalah sima\'i (harus dihafalkan), seperti: dharaba dharban, nashara nashran',
            'Mashdar af\'ala: if\'āl, seperti: akrama ikrāman (pemuliaan)',
            'Mashdar fa\'\'ala: taf\'īl, seperti: \'allama ta\'līman (pengajaran)',
            'Mashdar fa\'ala: mufā\'alah atau fi\'āl, seperti: qatala muqātalatan atau qitālan (peperangan)',
        ],
        footnotes: [
            'Mashdar = kata dasar/infinitif dalam bahasa Arab',
            'Mashdar tsulasi mujarrad harus dihafal satu per satu',
            'Mashdar mazid mengikuti pola tetap sesuai wazannya',
            'Contoh: dharaba (memukul) → dharban (pukulan)',
        ]
    },
    {
        chapter: 7,
        title: 'Isim Fa\'il (Kata Benda Pelaku)',
        content: [
            'اِسْمُ الفَاعِلِ: اِسْمٌ مُشْتَقٌّ يَدُلُّ عَلَى مَنْ قَامَ بِهِ الفِعْلُ',
            'اِسْمُ الفَاعِلِ مِنَ الثُّلاَثِيِّ عَلَى وَزْنِ: فَاعِلٌ، نَحْوُ: ضَارِبٌ، نَاصِرٌ، كَاتِبٌ',
            'وَمِنْ أَفْعَلَ عَلَى وَزْنِ: مُفْعِلٌ، نَحْوُ: مُكْرِمٌ',
            'وَمِنْ فَعَّلَ عَلَى وَزْنِ: مُفَعِّلٌ، نَحْوُ: مُعَلِّمٌ',
            'وَمِنْ فَاعَلَ عَلَى وَزْنِ: مُفَاعِلٌ، نَحْوُ: مُقَاتِلٌ',
        ],
        translation: [
            'Isim Fa\'il: kata benda turunan yang menunjukkan orang yang melakukan perbuatan',
            'Isim Fa\'il dari tsulasi dengan wazan: fā\'il, seperti: dhārib (pemukul), nāshir (penolong), kātib (penulis)',
            'Dan dari af\'ala dengan wazan: muf\'il, seperti: mukrim (yang memuliakan)',
            'Dan dari fa\'\'ala dengan wazan: mufa\'\'il, seperti: mu\'allim (pengajar/guru)',
            'Dan dari fā\'ala dengan wazan: mufā\'il, seperti: muqātil (pejuang)',
        ],
        footnotes: [
            'Isim Fa\'il = kata benda pelaku (active participle)',
            'Dari tsulasi: فَاعِل (fā\'il) - contoh: dhārib, kātib',
            'Dari mazid: semua diawali mim (م) dengan pola tertentu',
            'Contoh: dharaba → dhārib (pemukul), \'allama → mu\'allim (guru)',
        ]
    },
    {
        chapter: 8,
        title: 'Isim Maf\'ul (Kata Benda Objek)',
        content: [
            'اِسْمُ المَفْعُوْلِ: اِسْمٌ مُشْتَقٌّ يَدُلُّ عَلَى مَنْ وَقَعَ عَلَيْهِ الفِعْلُ',
            'اِسْمُ المَفْعُوْلِ مِنَ الثُّلاَثِيِّ عَلَى وَزْنِ: مَفْعُوْلٌ، نَحْوُ: مَضْرُوْبٌ، مَنْصُوْرٌ، مَكْتُوْبٌ',
            'وَمِنْ أَفْعَلَ عَلَى وَزْنِ: مُفْعَلٌ، نَحْوُ: مُكْرَمٌ',
            'وَمِنْ فَعَّلَ عَلَى وَزْنِ: مُفَعَّلٌ، نَحْوُ: مُعَلَّمٌ',
            'وَمِنْ فَاعَلَ عَلَى وَزْنِ: مُفَاعَلٌ، نَحْوُ: مُقَاتَلٌ',
        ],
        translation: [
            'Isim Maf\'ul: kata benda turunan yang menunjukkan orang yang dikenai perbuatan',
            'Isim Maf\'ul dari tsulasi dengan wazan: maf\'ūl, seperti: madhrūb (yang dipukul), manshūr (yang ditolong), maktūb (yang ditulis)',
            'Dan dari af\'ala dengan wazan: muf\'al, seperti: mukram (yang dimuliakan)',
            'Dan dari fa\'\'ala dengan wazan: mufa\'\'al, seperti: mu\'allam (yang diajarkan)',
            'Dan dari fā\'ala dengan wazan: mufā\'al, seperti: muqātal (yang diperangi)',
        ],
        footnotes: [
            'Isim Maf\'ul = kata benda objek (passive participle)',
            'Dari tsulasi: مَفْعُول (maf\'ūl) - contoh: madhrūb, maktūb',
            'Dari mazid: diawali mim dengan kasrah sebelum huruf akhir',
            'Contoh: dharaba → madhrūb (dipukul), \'allama → mu\'allam (diajarkan)',
        ]
    },
    {
        chapter: 9,
        title: 'Fi\'il Mu\'tal (Fi\'il dengan Huruf \'Illat)',
        content: [
            'الفِعْلُ المُعْتَلُّ: مَا كَانَ أَحَدُ حُرُوْفِهِ الأَصْلِيَّةِ حَرْفَ عِلَّةٍ (وَاوٌ أَوْ يَاءٌ أَوْ أَلِفٌ)',
            'وَهُوَ أَرْبَعَةُ أَقْسَامٍ:',
            'المِثَالُ: مَا كَانَتْ فَاؤُهُ حَرْفَ عِلَّةٍ، نَحْوُ: وَعَدَ، وَجَدَ، يَبِسَ',
            'الأَجْوَفُ: مَا كَانَتْ عَيْنُهُ حَرْفَ عِلَّةٍ، نَحْوُ: قَالَ، بَاعَ، صَامَ',
            'النَّاقِصُ: مَا كَانَتْ لاَمُهُ حَرْفَ عِلَّةٍ، نَحْوُ: رَمَى، دَعَا، سَعَى',
            'اللَّفِيْفُ: مَا كَانَ فِيْهِ حَرْفَا عِلَّةٍ، نَحْوُ: وَفَى، رَوَى، وَقَى',
        ],
        translation: [
            'Fi\'il Mu\'tal: yang salah satu huruf aslinya adalah huruf \'illat (waw, ya\', atau alif)',
            'Dan ia terbagi 4 bagian:',
            'Mitsal: yang fa\'nya huruf \'illat, seperti: wa\'ada (berjanji), wajada (mendapat), yabisa (kering)',
            'Ajwaf: yang \'ainnya huruf \'illat, seperti: qāla (berkata), bā\'a (menjual), shāma (berpuasa)',
            'Naqish: yang lamnya huruf \'illat, seperti: ramā (melempar), da\'ā (menyeru), sa\'ā (berusaha)',
            'Lafif: yang memiliki dua huruf \'illat, seperti: wafā (menepati), rawā (meriwayatkan), waqā (melindungi)',
        ],
        footnotes: [
            'Fi\'il Mu\'tal: fi\'il yang ada huruf \'illatnya (و، ي، ا)',
            'Mitsal: di awal (fa\'), Ajwaf: di tengah (\'ain), Naqish: di akhir (lam)',
            'Lafif: ada 2 huruf \'illat (lafif mafrūq/maqrūn)',
            'Fi\'il mu\'tal memiliki aturan tashrif khusus',
        ]
    },
    {
        chapter: 10,
        title: 'Tashrif (Konjugasi)',
        content: [
            'التَّصْرِيْفُ: تَحْوِيْلُ الكَلِمَةِ إِلَى صُوَرٍ مُخْتَلِفَةٍ لِمَعَانٍ مَقْصُوْدَةٍ',
            'وَهُوَ قِسْمَانِ: تَصْرِيْفٌ لُغَوِيٌّ، وَتَصْرِيْفٌ اصْطِلاَحِيٌّ',
            'التَّصْرِيْفُ اللُّغَوِيُّ (الصَّرْفُ الكَبِيْرُ): تَحْوِيْلُ الأَصْلِ الوَاحِدِ إِلَى أَبْنِيَةٍ مُخْتَلِفَةٍ',
            'نَحْوُ: ضَرَبَ، يَضْرِبُ، اِضْرِبْ، ضَارِبٌ، مَضْرُوْبٌ، ضَرْبٌ',
            'التَّصْرِيْفُ الاصْطِلاَحِيُّ (الصَّرْفُ الصَّغِيْرُ): تَحْوِيْلُ الكَلِمَةِ مَعَ الضَّمَائِرِ',
            'نَحْوُ: ضَرَبَ، ضَرَبَا، ضَرَبُوْا، ضَرَبَتْ، ضَرَبَتَا، ضَرَبْنَ',
        ],
        translation: [
            'Tashrif: mengubah kata ke berbagai bentuk untuk makna-makna yang dikehendaki',
            'Dan ia terbagi dua: tashrif lughawi dan tashrif ishthilahi',
            'Tashrif lughawi (sharaf kabir): mengubah satu asal kata ke berbagai bentuk yang berbeda',
            'Seperti: dharaba, yadhribu, idhrib, dhārib, madhrūb, dharb',
            'Tashrif ishthilahi (sharaf shaghir): mengubah kata dengan dhamir-dhamir',
            'Seperti: dharaba (dia lk tunggal), dharabā (mereka lk berdua), dharabū (mereka lk jamak), dharabat (dia pr), dharabatā (mereka pr berdua), dharabna (mereka pr jamak)',
        ],
        footnotes: [
            'Tashrif = konjugasi/perubahan bentuk kata',
            'Tashrif lughawi: dharaba → yadhribu → idhrib → dhārib → madhrūb',
            'Tashrif ishthilahi: perubahan dengan dhamir (aku, kamu, dia, dll)',
            'Kedua jenis tashrif ini sangat penting dikuasai',
            'Dengan menguasai tashrif, kita bisa membuat ribuan kata dari satu akar',
        ]
    },
];
