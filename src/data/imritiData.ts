// Nadzam Al-Imriti - Complete Content
// Author: Syarafuddin Yahya Al-Imriti

export interface KitabContent {
    chapter: number;
    title: string;
    content: string[];
    translation: string[];
    footnotes: string[];
}

export const imritiContent: KitabContent[] = [
    {
        chapter: 1,
        title: 'Muqaddimah (Pembukaan)',
        content: [
            'الْحَمْدُ للهِ الَّذِيْ قَدْ وَفَّقَا ۞ لِلْعِلْمِ خَيْرَ خَلْقِهِ وَلِلتُّقَى',
            'حَتَّى نَحَتْ قُلُوْبُهُمْ لِنَحْوِهِ ۞ فَمِنْ عَظِيْمِ شَأْنِهِ لَمْ تَحْوِهِ',
            'فَأُشْرِبَتْ مَعْنَى ضَمِيْرِ الشَّانِ ۞ فَأَعْرَبَتْ فِي الْحَانِ بِاْلأَلْحَانِ',
            'ثُمَّ الصَّلاَةُ مَعَ سَلاَمٍ لاَئِقِ ۞ عَلَى النَّبِيِّ أَفْصَحِ الْخَلاَئِقِ',
            'مُحَمَّدٍ وَاْلآلِ وَاْلأَصْحَابِ ۞ مَنْ أَتْقَنُوا الْقُرْآنَ بِاْلإِعْرَابِ',
            'وَبَعْدُ فَاعْلَمْ أَنَّهُ لَمَّا اقْتَصَرْ ۞ جُلُّ الْوَرَى عَلَى الْكَلاَمِ الْمُخْتَصَرْ',
        ],
        translation: [
            'Segala puji bagi Allah yang telah memberi taufik kepada sebaik-baik makhluk-Nya untuk ilmu dan takwa',
            'Sehingga condong hati mereka kepada nahwu, karena keagungan kedudukannya mereka tidak mampu melingkupinya',
            'Maka mereka dijejali makna dhamir asy-sya\'n (kata ganti urusan), lalu mereka meng-i\'rab dengan irama',
            'Kemudian shalawat dengan salam yang layak kepada Nabi yang paling fasih di antara makhluk',
            'Muhammad, keluarga dan para sahabat yang telah menguasai Al-Qur\'an dengan i\'rab',
            'Wa ba\'du (selanjutnya) ketahuilah bahwa kebanyakan manusia hanya membatasi pada kalam yang ringkas',
        ],
        footnotes: [
            'Nadzam Al-Imriti adalah syair nahwu karya Syaikh Syarafuddin Yahya Al-Imriti',
            'Kitab ini merupakan nazham (syair) dari kitab Al-Ajurrumiyyah',
            'Dhamir asy-sya\'n: kata ganti yang menunjukkan urusan/perkara',
            'Pengarang memulai dengan pujian kepada Allah dan shalawat kepada Nabi Muhammad',
        ]
    },
    {
        chapter: 2,
        title: 'Bab al-Kalam (Kalam dan Pembagiannya)',
        content: [
            'كَلاَمُهُمْ لَفْظٌ مُفِيْدٌ مُسْنَدُ ۞ وَالْكَلِمَةُ اللَّفْظُ الْمُفِيْدُ الْمُفْرَدُ',
            'لاِسْمٍ وَفِعْلٍ ثُمَّ حَرْفٍ تَنْقَسِمْ ۞ وَهَذِهِ ثَلاَثُهَا هِيَ الْكَلِمْ',
            'وَالْقَوْلُ لَفْظٌ قَدْ أَفَادَ مُطْلَقَا ۞ كَقُمْ وَقَدْ وَإِنَّ زَيْدًا ارْتَقَى',
            'فَاَلاسْمُ بِالتَّنْوِيْنِ وَالْخَفْضِ عُرِفْ ۞ وَحَرْفِ خَفْضٍ وَبِلاَمٍ وَأَلِفْ',
        ],
        translation: [
            'Kalam mereka adalah lafaz yang bermanfaat dan disandarkan. Dan kalimah adalah lafaz yang bermanfaat yang mufrad',
            'Terbagi menjadi isim, fi\'il, dan huruf. Dan tiga ini adalah kalim',
            'Dan qaul adalah lafaz yang memberi faedah secara mutlak, seperti qum, qad, dan inna zaidan irtaqa',
            'Maka isim dikenali dengan tanwin, khafdh, huruf khafdh, lam, dan alif',
        ],
        footnotes: [
            'Kalam: kalimat sempurna yang memberi faedah',
            'Kalimah: kata tunggal; Kalim: 3 kata atau lebih',
            'Tiga jenis kata: isim (kata benda), fi\'il (kata kerja), huruf (partikel)',
            'Tanda-tanda isim: tanwin, kasrah (khafdh), huruf jar, al, lam ta\'rif',
        ]
    },
    {
        chapter: 3,
        title: 'Bab al-I\'rab (I\'rab)',
        content: [
            'إِعْرَابُهُمْ تَغْيِيْرُ آخِرِ الْكَلِمْ ۞ تَقْدِيْرًا اوْ لَفْظًا لِعَامِلٍ عُلِمْ',
            'أَقْسَامُهُ أَرْبَعَةٌ فَلْتُعْتَبَرْ ۞ رَفْعٌ وَنَصْبٌ وَكَذَا جَزْمٌ وَجَرْ',
            'وَالْكُلُّ غَيْرُ الْجَزْمِ فِي اْلأَسْمَا يَقَعْ ۞ وَكُلُّهَا فِي الْفِعْلِ وَالْخَفْضُ امْتَنَعْ',
        ],
        translation: [
            'I\'rab mereka adalah perubahan akhir kalam, secara taqdir atau lafaz karena \'amil yang diketahui',
            'Pembagiannya ada empat, maka perhatikanlah: rafa\', nashb, jazm, dan jar',
            'Dan semuanya kecuali jazm terjadi pada isim. Dan semuanya terjadi pada fi\'il kecuali khafdh',
        ],
        footnotes: [
            'I\'rab: perubahan harakat akhir kata karena pengaruh \'amil',
            'Empat jenis i\'rab: rafa\' (dhammah), nashb (fathah), jar/khafdh (kasrah), jazm (sukun)',
            'Isim: bisa rafa\', nashb, jar; Fi\'il: bisa rafa\', nashb, jazm',
            '\'Amil: kata yang mempengaruhi i\'rab kata lain',
        ]
    },
    {
        chapter: 4,
        title: 'Bab \'Alamat al-I\'rab (Tanda-tanda I\'rab)',
        content: [
            'لِلرَّفْعِ مِنْهَا ضَمَّةٌ وَاوٌ أَلِفْ ۞ كَذَاكَ نُوْنٌ ثَابِتٌ لاَ مُنْحَذِفْ',
            'فَالضَّمُّ فِي اسْمٍ مُفْرَدٍ كَأَحْمَدَا ۞ وَجَمْعِ تَكْسِيْرٍ كَجَاءَ اْلأَعْبُدَا',
            'وَالْوَاوُ فِي جَمْعِ الذُّكُوْرِ السَّالِمِ ۞ كَالصَّالِحُوْنَ هُمُ أُوْلُو الْمَكَارِمِ',
        ],
        translation: [
            'Untuk rafa\' darinya adalah dhammah, waw, alif, dan juga nun yang tetap tidak gugur',
            'Maka dhammah pada isim mufrad seperti Ahmad, dan jam\' taksir seperti jaa\'a al-a\'budu',
            'Dan waw pada jam\' mudzakkar salim seperti ash-shalihuna hum ulul makarim',
        ],
        footnotes: [
            'Tanda rafa\': dhammah (مُ), waw (و), alif (ا), nun tetap',
            'Dhammah: untuk mufrad dan jam\' taksir',
            'Waw: untuk jam\' mudzakkar salim dan asma\' khamsah',
            'Alif: untuk mutsanna (dual)',
        ]
    },
    {
        chapter: 5,
        title: 'Bab an-Nashb (Nashab)',
        content: [
            'لِلنَّصْبِ خَمْسٌ وَهْيَ فَتْحَةٌ وَأَلِفْ ۞ كَسْرٌ وَيَاءٌ ثُمَّ نُوْنٌ تَنْحَذِفْ',
            'فَانْصِبْ بِفَتْحٍ مَا بِضَمٍّ قَدْ رُفِعْ ۞ إِلاَّ كَهِنْدَاتٍ فَفَتْحُهُ مُنِعْ',
        ],
        translation: [
            'Untuk nashb ada lima yaitu fathah, alif, kasrah, ya\', kemudian nun yang gugur',
            'Maka nashab dengan fathah apa yang telah dirafa\' dengan dhammah, kecuali seperti hindat maka fatahnya dicegah',
        ],
        footnotes: [
            'Tanda nashb: fathah (َ), alif, kasrah, ya\', nun gugur',
            'Fathah: untuk mufrad dan jam\' taksir',
            'Alif: untuk asma\' khamsah',
            'Kasrah: untuk jam\' mu\'annats salim',
        ]
    },
    {
        chapter: 6,
        title: 'Bab al-Khafdh/Jar (Khafdh)',
        content: [
            'عَلاَمَةُ الْخَفْضِ الَّتِي بِهَا انْضَبَطْ ۞ كَسْرٌ وَيَاءٌ ثُمَّ فَتْحَةٌ فَقَطْ',
            'فَاخْفِضْ بِكَسْرٍ مَا مِنَ اْلأَسْمَا عُرِفْ ۞ فِي رَفْعِهِ بِالضَّمِّ حَيْثُ لاَ نْصَرَفْ',
        ],
        translation: [
            'Tanda khafdh yang dengannya teratur adalah kasrah, ya\', kemudian fathah saja',
            'Maka khafdh dengan kasrah apa dari isim-isim yang dikenal rafa\'nya dengan dhammah di mana tidak bersharaf',
        ],
        footnotes: [
            'Tanda jar/khafdh: kasrah (ِ), ya\' (ي), fathah',
            'Kasrah: untuk isim munsharif',
            'Ya\': untuk mutsanna, jam\' mudzakkar salim, asma\' khamsah',
            'Fathah: untuk isim ghairu munsh arif (tidak bersharaf)',
        ]
    },
    {
        chapter: 7,
        title: 'Bab al-Jazm (Jazm)',
        content: [
            'وَالْجَزْمُ فِي اْلأَفْعَالِ بِالسُّكُوْنِ ۞ أَوْ حَذْفِ حَرْفِ عِلَّةٍ أَوْ نُوْنِ',
            'فَحَذْفُ نُوْنِ الرَّفْعِ قَطْعًا يَلْزَمُ ۞ فِي الْخَمْسَةِ اْلأَفْعَالِ حَيْثُ تُجْزَمُ',
        ],
        translation: [
            'Dan jazm pada af\'al dengan sukun, atau hadhf huruf \'illat atau nun',
            'Maka hadhf nun rafa\' pasti wajib pada af\'al khamsah ketika di-jazm',
        ],
        footnotes: [
            'Jazm: tanda untuk fi\'il mudhari\' yang di-jazm',
            'Tanda jazm: sukun, hadhf huruf \'illat, hadhf nun',
            'Sukun: untuk fi\'il shahih',
            'Af\'al khamsah: yaf\'alani, taf\'alani, yaf\'aluna, taf\'aluna, taf\'alna',
        ]
    },
    {
        chapter: 8,
        title: 'Bab an-Nakirah wal Ma\'rifah',
        content: [
            'وَإِنْ تُرِدْ تَعْرِيْفَ الاِسْمِ النَّكِرَهْ ۞ فَهُوَ الَّذِي يَقْبَلُ أَلْ مُؤَثِّرَهْ',
            'وَغَيْرُهُ الْمَعَارِفُ احْصُرْ حَصْرَا ۞ مُضْمَرٌ وَالْعَلَمُ اسْمُ إِشَارَةْ',
        ],
        translation: [
            'Dan jika kamu ingin ta\'rif isim nakirah, maka ia yang menerima al yang berpengaruh',
            'Dan selainnya adalah ma\'arif yang terbatas: mudhamar, \'alam, isim isyarah',
        ],
        footnotes: [
            'Nakirah: isim yang tidak tertentu',
            'Ma\'rifah: isim yang tertentu, ada 7 jenis',
            '7 ma\'rifah: dhamir, \'alam, isim isyarah, isim maushul, ber-al, mudhaf ke ma\'rifah, munada',
            'Contoh nakirah: rajulun; ma\'rifah: ar-rajulu',
        ]
    },
    {
        chapter: 9,
        title: 'Bab al-Af\'al (Fi\'il)',
        content: [
            'أَفْعَالُهُمْ ثَلاَثَةٌ فَيَبْتَدِي ۞ فِي قِسْمَةِ اْلأَفْعَالِ بِالْمَاضِي الَّذِي',
            'عَلاَمَةُ الْمُضِيِّ فِيْهِ تَنْجَلِي ۞ وَهْيَ لُحُوْقُ تَاءِ تَأْنِيْثٍ وَلِي',
            'أَمَّا الْمُضَارِعُ الَّذِي فِي صَدْرِهِ ۞ إِحْدَى الزَّوَائِدِ اْلأَرْبَعِ فَادْرِهِ',
        ],
        translation: [
            'Af\'al mereka ada tiga, maka mulailah dalam pembagian af\'al dengan madhi yang',
            'Tanda lampau padanya jelas, yaitu melekatnya ta\' ta\'nits yang mengikuti',
            'Adapun mudhari\' yang pada awalnya salah satu zawaid al-arba\' maka ketahuilah',
        ],
        footnotes: [
            'Tiga fi\'il: madhi, mudhari\', amar',
            'Tanda madhi: menerima ta\' ta\'nits (َتْ)',
            'Tanda mudhari\': zawaid al-arba\' (أَنَيْتُ)',
            'Amar: diambil dari mudhari\' dengan membuang huruf mudara\'ah',
        ]
    },
    {
        chapter: 10,
        title: 'Bab Marfu\'at al-Asma\' (Isim-isim Marfu\')',
        content: [
            'مَرْفُوْعُ اْلاَسْمِ سَبْعَةٌ نَعُدُّهَا ۞ فَاعِلٌ وَالْمَفْعُوْلُ الَّذِي لَمْ يُسَمَّ فَاعِلُهُ',
            'وَالْمُبْتَدَأُ وَخَبَرُهُ وَاسْمُ كَانَ وَأَخَوَاتِهَا ۞ وَخَبَرُ إِنَّ وَأَخَوَاتِهَا',
        ],
        translation: [
            'Marfu\' isim ada tujuh kita hitung: fa\'il dan maf\'ul yang tidak disebut fa\'ilnya',
            'Dan mubtada\', khabarnya, isim kana dan saudara-saudaranya, dan khabar inna dan saudara-saudaranya',
        ],
        footnotes: [
            '7 marfu\'at: fa\'il, na\'ib fa\'il, mubtada\', khabar, isim kana, khabar inna, tabi\'',
            'Fa\'il: pelaku perbuatan',
            'Na\'ib fa\'il: pengganti fa\'il dalam kalimat pasif',
            'Tabi\': na\'t, \'athf, taukid, badal',
        ]
    },
    {
        chapter: 11,
        title: 'Bab al-Fa\'il (Fa\'il)',
        content: [
            'الْفَاعِلُ ارْفَعْ وَهُوَ مَا قَدْ أُسْنِدَا ۞ إِلَيْهِ فِعْلٌ قَبْلَهُ قَدْ وُجِدَا',
            'وَظَاهِرًا يَأْتِي وَيَأْتِي مُضْمَرَا ۞ كَاصْطَادَ زَيْدٌ وَاشْتَرَيْتُ أَعْفُرَا',
        ],
        translation: [
            'Fa\'il di-rafa\', dan ia adalah apa yang disandarkan kepadanya fi\'il yang sebelumnya telah ada',
            'Dan datang zhahir dan datang mudhamar, seperti ishthada zaidun wa-syaraitu a\'fura',
        ],
        footnotes: [
            'Fa\'il: isim marfu\' yang disandarkan kepadanya fi\'il',
            'Fa\'il bisa zhahir (jelas) atau mudhamar (dhamir)',
            'Contoh zhahir: jaa\'a zaidun',
            'Contoh mudhamar: jaa\'a (dhamir mustatar: huwa)',
        ]
    },
    {
        chapter: 12,
        title: 'Bab an-Na\'ib \'an al-Fa\'il',
        content: [
            'إِذَا حَذَفْتَ فِي الْكَلاَمِ فَاعِلاَ ۞ مُخْتَصِرًا أَوْ مُبْهِمًا أَوْ جَاهِلاَ',
            'فَأَوْجِبِ التَّأْخِيْرَ لِلْمَفْعُوْلِ بِهْ ۞ وَالرَّفْعَ حَيْثُ نَابَ عَنْهُ فَانْتَبِهْ',
        ],
        translation: [
            'Jika kamu menghapus fa\'il dalam kalam untuk ringkas, atau samar, atau tidak tahu',
            'Maka wajibkan ta\'khir untuk maf\'ul bih dan rafa\' ketika menggantikannya maka perhatikan',
        ],
        footnotes: [
            'Na\'ib fa\'il: pengganti fa\'il dalam fi\'il majhul (pasif)',
            'Tiga alasan hapus fa\'il: ringkas, samar/tidak penting, tidak tahu',
            'Maf\'ul bih menjadi na\'ib fa\'il dan di-rafa\'',
            'Contoh: dharaba zaidun \'amran → dhuriba \'amrun',
        ]
    },
    {
        chapter: 13,
        title: 'Bab al-Mubtada\' wal Khabar',
        content: [
            'الْمُبْتَدَا اسْمٌ مِنْ عَوَامِلٍ سَلِمْ ۞ لَفْظِيَّةٍ وَهْوَ بِرَفْعٍ قَدْ وُسِمْ',
            'وَالْخَبَرُ اْلاِسْمُ الَّذِي قَدْ أُسْنِدَا ۞ إِلَيْهِ وَارْتِفَاعُهُ الْزَمْ أَبَدَا',
        ],
        translation: [
            'Mubtada\' adalah isim yang selamat dari \'awamil lafzhiyyah, dan ia ditandai dengan rafa\'',
            'Dan khabar adalah isim yang disandarkan kepadanya, dan rafa\'nya wajib selamanya',
        ],
        footnotes: [
            'Mubtada\': isim marfu\' yang bebas dari \'amil lafzhi',
            'Khabar: isim marfu\' yang memberi keterangan tentang mubtada\'',
            'Jumlah ismiyyah: mubtada\' + khabar',
            'Contoh: muhammadun thaalibun (Muhammad seorang pelajar)',
        ]
    },
    {
        chapter: 14,
        title: 'Bab Kana wa Akhawatiha',
        content: [
            'وَرَفْعُكَ اْلاِسْمَ وَنَصْبُكَ الْخَبَرْ ۞ بِهَذِهِ اْلأَفْعَالِ حُكْمٌ مُعْتَبَرْ',
            'كَانَ وَأَمْسَى ظَلَّ بَاتَ أَصْبَحَا ۞ أَضْحَى وَصَارَ لَيْسَ مَعْ مَا بَرِحَا',
        ],
        translation: [
            'Dan rafa\'mu isim dan nashbmu khabar dengan af\'al ini adalah hukum yang mu\'tabar',
            'Kana, amsa, zhalla, bata, ashbaha, adhha, shara, laisa dengan ma bariha',
        ],
        footnotes: [
            'Kana wa akhawatiha: 13 fi\'il yang men-rafa\' isim dan men-nashab khabar',
            'Kana: adalah; ashbaha: menjadi di pagi; amsa: menjadi di sore',
            'Laisa: bukan; ma zala: masih',
            'Contoh: kana muhammadun thaaliban (Muhammad adalah pelajar)',
        ]
    },
    {
        chapter: 15,
        title: 'Bab Inna wa Akhawatiha',
        content: [
            'عَمَلُ كَانَ عَكْسُهُ لإِنَّ أَنْ ۞ لَكِنَّ لَيْتَ وَلَعَلَّ وَكَأَنْ',
            'فَتَقُوْلُ إِنَّ مَالِكًا لَعَالِمُ ۞ وَمِثْلُهُ لَيْتَ الْحَبِيْبَ قَادِمُ',
        ],
        translation: [
            'Amal kana kebalikannya untuk inna, anna, lakinna, laita, la\'alla, dan ka\'anna',
            'Maka katakan inna malikan la-\'alimun, dan sepertinya laita al-habiba qadimun',
        ],
        footnotes: [
            'Inna wa akhawatiha: 6 huruf yang men-nashab isim dan men-rafa\' khabar',
            'Inna/anna: sesungguhnya; ka\'anna: seolah-olah',
            'Lakinna: tetapi; laita: andai; la\'alla: mudah-mudahan',
            'Contoh: inna zaidan qaa\'imun (sesungguhnya Zaid berdiri)',
        ]
    },
    {
        chapter: 16,
        title: 'Bab Zhanna wa Akhawatiha',
        content: [
            'انْصِبْ بِظَنَّ الْمُبْتَدَا مَعَ الْخَبَرْ ۞ وَكُلِّ فِعْلٍ بَعْدَهَا قَدْ اُعْتُبِرْ',
            'كَخِلْتُ حَسِبْتُ وَزَعَمْتُ رَأَى ۞ عَلِمْتُ وَوَجَدْتُ وَاتَّخَذَ جَعَلَا',
        ],
        translation: [
            'Nashab dengan zhanna mubtada\' bersama khabar, dan semua fi\'il setelahnya yang mu\'tabar',
            'Seperti khiltu, hasibtu, za\'amtu, ra\'a, \'alimtu, wajadtu, ittakhadza, ja\'ala',
        ],
        footnotes: [
            'Zhanna wa akhawatiha: fi\'il yang men-nashab mubtada\' dan khabar',
            'Zhanantu: kukira; \'alimtu: kutahu; wajadtu: kudapati',
            'Contoh: zhanantu zaidan qaa\'iman (kukira Zaid berdiri)',
            'Ada 7 fi\'il dalam kelompok ini',
        ]
    },
    {
        chapter: 17,
        title: 'Bab an-Na\'t (Sifat)',
        content: [
            'النَّعْتُ قَدْ قَالَ ذَوُوْا اْلأَلْبَابِ ۞ يَتْبَعُ لِلْمَنْعُوْتِ فِي اْلإِعْرَابِ',
            'كَذَاكَ فِي التَّعْرِيْفِ وَالتَّنْكِيْرِ ۞ كَجَاءَ زَيْدٌ صَاحِبُ اْلأَمِيْرِ',
        ],
        translation: [
            'Na\'t telah dikatakan oleh ulil albab: mengikuti man\'ut dalam i\'rab',
            'Demikian juga dalam ta\'rif dan tankir, seperti jaa\'a zaidun shahibu al-amiri',
        ],
        footnotes: [
            'Na\'t (sifat): tabi\' yang mengikuti man\'ut (mausuf)',
            'Na\'t mengikuti man\'ut dalam 10 hal: i\'rab, ta\'rif/tankir, tadzki r/ta\'nits, dll',
            'Contoh: jaa\'a rajulun kariimun (datang lelaki yang mulia)',
            'Na\'t bisa hakiki (sifat sejati) atau sababi (sifat yang berhubungan)',
        ]
    },
    {
        chapter: 18,
        title: 'Bab al-\'Athf (Athaf)',
        content: [
            'هَذَا وَإِنَّ الْعَطْفَ أَيْضًا تَابِعُ ۞ حُرُوْفُهُ عَشَرَةٌ يَا سَامِعُ',
            'الْوَاوُ وَالْفَا ثُمَّ أَوْ إِمَّا وَبَلْ ۞ لَكِنْ وَحَتَّى لاَ وَأَمْ فَاجْهَدْ تَنَلْ',
        ],
        translation: [
            'Ini dan sesungguhnya \'athf juga tabi\', hurufnya sepuluh wahai pendengar',
            'Waw, fa, tsumma, au, imma, bal, lakin, hatta, la, am, maka bersungguh-sungguhlah niscaya kamu mendapat',
        ],
        footnotes: [
            '\'Athf: menghubungkan dua kata dengan huruf \'athf',
            '9 huruf \'athf: waw (dan), fa (lalu), tsumma (kemudian), au (atau), am, bal, lakin, la, hatta',
            'Ma\'thuf mengikuti i\'rab ma\'thuf \'alaih',
            'Contoh: jaa\'a muhammadun wa \'aliyyun',
        ]
    },
    {
        chapter: 19,
        title: 'Bab at-Taukid (Penegasan)',
        content: [
            'وَيَتْبَعُ الْمُؤَكَّدَ التَّوْكِيْدُ فِي ۞ إِعْرَابِهِ وَالتَّعْرِيْفِ فَاعْرِفْ وَاقْتَفِ',
            'وَلَفْظُهُ الْمَشْهُوْرُ فِيْهِ أَرْبَعُ ۞ النَّفْسُ وَالْعَيْنُ وَكُلٌّ أَجْمَعُ',
        ],
        translation: [
            'Dan mengikuti mu\'akkad taukid dalam i\'rabnya dan ta\'rif maka ketahuilah dan ikutilah',
            'Dan lafaznya yang masyhur padanya ada empat: an-nafs, al-\'ain, kull, ajma\'',
        ],
        footnotes: [
            'Taukid: tabi\' yang menegaskan mu\'akkad',
            'Lafaz taukid: nafs, \'ain, kull, ajma\', akta\', absha\', abtha\'',
            'Contoh: jaa\'a zaidun nafsuhu (Zaid sendiri datang)',
            'Taukid mengikuti i\'rab dan ta\'rif mu\'akkad',
        ]
    },
    {
        chapter: 20,
        title: 'Bab al-Badal (Pengganti)',
        content: [
            'إِذَا اسْمٌ ابْدِلَ مِنَ اسْمٍ يَنْحَلُّ ۞ إِعْرَابَهُ وَالْفِعْلُ أَيْضًا يُبْدَلُ',
            'أَقْسَامُهُ أَرْبَعَةٌ فَإِنْ تُرِدْ ۞ إِحْصَاءَهَا فَاسْمَعْ لِقَوْلِي تَسْتَفِدْ',
        ],
        translation: [
            'Jika isim diganti dari isim, terpecahlah i\'rabnya, dan fi\'il juga diganti',
            'Pembagiannya ada empat, maka jika kamu ingin menghitungnya dengarkanlah ucapanku niscaya kamu mendapat faedah',
        ],
        footnotes: [
            'Badal: tabi\' yang menggantikan mubdal minhu',
            '4 jenis badal: kull min kull, ba\'dh min kull, isytimal, mubayyin',
            'Badal kull: zaidun akhuuka (Zaid kakakmu)',
            'Badal mengambil i\'rab mubdal minhu',
        ]
    },
    {
        chapter: 21,
        title: 'Bab Manshubat al-Asma\' (Isim-isim Manshub)',
        content: [
            'مَنْصُوْبُ اْلاِسْمِ عَشْرَةٌ وَخَمْسَةْ ۞ وَهْيَ الْمَفْعُوْلُ بِهِ وَالْمَصْدَرْ',
            'وَظَرْفُ وَقْتٍ مَعَ ظَرْفِ الْمَكَانْ ۞ وَالْحَالُ وَالتَّمْيِيْزُ وَالْمُسْتَثْنَى',
        ],
        translation: [
            'Manshub isim ada lima belas, yaitu maf\'ul bih dan mashdar',
            'Dan zharf waktu dengan zharf makan, hal, tamyiz, dan mustatsna',
        ],
        footnotes: [
            '15 manshubat: maf\'ul bih, mashdar, zharf zaman, zharf makan, hal',
            'Tamyiz, mustatsna, isim la, munada, maf\'ul lahu, maf\'ul ma\'ahu',
            'Khabar kana, isim inna, tabi\' manshub',
            'Semuanya di-nashab dengan fathah atau tanda lain',
        ]
    },
    {
        chapter: 22,
        title: 'Bab al-Maf\'ul bih',
        content: [
            'مَهْمَا تَرَ اسْمًا وَقَعَ الْفِعْلُ بِهِ ۞ فَذَاكَ مَفْعُوْلٌ فَقُلْ بِنَصْبِهِ',
            'كَمِثْلِ زُرْتُ الْعَالِمَ اْلأَدِيْبَا ۞ وَقَدْ رَكِبْتُ الْفَرَسَ النَّجِيْبَا',
        ],
        translation: [
            'Kapan pun kamu lihat isim yang fi\'il jatuh padanya, maka itu maf\'ul maka katakan dengan nashbnya',
            'Seperti zurtu al-\'alima al-adiba, dan qad rakibtu al-farasa an-najiba',
        ],
        footnotes: [
            'Maf\'ul bih: isim manshub yang dikenai perbuatan fa\'il',
            'Contoh: dharaba muhammadun zaidan (Muhammad memukul Zaid)',
            'Maf\'ul bih bisa zhahir atau mudhamar',
            'Mudhamar muttashil: -hu, -ha, -huma, -hum, -hunna, -ka, -ki, dll',
        ]
    },
    {
        chapter: 23,
        title: 'Bab al-Mashdar',
        content: [
            'الْمَصْدَرُ اسْمٌ جَاءَ ثَالِثًا لَدَى ۞ تَصْرِيْفِ فِعْلٍ وَانْتِصَابُهُ بَدَا',
            'وَهُوَ لَدَى ذَوِي النُّهَى قِسْمَانِ ۞ لَفْظِيٌّ اوْ مَعْنَوِيٌّ يَا دَانِي',
        ],
        translation: [
            'Mashdar adalah isim yang datang ketiga pada tashrf fi\'il, dan nashbnya jelas',
            'Dan ia pada ulil nuha dua bagian: lafzhi atau ma\'nawi wahai yang dekat',
        ],
        footnotes: [
            'Mashdar: kata dasar/infinitif dari fi\'il',
            'Mashdar lafzhi: sesuai lafaz fi\'ilnya (dharaba dharban)',
            'Mashdar ma\'nawi: bermakna sama tapi beda lafaz (jalasa qu\'udan)',
            'Mashdar di-nashab sebagai maf\'ul muthlaq',
        ]
    },
    {
        chapter: 24,
        title: 'Bab azh-Zharf (Zharf)',
        content: [
            'الظَّرْفُ مَنْصُوْبٌ عَلَى إِضْمَارِ فِي ۞ وَقْتًا مَكَانًا قِسْمَةً تَمَّتْ تَفِي',
            'فَأَمَّا ظَرْفُ الْوَقْتِ فَهُوَ مِثْلُ ۞ الْيَوْمَ وَاللَّيْلَةَ وَغَدْوَةً وَبُكْرَةً',
        ],
        translation: [
            'Zharf di-nashab atas idmar fi, waktu atau tempat, pembagian sempurna mencukupi',
            'Maka adapun zharf waktu seperti al-yauma, al-lailata, ghadwatan, bukratan',
        ],
        footnotes: [
            'Zharf: keterangan waktu (zaman) atau tempat (makan)',
            'Zharf zaman: yaum, lailah, saah, shan, ghadan, ams',
            'Zharf makan: amama, khalfa, fauqa, tahta, \'inda, ma\'a',
            'Di-nashab dengan fathah atau kasrah',
        ]
    },
    {
        chapter: 25,
        title: 'Khatimah (Penutup)',
        content: [
            'تَمَّتْ بِحَمْدِ رَبِّنَا الْمَنَّانِ ۞ مَنْظُوْمَةٌ حَوَتْ بَدِيْعَ الْمَعَانِي',
            'نَظْمُ الْفَقِيْرِ الشَّرَفِ الْعِمْرِيْطِي ۞ ذِي الْعَجْزِ وَالتَّقْصِيْرِ وَالتَّفْرِيْطِ',
            'أَرْجُوْ مِنَ اللهِ بِهَا الْغُفْرَانَا ۞ وَنَيْلَ مَا أَمَّلْتُهُ جِنَانَا',
        ],
        translation: [
            'Telah selesai dengan puji kepada Rabb kita Yang Maha Pemberi, nazham yang mengandung makna-makna yang indah',
            'Nazham orang fakir Syaraf Al-Imrithi, yang lemah, kurang, dan lalai',
            'Aku berharap dari Allah dengannya ampunan dan mendapat apa yang kuharapkan yaitu surga',
        ],
        footnotes: [
            'Penutup Nadzam Al-Imriti',
            'Pengarang merendahkan diri sebagai orang fakir dan lemah',
            'Doa pengarang memohon ampunan dan surga',
            'Kitab ini menjadi rujukan ilmu nahwu di pesantren',
        ]
    },
];
