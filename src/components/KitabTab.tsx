import { useState, useEffect } from 'react';
import { BookOpen, Search, ChevronRight, Book, FileText } from 'lucide-react';
import { imritiContent } from '../data/imritiData';
import { ajurrumiyahContent } from '../data/ajurrumiyahData';
import { qawaidContent } from '../data/qawaidData';
import { aqidatulAwamContent } from '../data/aqidatulAwamData';

interface Kitab {
    id: string;
    title: string;
    titleArab: string;
    category: string;
    author: string;
    description: string;
    chapters: number;
    verses: number;
}

interface KitabContent {
    chapter: number;
    title: string;
    content: string[];
    translation?: string[];
    footnotes?: string[];
}

interface Bookmark {
    kitabId: string;
    chapter: number;
    verse: number;
    note?: string;
}

const KitabTab: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedKitab, setSelectedKitab] = useState<Kitab | null>(null);
    const [selectedChapter, setSelectedChapter] = useState<number>(0);
    const [showTranslation, setShowTranslation] = useState(true);
    const [showFootnotes, setShowFootnotes] = useState(true);
    const [fontSize, setFontSize] = useState(32);
    const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
    const [highlightedVerse, setHighlightedVerse] = useState<number | null>(null);
    const [showBookmarkPanel, setShowBookmarkPanel] = useState(false);

    // Load bookmarks from localStorage
    useEffect(() => {
        try {
            const saved = localStorage.getItem('kitab-bookmarks');
            if (saved) {
                setBookmarks(JSON.parse(saved));
            }
        } catch (error) {
            // Ignore corrupted data
            localStorage.removeItem('kitab-bookmarks');
        }
    }, []);

    // Save bookmarks to localStorage
    useEffect(() => {
        localStorage.setItem('kitab-bookmarks', JSON.stringify(bookmarks));
    }, [bookmarks]);

    const kitabList: Kitab[] = [
        {
            id: 'alfiyah',
            title: 'Alfiyyah Ibnu Malik',
            titleArab: 'ألفية ابن مالك',
            category: 'Nahwu & Sharaf',
            author: 'Ibnu Malik',
            description: 'Kitab klasik berisi 1000 bait syair yang merangkum ilmu Nahwu dan Sharaf',
            chapters: 68,
            verses: 1000
        },
        {
            id: 'ajurrumiyah',
            title: 'Al-Ajurrumiyyah',
            titleArab: 'الآجرومية',
            category: 'Nahwu',
            author: 'Ibnu Ajurrum',
            description: 'Kitab dasar Nahwu yang paling populer untuk pemula',
            chapters: 12,
            verses: 0
        },
        {
            id: 'imriti',
            title: 'Nazham Al-Imriti',
            titleArab: 'نَظْمُ الْعِمْرِيطِي',
            category: 'Nahwu',
            author: 'Syarafuddin Yahya Al-Imriti',
            description: 'Nazham tentang ilmu Nahwu dalam bentuk syair, merupakan nazham dari kitab Al-Ajurrumiyyah',
            chapters: 25,
            verses: 200
        },
        {
            id: 'qawaid',
            title: 'Qawaid al-Lughah al-Arabiyyah',
            titleArab: 'قواعد اللغة العربية',
            category: 'Qawaid',
            author: 'Berbagai Ulama',
            description: 'Kumpulan kaidah-kaidah bahasa Arab',
            chapters: 15,
            verses: 0
        },
        {
            id: 'aqidatul-awam',
            title: 'Nadzam Aqidatul Awam',
            titleArab: 'نَظْمُ عَقِيْدَةِ الْعَوَامِ',
            category: 'Aqidah',
            author: 'Syeikh Ahmad Al-Marzuqi Al-Maliki',
            description: 'Nazham aqidah 57 bait tentang rukun iman, sifat Allah, para nabi, malaikat, dan kitab suci',
            chapters: 8,
            verses: 57
        },
    ];

    // Database konten lengkap dengan terjemahan
    const alfiyahContent: KitabContent[] = [
        {
            chapter: 1,
            title: 'Muqaddimah (Pendahuluan)',
            content: [
                'قَالَ مُحَمَّدٌ هُوَ ابْنُ مَالِكِ',
                'أَحْمَدُ رَبِّي اللهَ خَيْرَ مَالِكِ',
                'مُصَلِّيًا عَلَى النَّبِيِّ الْمُصْطَفَى',
                'وَآلِهِ الْمُسْتَكْمِلِينَ الشَّرَفَا',
                'وَأَسْتَعِينُ اللهَ فِي أَلْفِيَّهْ',
                'مَقَاصِدُ النَّحْوِ بِهَا مَحْوِيَّهْ',
                'تُقَرِّبُ الْأَقْصَى بِلَفْظٍ مُوجَزِ',
                'وَتَبْسُطُ الْبَذْلَ بِوَعْدٍ مُنْجَزِ',
            ],
            translation: [
                'Berkata Muhammad yaitu Ibnu Malik',
                'Aku memuji Tuhanku Allah sebaik-baik Pemilik',
                'Dengan bershalawat kepada Nabi yang terpilih',
                'Dan keluarganya yang sempurna kemuliaan',
                'Dan aku memohon pertolongan Allah dalam (menyusun) Alfiyyah',
                'Yang di dalamnya terkandung tujuan-tujuan ilmu Nahwu',
                'Yang mendekatkan yang jauh dengan lafaz yang ringkas',
                'Dan mempermudah pemberian ilmu dengan janji yang pasti',
            ],
            footnotes: [
                'Muhammad bin Abdullah bin Malik al-Andalusi (600-672 H), ulama besar dalam bidang Nahwu dan Bahasa Arab',
                'Hamdalah adalah ungkapan syukur kepada Allah sebagai pembuka karya ilmiah',
                'Shalawat kepada Nabi Muhammad SAW adalah adab dalam memulai penulisan',
                'Keluarga Nabi yang memiliki kemuliaan sempurna dalam ilmu dan amal',
                'Alfiyyah artinya seribu, merujuk pada jumlah bait dalam nazham ini',
                'Kitab ini merangkum seluruh kaidah Nahwu dalam 1000 bait yang mudah dihafal',
                'Gaya penulisan yang padat namun mencakup seluruh cabang ilmu Nahwu',
                'Komitmen penulis untuk memberikan kemudahan dalam pembelajaran Nahwu',
            ]
        },
        {
            chapter: 2,
            title: 'Al-Kalam (Pembahasan Kalam)',
            content: [
                'كَلَامُنَا لَفْظٌ مُفِيدٌ كَاسْتَقِمْ',
                'وَاسْمٌ وَفِعْلٌ ثُمَّ حَرْفٌ الْكَلِمْ',
                'وَاحِدُهُ كَلِمَةٌ وَالْقَوْلُ عَمّ',
                'وَكِلْمَةٌ بِهَا كَلَامٌ قَدْ يُؤَمّ',
                'بِالْجَرِّ وَالتَّنْوِينِ وَالنِّدَاءِ وَأَلْ',
                'وَمُسْنَدٍ لِلْاِسْمِ تَمْيِيزٌ حَصَلْ',
                'بِتَا فَعَلْتَ وَأَتَتْ وَيَا افْعَلِي',
                'وَنُونِ أَقْبِلَنَّ فِعْلٌ يَنْجَلِي',
                'سِوَاهُمَا الْحَرْفُ كَهَلْ وَفِي وَلَمْ',
                'فَعْلٌ مُضَارِعٌ يَلِي لَمْ كَيَشَمْ',
            ],
            translation: [
                'Kalam kami adalah lafaz yang berfaidah seperti: Istaqim (Luruskanlah)',
                'Dan Isim, Fi\'il, kemudian Huruf adalah (jenis-jenis) Kalimah',
                'Satu dari kalimah adalah kalimah, sedangkan qaul lebih umum',
                'Dan dengan kalimah, kalam dapat dicapai',
                'Dengan jarr, tanwin, nida, dan alif-lam',
                'Dan musnad lil-ismi (yang disandarkan pada isim), maka pembedaan telah diperoleh',
                'Dengan ta fa\'alta, atatat, dan ya if\'ali',
                'Dan nun aqbilanna, fi\'il menjadi jelas',
                'Selain keduanya adalah huruf, seperti hal, fi, dan lam',
                'Fi\'il mudhari\' yang mengikuti lam, seperti yasymam',
            ],
            footnotes: [
                'Kalam: ucapan yang sempurna dan memberikan faidah. Contoh: Istaqim (Luruskanlah dirimu)',
                'Tiga pembagian kalimah dalam bahasa Arab: Isim (kata benda), Fi\'il (kata kerja), Huruf (huruf)',
                'Kalimah: satu kata. Qaul: istilah umum untuk ucapan, bisa satu kata atau lebih',
                'Kalam minimal terdiri dari dua kalimah yang membentuk kalimat sempurna',
                'Tanda-tanda isim: dapat di-jarr (kasrah), dapat ditanwin, dapat dipanggil dengan nida, dapat ditambah alif-lam',
                'Musnad: predikat. Musnad ilaihi: subjek. Ini adalah rukun kalam',
                'Tanda-tanda fi\'il: ta fa\'alta (untuk fi\'il madhi), ya if\'ali (untuk fi\'il amar)',
                'Nun taukid: nun penguat pada fi\'il, contoh: yaktubanna (dia pasti menulis)',
                'Huruf: kata yang tidak termasuk isim atau fi\'il, seperti: hal (apakah), fi (di), lam (tidak/untuk)',
                'Fi\'il mudhari\' yang di-jazm dengan lam: contoh "lam yaktub" (dia tidak menulis)',
            ]
        },
        {
            chapter: 3,
            title: 'Al-Mu\'rab wal Mabni (I\'rab dan Bina)',
            content: [
                'وَالْاِسْمُ مِنْهُ مُعْرَبٌ وَمَبْنِي',
                'لِشَبَهٍ مِنَ الْحُرُوفِ مُدْنِي',
                'كَالشَّبَهِ الْوَضْعِيِّ فِي اسْمَيْ جِئْتَنَا',
                'وَالْمَعْنَوِيِّ فِي مَتَى وَفِي هُنَا',
                'وَكَنِيَابَةٍ عَنِ الْفِعْلِ بِلَا',
                'تَأَثُّرٍ وَكَافْتِقَارٍ أُصِّلَا',
                'وَالْأَصْلُ فِي الْبِنَاءِ أَنْ يَسْكُنَا',
                'وَمِنْهُ ذُو فَتْحٍ وَضَمٍّ بُيِّنَا',
            ],
            translation: [
                'Dan isim darinya ada yang mu\'rab (berubah) dan mabni (tetap)',
                'Karena menyerupai huruf yang dekat',
                'Seperti kemiripan wadh\'i dalam ji\'ta dan na (kata ganti)',
                'Dan kemiripan ma\'nawi dalam mata (kapan) dan huna (di sini)',
                'Dan seperti menggantikan fi\'il tanpa',
                'Terpengaruh, dan seperti kebutuhan yang asli',
                'Dan asal dalam bina adalah sukun',
                'Dan darinya ada yang fathah dan dhammah yang jelas',
            ],
            footnotes: [
                'Mu\'rab: kata yang berubah akhirnya karena \'amil. Mabni: kata yang tetap akhirnya',
                'Isim dibina karena menyerupai huruf dalam beberapa aspek',
                'Syabah wadh\'i: kemiripan bentuk dengan huruf, contoh: ji\'ta (kamu datang)',
                'Syabah ma\'nawi: kemiripan makna dengan huruf, contoh: mata (kapan - tidak menunjuk waktu tertentu)',
                'Isim dhamair menggantikan isim zhahir, seperti huruf menggantikan fi\'il',
                'Iftiqaar: kebutuhan kata pada kata lain, seperti huruf jarr butuh majrur',
                'Asal bina adalah sukun karena paling ringan',
                'Bina juga bisa dengan fathah (amsi), dhammah (mun-dzu), atau kasrah (imsi)',
            ]
        },
        {
            chapter: 4,
            title: 'Tanda-tanda I\'rab',
            content: [
                'لِلْاِسْمِ تَمْيِيزٌ بِهِ عَنِ الْفِعَلْ',
                'بِالْجَرِّ وَالتَّنْوِينِ وَالنِّدَاءِ وَأَلْ',
                'وَمُسْنَدٍ لِلْاِسْمِ تَمْيِيزٌ حَصَلْ',
                'وَالرَّفْعُ وَالنَّصْبُ وَجَرٌّ وَجَزْمْ',
                'أَعْرَبُ وَابْنِ بِنِيَامِنْهَا عِزْمْ',
                'فَارْفَعْ بِضَمٍّ وَانْصِبَنَّ فَتْحَا',
                'وَاجْرُرْ بِكَسْرٍ وَبِسُكُونٍ اجْزِمَا',
            ],
            translation: [
                'Untuk isim ada tanda pembeda darinya dengan fi\'il',
                'Dengan jarr, tanwin, nida, dan alif-lam',
                'Dan musnad (predikat) untuk isim, pembedaan telah diperoleh',
                'Dan rafa\', nashab, jarr, dan jazm',
                'Adalah i\'rab, dan ketahuilah bina darinya dengan tekad',
                'Maka rafa\' dengan dhammah, dan nashab dengan fathah',
                'Dan jarr dengan kasrah, dan jazm dengan sukun',
            ],
            footnotes: [
                'Tanda-tanda isim: bisa di-jarr, bisa ditanwin, bisa dipanggil dengan nida, bisa ditambah al',
                'Kelima tanda ini tidak dimiliki oleh fi\'il, sehingga membedakan isim dari fi\'il',
                'Musnad ilaihi (subjek) pasti isim, ini juga tanda pembeda',
                'Empat macam i\'rab: rafa\' (dhammah), nashab (fathah), jarr (kasrah), jazm (sukun)',
                'I\'rab untuk kata yang berubah, bina untuk kata yang tetap',
                'Tanda rafa\' yang paling umum adalah dhammah (ـُ)',
                'Tanda nashab: fathah (ـَ), jarr: kasrah (ـِ), jazm: sukun (ـْ)',
            ]
        },
        {
            chapter: 5,
            title: 'Bab Marfu\'at (Yang Dibaca Rafa\')',
            content: [
                'وَالْفَاعِلُ الَّذِي كَمَرْفُوعِي أَتَى',
                'زَيْدٌ مُنِيرًا وَجْهُهُ نِعْمَ الْفَتَى',
                'كَذَاكَ رُفْعُ نَائِبٍ عَنْهُ إِذَا',
                'بِفِعْلِ مَفْعُولٍ مِنَ الْفَاعِلِ خُذَا',
                'وَالْمُبْتَدَأُ زَيْدٌ وَعَادٍ خَبَرُهْ',
                'فِي قَوْلِنَا زَيْدٌ عَدُوٌّ مَا جَبَرُهْ',
                'وَرُفِعَ الْمُبْتَدَأُ بِالِابْتِدَاءِ',
                'وَالْخَبَرُ الْمُسْنَدُ لِلْمُبْتَدَاءِ',
            ],
            translation: [
                'Dan fa\'il yang seperti marfu\' datang',
                'Zaid yang wajahnya bersinar, sebaik-baik pemuda',
                'Demikian juga rafa\' na\'ib (pengganti) darinya ketika',
                'Dengan fi\'il maf\'ul (pasif) dari fa\'il ambillah',
                'Dan mubtada adalah Zaid, dan aduwwun adalah khabarnya',
                'Dalam ucapan kita: Zaidun aduwwun (Zaid adalah musuh)',
                'Dan mubtada dirafa\' karena ibtida (permulaan)',
                'Dan khabar yang disandarkan kepada mubtada',
            ],
            footnotes: [
                'Fa\'il: pelaku perbuatan, selalu marfu\' (rafa\')',
                'Contoh: Zaidun (fa\'il marfu\') dalam "jaa-a Zaidun"',
                'Na\'ibul fa\'il: pengganti fa\'il dalam kalimat pasif',
                'Contoh: "dhuriba Zaidun" - Zaidun adalah na\'ibul fa\'il',
                'Mubtada: isim yang menjadi awal kalimat ismiyyah',
                'Khabar: predikat yang memberikan informasi tentang mubtada',
                'Mubtada dirafa\' karena posisinya sebagai permulaan',
                'Khabar dirafa\' karena disandarkan kepada mubtada',
            ]
        },
        {
            chapter: 6,
            title: 'Bab Manshuhat (Yang Dibaca Nashab)',
            content: [
                'وَانْصِبْ بِفِعْلٍ مُضْمَرٍ إِنْ أُظْهِرَا',
                'فِي الْجَوَابِ وَنَحْوِهِ مُفَسِّرَا',
                'وَالْمَفْعُولُ الْمُطْلَقُ مَا فُضِّلَا',
                'عَنْ عَامِلِ الْمَعْنَى بِهِ أَوْ بَدَلَا',
                'وَانْصِبْ بِهِ التَّوْكِيدَ وَالنَّوْعَ وَمَا',
                'يَشْمَلْهُمَا كَالْعَدَدِ النَّامِيَا',
            ],
            translation: [
                'Dan nashab dengan fi\'il mudhmar jika ditampakkan',
                'Dalam jawaban dan sejenisnya sebagai penjelas',
                'Dan maf\'ul mutlaq adalah yang dilebihkan',
                'Dari \'amil maknanya atau sebagai pengganti',
                'Dan nashab dengannya ta\'kid dan jenis',
                'Yang mencakup keduanya seperti bilangan',
            ],
            footnotes: [
                'Fi\'il mudhmar: fi\'il tersembunyi yang diperkirakan',
                'Contoh: "Zaidan!" (maksud: u\'zhiru Zaidan)',
                'Maf\'ul mutlaq: mashdar mansub untuk menguatkan',
                'Contoh: "dharabtu dharban" (aku memukul pukulan)',
                'Ta\'kid: penguat, bayan nau\': penjelasan jenis',
                'Contoh bilangan: "dharabtu dharban wahidan"',
            ]
        },
        {
            chapter: 7,
            title: 'Bab Makhfudhat (Yang Dibaca Jarr)',
            content: [
                'بِالْجَرِّ وَالْإِضَافَةِ وَالتَّبْعِيَّةِ',
                'وَقَدْ تَجُرُّ بَعْضَ أَسْمَاءٍ سَمِعْ',
                'وَجَرُّهَا لِتَابِعٍ كَوَرَدَا',
                'أَوْ أَنْ تَضَافَ أَوْ بِحَرْفِ جَرَّا',
                'وَالْجَرُّ بِالْحُرُوفِ أَوْ بِالْإِضَافَهْ',
                'أَوِ التَّبَعِيَّةِ لِمَجْرُورٍ كَفَى',
            ],
            translation: [
                'Dengan jarr, idhafah, dan tab\'iyyah',
                'Dan boleh men-jarr sebagian nama yang didengar',
                'Dan jarr-nya untuk tabi\' seperti mawar',
                'Atau di-idhafah-kan atau dengan huruf jarr',
                'Dan jarr dengan huruf atau idhafah',
                'Atau tab\'iyyah kepada majrur sudah cukup',
            ],
            footnotes: [
                'Tiga cara jarr: huruf jarr, idhafah, tabi\' majrur',
                'Huruf jarr: min, ila, \'an, \'ala, fi, bi, lam',
                'Idhafah: penyandaran isim, contoh: kitabu Zaiding',
                'Tab\'iyyah: na\'at, \'athaf, taukid, badal',
                'Contoh tabi\': al-kariimu mengikuti i\'rab Zaidun',
                'Khusus untuk isim, tidak berlaku untuk fi\'il',
            ]
        },
        {
            chapter: 8,
            title: 'Bab Majzumat (Yang Dibaca Jazm)',
            content: [
                'وَاجْزِمْ بِلَمْ وَلَمَّا وَلَامِ الْأَمْرِ',
                'وَلَا الَّتِي لِلنَّهْيِ جَاءَتْ مَعَ الْجَزْمِ',
                'فِي الشَّرْطِ حَيْثُ جُزِمَ الْفِعْلَانِ',
                'إِنْ لَمْ يَكُنْ شَرْطٌ لِذَا بِالْبَيَانِ',
            ],
            translation: [
                'Dan jazm dengan lam, lamma, dan lam amar',
                'Dan laa yang untuk larangan dengan jazm',
                'Dalam syarat di mana di-jazm dua fi\'il',
                'Jika bukan syarat dengan penjelasan',
            ],
            footnotes: [
                'Lam: huruf nafi, contoh: lam yaktub',
                'Lamma: seperti lam tapi belum sampai sekarang',
                'Lam amar: untuk perintah, contoh: li-yaktub',
                'Laa nahyi: untuk larangan, contoh: laa taktub',
            ]
        },
        {
            chapter: 9,
            title: 'Al-Mu\'rab bil Huruf (Yang Di-I\'rab dengan Huruf)',
            content: [
                'وَالْأَسْمَاءُ الْخَمْسَةُ أَبٌ وَأَخٌ وَحَمٌ',
                'وَفُوكَ وَذُو إِذَا أُضِيفَتْ تُعْلَمْ',
                'بِالْوَاوِ رَفْعًا وَالْأَلِفِ نَصْبًا',
                'وَجَرُّهَا بِالْيَاءِ مُنْقَلِبًا',
            ],
            translation: [
                'Dan asma al-khamsah: ayah, saudara, mertua',
                'Dan mulutmu dan dzu jika di-idhafah-kan',
                'Dengan waw untuk rafa\' dan alif untuk nashab',
                'Dan jarr-nya dengan ya\' yang berubah',
            ],
            footnotes: [
                'Asma al-khamsah: 5 kata khusus i\'rab dengan huruf',
                'Abu, akhu, hamu, fu, dzu (ayah, saudara, mertua, mulut, pemilik)',
                'Syarat: mufrad dan mudhaf selain ya\' mutakallim',
                'Rafa\' waw: abuka, nashab alif: abaaka, jarr ya\': abiika',
            ]
        },
        {
            chapter: 10,
            title: 'Al-Mabniyyat (Yang Dibina)',
            content: [
                'وَغَيْرُ ذِي الْإِضَافَةِ مِنْهَا أَوْ مَا',
                'يُجْعَلُ فِي التَّثْنِيَةِ مُفْرَدًا سُمَا',
                'وَابْنٌ مِنِ ابْنِ عَمِّنَا سَوَاءُ',
                'فِي رَفْعِهِ وَفِي النَّصْبِ وَالْخَفْضِ سَوَاءُ',
            ],
            translation: [
                'Dan selain yang ber-idhafah darinya',
                'Yang dijadikan mufrad meski tatsniyah',
                'Dan ibnu seperti ibn ammi-na sama',
                'Dalam rafa\', nashab, dan khafdh sama',
            ],
            footnotes: [
                'Asma khamsah yang tidak mudhaf i\'rab normal',
                'Jika ditambah alif-lam: i\'rab dengan harakat',
                'Contoh: al-abu atau abun - i\'rab biasa',
                'Hukum khusus hanya saat mufrad dan mudhaf',
            ]
        },
        {
            chapter: 11,
            title: 'Al-Isnaad (Penyandaran)',
            content: [
                'وَأَسْنِدَنْ لِلْوَاحِدِ الْمُخَاطَبِ',
                'كَأَنْتَ زَيْدٌ وَهْوَ لِلْغَائِبِ',
                'وَالْمُفْرَدُ الْمُتَكَلِّمُ أَنَا فَقُلْ',
                'وَنَحْنُ لِلْجَمْعِ الَّذِي قَدْ حَصُلْ',
            ],
            translation: [
                'Dan sandarkan untuk yang satu yang diajak bicara',
                'Seperti anta (kamu) Zaid, dan huwa untuk ghaib',
                'Dan mufrad mutakallim adalah ana (aku)',
                'Dan nahnu untuk jamak yang telah terjadi',
            ],
            footnotes: [
                'Isnaad: penyandaran fi\'il kepada dhamir (kata ganti)',
                'Mukhatab: orang kedua (anta, anti, antuma, antum, antunna)',
                'Ghaib: orang ketiga (huwa, hiya, huma, hum, hunna)',
                'Mutakallim: orang pertama (ana, nahnu)',
            ]
        },
        {
            chapter: 12,
            title: 'Al-Af\'aal (Kata Kerja)',
            content: [
                'وَالْفِعْلُ مَاضٍ وَمُضَارِعٌ وَأَمْرْ',
                'وَمَا تَصَرَّفَ فَمِنْهُ يَصْدُرْ',
                'وَالْفِعْلُ الْمُضَارِعُ مَا كَانَ أَوَّلُهْ',
                'حَرْفَ الْمُضَارَعَةِ وَهْوَ سَهْلُهْ',
            ],
            translation: [
                'Dan fi\'il ada madhi, mudhari\', dan amar',
                'Dan apa yang berubah darinya keluar',
                'Dan fi\'il mudhari\' yang awalnya',
                'Huruf mudharaah dan itu mudah',
            ],
            footnotes: [
                'Tiga jenis fi\'il: madhi (lampau), mudhari\' (sekarang/akan datang), amar (perintah)',
                'Fi\'il mutasharrif: yang bisa berubah bentuk, lawan jamid',
                'Huruf mudharaah: hamzah, nun, ya\', ta\' (أنيت)',
                'Contoh: yaktub (dia menulis), naktub (kita menulis)',
            ]
        },
        {
            chapter: 13,
            title: 'Al-Mudhaari\' al-Marfu\' (Mudhaari\' yang Marfu\')',
            content: [
                'وَيُرْفَعُ الْمُضَارِعُ الَّذِي يُجَرَّدْ',
                'مِنْ نَاصِبٍ وَجَازِمٍ كَتَسْعَدْ',
                'وَرَفْعُهُ بِالضَّمَّةِ الْمُقَدَّرَهْ',
                'فِي آخِرِ الْمُعْتَلِّ بِالْأَلِفِ ظَاهِرَهْ',
            ],
            translation: [
                'Dan dirafa\' mudhari\' yang kosong',
                'Dari nashib dan jazim seperti tas\'ad',
                'Dan rafa\'-nya dengan dhammah muqaddarah',
                'Di akhir mu\'tall dengan alif yang jelas',
            ],
            footnotes: [
                'Mudhari\' marfu\' jika tidak ada nashib atau jazim',
                'Contoh: yaktub (dia menulis) - marfu\'',
                'Dhammah muqaddarah: dhammah tersembunyi',
                'Pada fi\'il mu\'tall akhir alif: yar-dhaa, yas-\'aa',
            ]
        },
        {
            chapter: 14,
            title: 'Nawaasikh al-Ibtidaa\' (Yang Membatalkan Ibtida\')',
            content: [
                'إِنَّ وَأَنَّ وَلَكِنَّ وَلَيْتَ',
                'وَلَعَلَّ وَكَأَنَّ وَقَدْ بُيِّتْ',
                'فَهُنَّ يَنْصِبْنَ الْمُبْتَدَأَ اسْمًا',
                'وَالْخَبَرُ بِالرَّفْعِ يَكُونُ رَسْمًا',
            ],
            translation: [
                'Inna, anna, lakinna, dan laita',
                'Dan la\'alla, ka-anna telah dijelaskan',
                'Maka mereka men-nashab mubtada sebagai isim',
                'Dan khabar dengan rafa\' menjadi aturan',
            ],
            footnotes: [
                'Inna dan saudara: 6 huruf yang beramal seperti fi\'il',
                'Men-nashab mubtada menjadi isim-nya',
                'Men-rafa\' khabar menjadi khabar-nya',
                'Contoh: inna Zaidan qaa-imun (sesungguhnya Zaid berdiri)',
            ]
        },
        {
            chapter: 15,
            title: 'Laa an-Naafiyah lil Jins (Laa yang Meniadakan Jenis)',
            content: [
                'وَلَا الَّتِي لِنَفْيِ الْجِنْسِ تَعْمَلُ',
                'عَمَلَ إِنَّ إِذَا لَمْ تُفْصَلْ',
                'فَنَصْبُهَا لِلِاسْمِ بِلَا تَنْوِينْ',
                'وَالْخَبَرُ مَرْفُوعٌ لَهُ تَمْكِينْ',
            ],
            translation: [
                'Dan laa untuk nafi jenis beramal',
                'Seperti inna jika tidak dipisah',
                'Maka nashab-nya untuk isim tanpa tanwin',
                'Dan khabar marfu\' untuknya ada penempatan',
            ],
            footnotes: [
                'Laa naafiyah lil jins: laa yang meniadakan seluruh jenis',
                'Beramal seperti inna: nashab isim, rafa\' khabar',
                'Contoh: laa rajula fii-d-daar (tidak ada laki-laki di rumah)',
                'Isim-nya tidak ditanwin karena dibangun pada fathah',
            ]
        },
        {
            chapter: 16,
            title: 'Af\'aal al-Muqaarabah (Fi\'il yang Menunjukkan Hampir)',
            content: [
                'كَادَ وَكَرَبَ وَأَوْشَكَ وَعَسَى',
                'تَرْفَعُ مَا كَانَ وَخَبَرُهَا جَسَا',
                'فِعْلٌ مُضَارِعٌ كَكَادَ يَشْرَعُ',
                'وَجَرْدُهُ وَأَنْ أَتَى مَعَ عَسَى',
            ],
            translation: [
                'Kaada, karaba, awsyaka, dan \'asaa',
                'Men-rafa\' seperti kana dan khabarnya kuat',
                'Fi\'il mudhari\' seperti kaada mulai',
                'Dan kosongnya, dan an datang dengan \'asaa',
            ],
            footnotes: [
                'Af\'aal muqaarabah: fi\'il yang menunjukkan hampir/nyaris',
                'Kaada: hampir, karaba: nyaris, awsyaka: segera',
                '\'asaa: mudah-mudahan, semoga',
                'Khabar berupa fi\'il mudhari\' tanpa an atau dengan an',
            ]
        },
        {
            chapter: 17,
            title: 'Al-Masaadir (Kata Dasar)',
            content: [
                'الْمَصْدَرُ اسْمٌ مَا سِوَى الزَّمَانِ',
                'مِنْ لَفْظِ حَدَثٍ بِهِ قَدْ بَانِ',
                'كَضَرْبٍ وَقَتْلٍ وَكَتَابَةٍ',
                'وَذِهَابٍ وَنَوْمٍ وَإِقَامَةٍ',
            ],
            translation: [
                'Mashdar adalah isim selain waktu',
                'Dari lafaz kejadian dengannya telah jelas',
                'Seperti dharb, qatl, dan kitaabah',
                'Dan dzihaab, naum, dan iqaamah',
            ],
            footnotes: [
                'Mashdar: kata dasar yang menunjukkan peristiwa',
                'Tidak menunjukkan waktu, hanya kejadian',
                'Contoh dari tsulasi: dharb (pukulan), qatl (pembunuhan)',
                'Contoh dari rubaa\'i: kitaabah (penulisan), dzihaab (kepergian)',
            ]
        },
        {
            chapter: 18,
            title: 'Isim al-Faa\'il (Nama Pelaku)',
            content: [
                'وَاسْمُ فَاعِلٍ مِنْ ثُلَاثِيٍّ كَذَا',
                'عَلَى فَاعِلٍ أَبَدًا قَدْ وُجِدَا',
                'كَكَاتِبٍ وَنَاصِرٍ وَصَائِمِ',
                'وَقَارِئٍ وَعَالِمٍ وَقَائِمِ',
            ],
            translation: [
                'Dan isim fa\'il dari tsulasi demikian',
                'Dengan wazan faa\'il selamanya telah ada',
                'Seperti kaatib, naashir, dan shaa-im',
                'Dan qaari\', \'aalim, dan qaa-im',
            ],
            footnotes: [
                'Isim fa\'il: kata yang menunjukkan pelaku',
                'Dari fi\'il tsulasi: wazan faa\'il',
                'Contoh: kaatib (penulis), naashir (penolong)',
                'Dari gairu tsulasi: ganti huruf mudharaah dengan mim dhammah',
            ]
        },
        {
            chapter: 19,
            title: 'Isim al-Maf\'uul (Nama Objek)',
            content: [
                'وَاسْمُ مَفْعُولٍ مِنَ الثُّلَاثِي',
                'بِفَتْحِ مِيمٍ ضَمِّ عَيْنٍ يَأْتِي',
                'كَمَضْرُوبٍ وَمَقْتُولٍ وَمَكْتُوبِ',
                'وَمَذْهُوبٍ وَمَنُومٍ وَمَحْبُوبِ',
            ],
            translation: [
                'Dan isim maf\'ul dari tsulasi',
                'Dengan fathah mim dan dhammah \'ain datang',
                'Seperti madhrub, maqtul, dan maktub',
                'Dan madzhub, manuum, dan mahbub',
            ],
            footnotes: [
                'Isim maf\'ul: kata yang menunjukkan objek',
                'Dari fi\'il tsulasi: wazan maf\'uul',
                'Contoh: madhrub (yang dipukul), maktub (yang ditulis)',
                'Dari gairu tsulasi: seperti isim fa\'il tapi huruf qabla akhir difathah',
            ]
        },
        {
            chapter: 20,
            title: 'Sifat Musyabbahah (Sifat Menyerupai)',
            content: [
                'وَالصِّفَةُ الْمُشَبَّهَةُ اسْمٌ فُعِلَ',
                'مِنْ لَازِمٍ كَطَاهِرٍ قَدْ نُقِلَ',
                'وَفَعْلَانُ وَفَعْلَى لِلْأُنْثَى',
                'وَفَعِلٌ وَفُعَلٌ فِيهِ أَتَى',
            ],
            translation: [
                'Dan shifah musyabbahah adalah isim yang dibuat',
                'Dari lazim seperti thaahir telah dipindah',
                'Dan fa\'laan dan fa\'laa untuk muannats',
                'Dan fa\'il dan fu\'al padanya datang',
            ],
            footnotes: [
                'Shifah musyabbahah: sifat dari fi\'il lazim',
                'Menunjukkan sifat yang menetap',
                'Contoh: thaahir (bersih), hasan (bagus), kabiir (besar)',
                'Banyak wazan: fa\'iil, fa\'laan-fa\'laa, af\'al',
            ]
        },
        {
            chapter: 21,
            title: 'Isim at-Tafdhiil (Nama Keutamaan)',
            content: [
                'وَاسْمُ التَّفْضِيلِ عَلَى أَفْعَلَ',
                'كَأَكْبَرَ وَأَصْغَرَ قَدْ أُكْمِلَ',
                'وَأَحْسَنُ وَأَجْمَلُ وَأَقْبَحُ',
                'وَأَعْلَى وَأَدْنَى بِهَا تَفْصَحُ',
            ],
            translation: [
                'Dan isim tafdhil dengan wazan af\'al',
                'Seperti akbar dan ashghar telah sempurna',
                'Dan ahsan, ajmal, dan aqbah',
                'Dan a\'laa dan adnaa dengannya fasih',
            ],
            footnotes: [
                'Isim tafdhil: menunjukkan kelebihan/perbandingan',
                'Wazan: af\'al untuk mudzakkar, fu\'laa untuk muannats',
                'Contoh: akbar (lebih besar), ahsan (lebih baik)',
                'Pola: Zaid akbaru min \'Amr (Zaid lebih besar dari Amr)',
            ]
        },
        {
            chapter: 22,
            title: 'Al-Maf\'uul al-Mutlaq (Objek Mutlak)',
            content: [
                'الْمَفْعُولُ الْمُطْلَقُ مَا فُضِّلَا',
                'عَنْ عَامِلِ الْمَعْنَى بِهِ أَوْ بَدَلَا',
                'كَضَرْبًا فِي ضَرَبْتُ ضَرْبًا',
                'أَوْ صِفَةً أَوْ عَدَدًا مُرَتَّبَا',
            ],
            translation: [
                'Maf\'ul mutlaq yang diutamakan',
                'Dari \'amil makna dengannya atau pengganti',
                'Seperti dharban dalam dharabtu dharban',
                'Atau sifat atau bilangan tersusun',
            ],
            footnotes: [
                'Maf\'ul mutlaq: mashdar yang mansub setelah fi\'il',
                'Tiga jenis: muakkid (dharabtu dharban), mubayyinu-n-nau\' (dharabtu dharban syadiidan)',
                'Mubayyinu-l-\'adad (dharabtu dharbaini)',
                'Contoh: dharabtu Zaidan dharban (aku memukul Zaid pukulan)',
            ]
        },
        {
            chapter: 23,
            title: 'Al-Maf\'uul fiihi (Objek Keterangan)',
            content: [
                'الْمَفْعُولُ فِيهِ وَهْوَ الظَّرْفُ',
                'زَمَانٌ أَوْ مَكَانٌ يُعْرَفُ',
                'كَيَوْمٍ وَلَيْلَةٍ وَحِينَ',
                'وَفَوْقَ وَتَحْتَ وَأَمَامَ بَيِّنِ',
            ],
            translation: [
                'Maf\'ul fiihi yaitu dharaf',
                'Waktu atau tempat diketahui',
                'Seperti yaum, lailah, dan hiin',
                'Dan fauq, taht, dan amaam jelas',
            ],
            footnotes: [
                'Maf\'ul fiihi (dharaf): keterangan waktu atau tempat',
                'Dharaf zaman: yaum, lailah, saa\'ah, syahr',
                'Dharaf makan: fauq, taht, amaam, khalfa, yamiin, syimaal',
                'Contoh: sirtu yaumal-jumu\'ah (aku berjalan pada hari Jumat)',
            ]
        },
        {
            chapter: 24,
            title: 'Al-Maf\'uul li Ajlihi (Objek Sebab)',
            content: [
                'الْمَفْعُولُ لَهُ مَصْدَرٌ قَلْبِي',
                'فُضِّلَ لِعِلَّةٍ كَالْحُبِّ',
                'كَقُمْتُ إِجْلَالًا لَهُ',
                'وَسِرْتُ خَوْفًا مِنْ عَدُوٍّ جَلَهُ',
            ],
            translation: [
                'Maf\'ul lahu adalah mashdar qalbi',
                'Diutamakan untuk sebab seperti cinta',
                'Seperti qumtu ijlaalan lahu',
                'Dan sirtu khaufan dari musuh yang nyata',
            ],
            footnotes: [
                'Maf\'ul lahu (li ajlihi): menunjukkan sebab/alasan',
                'Mashdar qalbi: mashdar yang berkaitan dengan hati',
                'Contoh: qumtu ijlaalan li-l-ustadz (aku berdiri karena menghormati guru)',
                'Syarat: mashdar, qalbi, sebab, bersama fi\'il dalam waktu dan pelaku',
            ]
        },
        {
            chapter: 25,
            title: 'Al-Maf\'uul Ma\'ahu (Objek Penyertaan)',
            content: [
                'الْمَفْعُولُ مَعَهُ مَا يَلِي',
                'وَاوًا بِمَعْنَى مَعْ مُفِيدًا عَلِي',
                'كَسِرْتُ وَالنَّهْرَ مَعَ الْمَاءِ',
                'وَاسْتَوَى الْمَاءُ وَخَشَبٌ مَاءِ',
            ],
            translation: [
                'Maf\'ul ma\'ahu adalah apa yang mengikuti',
                'Wawu bermakna ma\' berfaidah tinggi',
                'Seperti sirtu wa-n-nahra dengan air',
                'Dan istawa-l-maa-u wa khasyabun air',
            ],
            footnotes: [
                'Maf\'ul ma\'ahu: kata setelah wawu bermakna ma\' (bersama)',
                'Wawu ma\'iyyah: bukan \'athaf, tapi menunjukkan penyertaan',
                'Contoh: sirtu wa-n-nahra (aku berjalan bersama sungai)',
                'Hukum: mansub selamanya',
            ]
        },
        {
            chapter: 26,
            title: 'Al-Haal (Keadaan)',
            content: [
                'الْحَالُ وَصْفٌ فَضْلَةٌ مُنْتَصِبْ',
                'يَبِينُ هَيْئَةَ مَا انْتَصَبَ',
                'كَجَاءَ زَيْدٌ رَاكِبًا',
                'وَوَقَفَ الطَّالِبُ قَائِمًا',
            ],
            translation: [
                'Haal adalah sifat fudhla mansub',
                'Menjelaskan keadaan yang mansub',
                'Seperti jaa-a Zaidun raakiban',
                'Dan waqafath-thalibu qaa-iman',
            ],
            footnotes: [
                'Haal: menjelaskan keadaan fa\'il/maf\'ul saat terjadi fi\'il',
                'Hukum: mansub selamanya',
                'Contoh: jaa-a Zaidun raakiban (datang Zaid dalam keadaan berkendara)',
                'Haal bisa mufrad, jumlah, atau syibhul-jumlah',
            ]
        },
        {
            chapter: 27,
            title: 'At-Tamyiiz (Penjelasan)',
            content: [
                'التَّمْيِيزُ اسْمٌ نَكِرَةٌ مَنْصُوبْ',
                'يُبَيِّنُ مَا قَبْلَهُ مِنْ مَحْبُوبْ',
                'كَعِشْرُونَ دِرْهَمًا وَرَطْلًا',
                'وَطَابَ مُحَمَّدٌ نَفْسًا عَدْلًا',
            ],
            translation: [
                'Tamyiiz adalah isim nakirah mansub',
                'Menjelaskan apa sebelumnya dari yang disuka',
                'Seperti \'isyruuna dirhaman dan rathlan',
                'Dan thaaba Muhammadun nafsan \'adlan',
            ],
            footnotes: [
                'Tamyiiz: menghilangkan kesamaran kata sebelumnya',
                'Dua jenis: tamyiiz malfu (setelah bilangan, ukuran)',
                'Tamyiiz mansub: setelah isim tafdhil, kata seru',
                'Contoh: \'isyruuna dirhaman (20 dirham), akramuhu rajulan (lebih mulia sebagai lelaki)',
            ]
        },
        {
            chapter: 28,
            title: 'Al-Istitsna\' (Pengecualian)',
            content: [
                'الِاسْتِثْنَاءُ إِخْرَاجُ بَعْضٍ مِنْ كُلٍّ',
                'بِإِلَّا أَوْ بِسِوَى وَغَيْرِ أَوْ بَلْ',
                'كَقَامَ الْقَوْمُ إِلَّا زَيْدًا',
                'وَمَا جَاءَ أَحَدٌ غَيْرَ خَالِدًا',
            ],
            translation: [
                'Istitsna adalah mengeluarkan sebagian dari seluruh',
                'Dengan illa atau siwa dan ghair atau bal',
                'Seperti qaamal-qaumu illa Zaidan',
                'Dan maa jaa-a ahadun ghaira Khaalidan',
            ],
            footnotes: [
                'Istitsna: mengeluarkan sebagian dari keseluruhan',
                'Adat istitsna: illa, ghaira, siwa, \'ada, khalaa, haasyaa',
                'Mustatsna mansub jika mutsbit tam muttashil',
                'Contoh: jaa-al-qawmu illa Zaidan (datang kaum kecuali Zaid)',
            ]
        },
        {
            chapter: 29,
            title: 'Al-Munâdâ (Yang Dipanggil)',
            content: [
                'الْمُنَادَى مَا بِحَرْفِ النِّدَاءِ',
                'كَيَا وَأَيْ وَالْهَمْزَةِ جَاءَ',
                'مَبْنِيٌّ عَلَى الضَّمِّ إِنْ مُفْرَدَا',
                'أَوْ عَلَمًا مُضَافًا إِذَا نُودِيَا',
            ],
            translation: [
                'Munada adalah dengan huruf nida',
                'Seperti yaa, ay, dan hamzah datang',
                'Mabni pada dhamm jika mufrad',
                'Atau \'alam mudhaaf jika dipanggil',
            ],
            footnotes: [
                'Munada: yang dipanggil dengan huruf nida',
                'Huruf nida: yaa, ay, ayaa, aa, hamzah',
                'Lima jenis munada: \'alam mufrad (mabni dhamm), nakirah maqshuudah (mabni dhamm)',
                'Mudhaaf, syabih mudhaaf, nakirah ghairu maqshuudah (mansub)',
            ]
        },
        {
            chapter: 30,
            title: 'Al-Maf\'uul bihi (Objek Langsung)',
            content: [
                'الْمَفْعُولُ بِهِ هُوَ الْفَضْلَةُ',
                'مَا وَقَعَ عَلَيْهِ فِعْلُ الْفَاعِلَةُ',
                'كَضَرَبْتُ زَيْدًا وَأَكْرَمْتُ عَمْرًا',
                'وَقَرَأْتُ كِتَابًا وَشَرِبْتُ خَمْرًا',
            ],
            translation: [
                'Maf\'ul bihi adalah fudhla',
                'Yang terjadi padanya fi\'il fa\'il',
                'Seperti dharabtu Zaidan dan akramtu \'Amran',
                'Dan qara-tu kitaaban dan syaribtu khamran',
            ],
            footnotes: [
                'Maf\'ul bihi: objek yang dikenai pekerjaan fa\'il',
                'Hukum: mansub selamanya',
                'Contoh: dharabtu Zaidan (aku memukul Zaid)',
                'Bisa dimajukan sebelum fa\'il: dharaba Zaidan \'Amrun',
            ]
        },
        {
            chapter: 31,
            title: 'Al-Musytaqaat (Kata Turunan)',
            content: [
                'الْمُشْتَقَّاتُ مِنَ الْفِعْلِ تُؤْخَذُ',
                'وَسَبْعَةُ أَنْوَاعٍ مِنْهَا تُعْتَمَدُ',
                'اسْمُ الْفَاعِلِ وَالْمَفْعُولِ كَذَا',
                'وَالصِّفَةُ الْمُشَبَّهَةُ أَيْضًا',
            ],
            translation: [
                'Musytaqqat dari fi\'il diambil',
                'Dan tujuh jenis darinya ditetapkan',
                'Isim fa\'il dan maf\'ul demikian',
                'Dan shifah musyabbahah juga',
            ],
            footnotes: [
                'Musytaqqat: kata yang diturunkan dari fi\'il',
                'Tujuh jenis: isim fa\'il, isim maf\'ul, shifah musyabbahah',
                'Isim tafdhil, isim zaman, isim makan, isim alat',
                'Lawan musytaqq adalah jamid (tidak ada asal fi\'il)',
            ]
        },
        {
            chapter: 32,
            title: 'Al-Jumuud (Kata Jamid)',
            content: [
                'وَالْجَامِدُ مَا لَا اشْتِقَاقَ لَهُ',
                'كَرَجُلٍ وَفَرَسٍ يَحْصُلُ',
                'وَشَمْسٍ وَقَمَرٍ وَحَجَرِ',
                'وَنَارٍ وَمَاءٍ فِي الْخَبَرِ',
            ],
            translation: [
                'Dan jamid yang tidak ada turunan untuknya',
                'Seperti rajul dan faras terjadi',
                'Dan syams, qamar, dan hajar',
                'Dan naar, maa\' dalam berita',
            ],
            footnotes: [
                'Jamid: kata yang tidak diturunkan dari fi\'il',
                'Isim jaamid: rajul, faras, syams, qamar',
                'Tidak berubah bentuk seperti musytaqq',
                'Contoh lain: daar (rumah), kitaab (buku), bahr (laut)',
            ]
        },
        {
            chapter: 33,
            title: 'At-Tawaabu\' (Yang Mengikuti)',
            content: [
                'التَّوَابِعُ أَرْبَعَةٌ تَتْبَعُ',
                'النَّعْتُ وَالْعَطْفُ وَالتَّوْكِيدُ تُجْمَعُ',
                'وَالْبَدَلُ رَابِعُهَا يَا صَاحِ',
                'فِي الْإِعْرَابِ تَتْبَعُ بِالْإِيضَاحِ',
            ],
            translation: [
                'Tawaabi\' ada empat yang mengikuti',
                'Na\'t, \'athf, dan taukid terkumpul',
                'Dan badal keempatnya wahai teman',
                'Dalam i\'rab mengikuti dengan jelas',
            ],
            footnotes: [
                'Tawaabi\': kata yang mengikuti kata sebelumnya dalam i\'rab',
                'Empat jenis: na\'t (sifat), \'athf (ataf), taukid (ta\'kid), badal (pengganti)',
                'Mengikuti kata sebelumnya dalam rafa\', nashab, jar',
                'Contoh na\'t: jaa-a ar-rajulu al-kabiiru (datang lelaki yang besar)',
            ]
        },
        {
            chapter: 34,
            title: 'An-Na\'t (Sifat)',
            content: [
                'النَّعْتُ تَابِعٌ لِمَنْعُوتِهِ',
                'فِي رَفْعِهِ وَنَصْبِهِ وَجَرِّهِ',
                'وَفِي التَّعْرِيفِ وَالتَّنْكِيرِ',
                'وَفِي التَّذْكِيرِ وَالتَّأْنِيثِ يَسِيرِ',
            ],
            translation: [
                'Na\'t mengikuti man\'ut-nya',
                'Dalam rafa\', nashab, dan jar-nya',
                'Dan dalam ta\'rif dan tankir',
                'Dan dalam tadzki dan ta\'nits mudah',
            ],
            footnotes: [
                'Na\'t (shifat): kata yang menjelaskan man\'ut (maushuf)',
                'Mengikuti 10 hal: i\'rab (rafa\', nashab, jar), ta\'rif-tankir',
                'Tadzki-ta\'nits, ifrad-tatsniyah-jam\'',
                'Contoh: jaa-a rajulun kariimu (datang lelaki mulia)',
            ]
        },
        {
            chapter: 35,
            title: 'Al-\'Atf (Ataf)',
            content: [
                'حُرُوفُ الْعَطْفِ تِسْعَةٌ فَقُلْ',
                'الْوَاوُ وَالْفَاءُ ثُمَّ حَتَّى بَلْ',
                'وَلَكِنْ وَأَوْ وَأَمْ وَلَا',
                'وَبَلْ تُفِيدُ الْإِضْرَابَ مُبْتَلَى',
            ],
            translation: [
                'Huruf \'athf sembilan maka ucapkan',
                'Wawu, faa, tsumma, hattaa, bal',
                'Dan lakin, au, am, dan laa',
                'Dan bal berfaidah idhraab yang diuji',
            ],
            footnotes: [
                '\'Athf: menghubungkan kata dengan huruf \'athf',
                'Sembilan huruf: waw, faa, tsumma, hattaa, bal, lakin, au, am, laa',
                'Ma\'thuf mengikuti ma\'thuf \'alaih dalam i\'rab',
                'Contoh: jaa-a Zaidun wa \'Amrun (datang Zaid dan Amr)',
            ]
        },
        {
            chapter: 36,
            title: 'At-Taukiid (Ta\'kid)',
            content: [
                'التَّوْكِيدُ لَفْظِيٌّ وَمَعْنَوِي',
                'بِتَكْرَارِ اللَّفْظِ أَوْ بِالْأَلْفَاظِ قَوِي',
                'كَنَفْسٍ وَعَيْنٍ وَكُلٍّ وَأَجْمَعَ',
                'وَأَكْتَعَ وَأَبْصَعَ وَأَبْتَعَ تَجَمَّعَ',
            ],
            translation: [
                'Taukid lafzhi dan ma\'nawi',
                'Dengan mengulang lafaz atau dengan lafaz-lafaz kuat',
                'Seperti nafs, \'ain, kull, dan ajma\'',
                'Dan akta\', absha\', dan abta\' berkumpul',
            ],
            footnotes: [
                'Taukid: penguat untuk menghilangkan keraguan',
                'Dua jenis: lafzhi (mengulang kata), ma\'nawi (kata khusus)',
                'Taukid ma\'nawi: nafs, \'ain, kull, ajma\', akta\', absha\', abta\'',
                'Contoh: jaa-az-Zaidu nafsuhu (datang Zaid sendiri)',
            ]
        },
        {
            chapter: 37,
            title: 'Al-Badal (Badal)',
            content: [
                'الْبَدَلُ أَرْبَعَةُ أَقْسَامٍ',
                'بَدَلُ كُلٍّ مِنْ كُلٍّ فِي الْأَنَامِ',
                'وَبَدَلُ بَعْضٍ مِنْ كُلٍّ كَذَا',
                'وَبَدَلُ الِاشْتِمَالِ وَالْغَلَطِ أَيْضًا',
            ],
            translation: [
                'Badal ada empat bagian',
                'Badal kull min kull untuk manusia',
                'Dan badal ba\'dh min kull demikian',
                'Dan badal isytimaal dan ghalath juga',
            ],
            footnotes: [
                'Badal: pengganti (taabi\' keempat)',
                'Empat jenis: kull min kull (seluruh dari seluruh), ba\'dh min kull (sebagian dari seluruh)',
                'Isytimaal (mengandung), idhraab (salah)',
                'Contoh badal kull: jaa-a Zaydun akhuka (datang Zaid saudaramu)',
            ]
        },
        {
            chapter: 38,
            title: 'Al-\'Adad (Bilangan)',
            content: [
                'الْعَدَدُ ثَلَاثَةُ أَقْسَامٍ',
                'مُفْرَدٌ وَمُرَكَّبٌ وَمَعْطُوفٌ فِي الْأَعْوَامِ',
                'مِنْ وَاحِدٍ إِلَى الْعَشَرَةِ',
                'وَأَحَدَ عَشَرَ إِلَى تِسْعَةَ عَشَرَةِ',
            ],
            translation: [
                '\'Adad ada tiga bagian',
                'Mufrad, murakkab, dan ma\'thuf dalam tahun-tahun',
                'Dari waahid sampai \'asyarah',
                'Dan ahada \'asyara sampai tis\'ata \'asyarata',
            ],
            footnotes: [
                '\'Adad (bilangan) tiga jenis: mufrad (1-10), murakkab (11-19), ma\'thuf (21-99)',
                '3-10 mudzakkar dengan ma\'duud muannats, dan sebaliknya',
                '11-12 sesuai jenis ma\'duud',
                'Contoh: tsalaatsatu rijaalan (3 lelaki), tsalaastu nisaa-in (3 perempuan)',
            ]
        },
        {
            chapter: 39,
            title: 'Al-Ma\'aarif (Yang Ma\'rifah)',
            content: [
                'الْمَعَارِفُ سَبْعَةٌ تُعَدُّ',
                'الضَّمِيرُ وَالْعَلَمُ يُعْتَمَدُ',
                'وَاسْمُ الْإِشَارَةِ وَالْمَوْصُولُ',
                'وَالْمُعَرَّفُ بِأَلْ وَالْمُضَافُ مَقْبُولُ',
            ],
            translation: [
                'Ma\'arif ada tujuh dihitung',
                'Dhamir dan \'alam ditetapkan',
                'Dan isim isyarah dan maushul',
                'Dan mu\'arraf dengan al dan mudhaaf diterima',
            ],
            footnotes: [
                'Ma\'rifah: kata yang menunjuk sesuatu yang sudah diketahui',
                'Tujuh jenis: dhamir (ana, anta), \'alam (Zaid, Makkah)',
                'Isim isyarah (hadzaa, dzaalika), isim maushul (alladzi, allati)',
                'Mu\'arraf bi-al (ar-rajul), mudhaaf ilaa ma\'rifah (kitabu Zayd)',
            ]
        },
        {
            chapter: 40,
            title: 'Adh-Dhamaa\'ir (Kata Ganti)',
            content: [
                'الضَّمَائِرُ بَارِزَةٌ وَمُسْتَتِرَهْ',
                'وَالْبَارِزُ مُتَّصِلٌ وَمُنْفَصِلٌ ظَاهِرَهْ',
                'كَأَنَا وَنَحْنُ وَأَنْتَ وَهُوَ',
                'وَهِيَ وَهُمْ وَهُنَّ تَجْمَعُ النُّورُ',
            ],
            translation: [
                'Dhamaa-ir barizah dan mustatir',
                'Dan bariz muttashil dan munfashil jelas',
                'Seperti ana, nahnu, anta, dan huwa',
                'Dan hiya, hum, hunna mengumpulkan cahaya',
            ],
            footnotes: [
                'Dhamir: kata ganti (ma\'rifah pertama)',
                'Dua jenis: bariz (jelas: ana, anta, huwa) dan mustatir (tersembunyi)',
                'Bariz: muttashil (bersambung: -tu, -ka, -hu) dan munfashil (terpisah: ana, anta)',
                'Contoh: dharabtuhu (aku memukulnya) - tu dan hu adalah dhamir muttashil',
            ]
        },
        {
            chapter: 41,
            title: 'Al-\'Alam (Nama Diri)',
            content: [
                'الْعَلَمُ مَا وُضِعَ لِذَاتٍ بِعَيْنِهَا',
                'مِنْ غَيْرِ قَرِينَةٍ تُبَيِّنُهَا',
                'كَزَيْدٍ وَعَمْرٍو وَمُحَمَّدِ',
                'وَفَاطِمَةَ وَمَكَّةَ الْمُعَظَّمَةِ',
            ],
            translation: [
                '\'Alam yang diletakkan untuk dzat tertentu',
                'Tanpa qarinah yang menjelaskannya',
                'Seperti Zaid, \'Amr, dan Muhammad',
                'Dan Fathimah, Makkah yang dimuliakan',
            ],
            footnotes: [
                '\'Alam: nama diri orang/tempat (ma\'rifah kedua)',
                'Tidak butuh qarinah untuk dikenal',
                'Dua jenis: isim (Zaid, Ahmad) dan kuniyah (Abu Bakar)',
                'Contoh: Muhammad, Fathimah, Makkah, Madinah',
            ]
        },
        {
            chapter: 42,
            title: 'Ism al-Isyaarah (Kata Tunjuk)',
            content: [
                'أَسْمَاءُ الْإِشَارَةِ لِلْقَرِيبِ',
                'ذَا وَذِي وَذِهِ وَذَاكَ نَسِيبِ',
                'وَلِلْبَعِيدِ ذَلِكَ وَتِلْكَ',
                'وَأُولَئِكَ لِلْجَمْعِ يَمْلِكَ',
            ],
            translation: [
                'Isim isyarah untuk yang dekat',
                'Dzaa, dzi, dzihi, dan dzaaka kerabat',
                'Dan untuk yang jauh dzaalika dan tilka',
                'Dan ulaa-ika untuk jamak memiliki',
            ],
            footnotes: [
                'Isim isyarah: kata tunjuk (ma\'rifah ketiga)',
                'Untuk dekat: hadzaa (mudzakkar), hadzihi (muannats)',
                'Untuk jauh: dzaalika (mudzakkar), tilka (muannats)',
                'Untuk jamak: haa-ulaa-i, ulaa-ika',
            ]
        },
        {
            chapter: 43,
            title: 'Al-Mawsuul (Kata Penghubung)',
            content: [
                'الْأَسْمَاءُ الْمَوْصُولَةُ سَبْعَهْ',
                'الَّذِي وَالَّتِي وَاللَّذَانِ رَفْعَهْ',
                'وَاللَّتَانِ وَالَّذِينَ وَاللَّاتِي',
                'وَمَنْ وَمَا لِكُلِّ جِنْسٍ آتِي',
            ],
            translation: [
                'Isim maushul ada tujuh',
                'Alladzi, allati, dan allaadzaani rafa\'',
                'Dan allataani, alladziina, dan allaati',
                'Dan man, maa untuk setiap jenis datang',
            ],
            footnotes: [
                'Isim maushul: kata penghubung (ma\'rifah keempat)',
                'Alladzi (mudzakkar mufrad), allati (muannats mufrad)',
                'Alladziina (mudzakkar jamak), allaati/allawaati (muannats jamak)',
                'Man (untuk \'aaqil), maa (untuk ghairu \'aaqil)',
            ]
        },
        {
            chapter: 44,
            title: 'Al-Mu\'arraf bil Alif wal Lam',
            content: [
                'وَالْمُعَرَّفُ بِأَلْ يَصِيرُ مَعْرِفَهْ',
                'كَالرَّجُلِ وَالْمَرْأَةِ الشَّرِيفَهْ',
                'وَالْكِتَابِ وَالْقَلَمِ وَالْبَيْتِ',
                'وَالْمَسْجِدِ وَالْمَدْرَسَةِ بِالتَّثْبِيتِ',
            ],
            translation: [
                'Dan yang di-ta\'rif dengan al menjadi ma\'rifah',
                'Seperti ar-rajul dan al-mar-ah yang mulia',
                'Dan al-kitaab, al-qalam, dan al-bait',
                'Dan al-masjid, al-madrasah dengan penetapan',
            ],
            footnotes: [
                'Mu\'arraf bi al: kata dengan alif lam (ma\'rifah kelima)',
                'Al- mengubah nakirah menjadi ma\'rifah',
                'Contoh: rajul (nakirah) → ar-rajul (ma\'rifah)',
                'Al- untuk jins (seluruh jenis) atau \'ahd (yang sudah dikenal)',
            ]
        },
        {
            chapter: 45,
            title: 'Al-Mudhaf (Yang Diidhafahkan)',
            content: [
                'الْمُضَافُ إِلَى مَعْرِفَةٍ مُعَرَّفُ',
                'كَغُلَامِ زَيْدٍ وَكِتَابِ الْمُصْحَفِ',
                'وَالْمُضَافُ لَا يُنَوَّنُ أَبَدَا',
                'وَلَا يَدْخُلُ عَلَيْهِ أَلْ مُؤَكَّدَا',
            ],
            translation: [
                'Mudhaaf kepada ma\'rifah menjadi mu\'arraf',
                'Seperti ghulaami Zaid dan kitaabil mushaf',
                'Dan mudhaaf tidak ditanwin selamanya',
                'Dan tidak masuk padanya al dengan pasti',
            ],
            footnotes: [
                'Mudhaaf: kata yang di-idhafahkan (ma\'rifah keenam)',
                'Mudhaaf ilaa ma\'rifah menjadi ma\'rifah',
                'Tidak boleh ditanwin dan tidak boleh ber-al',
                'Contoh: kitaabu Zayd (kitabnya Zaid), baituth-thaalib (rumah siswa)',
            ]
        },
        {
            chapter: 46,
            title: 'An-Nakirah (Yang Nakirah)',
            content: [
                'النَّكِرَةُ مَا دَلَّ عَلَى شَائِعِ',
                'مِنْ جِنْسِهِ كَرَجُلٍ وَطَائِعِ',
                'وَكِتَابٍ وَقَلَمٍ وَبَيْتِ',
                'وَمَسْجِدٍ وَمَدْرَسَةٍ بِالتَّثْبِيتِ',
            ],
            translation: [
                'Nakirah yang menunjukkan umum',
                'Dari jenisnya seperti rajul dan thaa-i\'',
                'Dan kitaab, qalam, dan bait',
                'Dan masjid, madrasah dengan penetapan',
            ],
            footnotes: [
                'Nakirah: kata yang tidak tertentu, umum',
                'Lawan ma\'rifah - menunjukkan jenis tanpa menentukan',
                'Contoh: rajulun (seorang lelaki - tidak tahu siapa)',
                'Bisa dita\'rifkan dengan cara: al-, idhaafah, dhamir, dll',
            ]
        },
        {
            chapter: 47,
            title: 'Al-Istifhaam (Pertanyaan)',
            content: [
                'أَدَوَاتُ الِاسْتِفْهَامِ مُتَعَدِّدَهْ',
                'هَلْ وَالْهَمْزَةُ لِلتَّصْدِيقِ مُعْتَمَدَهْ',
                'وَمَنْ لِلْعَاقِلِ وَمَا لِغَيْرِهِ',
                'وَأَيْنَ وَمَتَى وَكَيْفَ لِتَمْيِيزِهِ',
            ],
            translation: [
                'Adat istifham beraneka',
                'Hal dan hamzah untuk tashdiq ditetapkan',
                'Dan man untuk \'aaqil dan maa untuk selainnya',
                'Dan aina, mataa, dan kaifa untuk membedakannya',
            ],
            footnotes: [
                'Istifhaam: pertanyaan menggunakan adat khusus',
                'Hal/hamzah: ya/tidak (hal jaa-a Zaidun?)',
                'Man: siapa (untuk \'aaqil), maa: apa (ghairu \'aaqil)',
                'Aina: dimana, mataa: kapan, kaifa: bagaimana, kam: berapa',
            ]
        },
        {
            chapter: 48,
            title: 'Ash-Shart (Syarat)',
            content: [
                'أَدَوَاتُ الشَّرْطِ تَجْزِمُ فِعْلَيْنِ',
                'فِعْلَ الشَّرْطِ وَجَابَهُ مُبِينَيْنِ',
                'كَإِنْ وَمَنْ وَمَا وَمَهْمَا',
                'وَأَيْنَمَا وَأَنَّى وَمَتَى تَمَّا',
            ],
            translation: [
                'Adat syarat men-jazim dua fi\'il',
                'Fi\'il syarat dan jawabannya jelas',
                'Seperti in, man, maa, dan mahmaa',
                'Dan ainamaa, annaa, dan mataa sempurna',
            ],
            footnotes: [
                'Syarat: kalimat bersyarat dengan adat jazim',
                'Men-jazim fi\'il syarat dan fi\'il jawab',
                'Contoh: in tadrus tanjah (jika kamu belajar, kamu berhasil)',
                'Adat: in, man, maa, mahmaa, ainamaa, annaa, mataa, ayyaa',
            ]
        },
        {
            chapter: 49,
            title: 'Al-Qasam (Sumpah)',
            content: [
                'حُرُوفُ الْقَسَمِ ثَلَاثَةٌ تُعَدُّ',
                'الْوَاوُ وَالْبَاءُ وَالتَّاءُ تُعْتَمَدُ',
                'كَوَاللهِ وَبِاللهِ وَتَاللهِ',
                'وَجَوَابُهُ يَكُونُ بِاللَّامِ وَالنُّونِ فَاللهِ',
            ],
            translation: [
                'Huruf qasam ada tiga dihitung',
                'Wawu, baa, dan taa ditetapkan',
                'Seperti wallahi, billahi, dan tallahi',
                'Dan jawabannya dengan lam dan nun wallahi',
            ],
            footnotes: [
                'Qasam: sumpah menggunakan huruf khusus',
                'Tiga huruf: waw (wallahi), baa (billahi), taa (tallahi)',
                'Jawab qasam: jumlah ismiyyah dengan lam (laqad), jumlah fi\'liyyah dengan la',
                'Contoh: wallahi la-Zaidun qaa-imun (demi Allah, Zaid benar-benar berdiri)',
            ]
        },
        {
            chapter: 50,
            title: 'At-Ta\'ajjub (Keheranan)',
            content: [
                'التَّعَجُّبُ بِصِيغَتَيْنِ يَأْتِي',
                'مَا أَفْعَلَهُ وَأَفْعِلْ بِهِ آتِي',
                'كَمَا أَحْسَنَ زَيْدًا وَأَكْرِمْ بِهِ',
                'مِنْ فِعْلٍ ثُلَاثِيٍّ تَامٍّ مُثْبِتِهِ',
            ],
            translation: [
                'Ta\'ajjub dengan dua shighah datang',
                'Maa af\'alahu dan af\'il bihi datang',
                'Seperti maa ahsana Zaidan dan akrimbih',
                'Dari fi\'il tsulasi tamm yang ditetapkan',
            ],
            footnotes: [
                'Ta\'ajjub: ungkapan keheranan/kagum',
                'Dua shighah: maa af\'alahu (maa ahsana Zaidan - alangkah baiknya Zaid)',
                'Af\'il bihi (akrimbih - betapa mulianya dia)',
                'Syarat: tsulasi, muta\'addi/lazim mutasharrif, mutsbit, mabni ma\'lum, laisa af\'al',
            ]
        },
        {
            chapter: 51,
            title: 'Al-Madh wadh-Dhamm (Pujian dan Celaan)',
            content: [
                'نِعْمَ وَبِئْسَ لِلْمَدْحِ وَالذَّمِّ',
                'يَرْفَعَانِ فَاعِلًا مَعْرُوفًا بِالْفَهْمِ',
                'كَنِعْمَ الرَّجُلُ زَيْدٌ',
                'وَبِئْسَ الْعَبْدُ الظَّالِمُ الْعَنِيدُ',
            ],
            translation: [
                'Ni\'ma dan bi-sa untuk pujian dan celaan',
                'Keduanya men-rafa\' fa\'il yang dikenal dengan pemahaman',
                'Seperti ni\'mar-rajulu Zaid',
                'Dan bi-sal-\'abdu adh-dhaalimu al-\'aniid',
            ],
            footnotes: [
                'Madh: pujian dengan ni\'ma, habba, nabba',
                'Dhamm: celaan dengan bi\'sa, saa-a',
                'Fa\'il setelahnya: mu\'arraf bi-al atau mudhaaf',
                'Contoh: ni\'mar-rajulu Zaidun (Zaid sebaik-baik lelaki)',
            ]
        },
        {
            chapter: 52,
            title: 'Al-Ikhtishaas (Pengkhususan)',
            content: [
                'أَخُصُّ بِنَحْنُ ثُمَّ نَصْبُ الْمَخْصُوصِ',
                'كَنَحْنُ الْعَرَبَ أَكْرَمُ النَّاسِ فِي الْخُصُوصِ',
                'وَنَحْنُ الْمُسْلِمِينَ أَهْلَ الْإِيمَانِ',
                'نَحْنُ الْعُلَمَاءَ نُعَلِّمُ الْإِنْسَانَ',
            ],
            translation: [
                'Aku mengkhususkan dengan nahnu lalu nashab yang dikhususkan',
                'Seperti nahnul-\'araba akramun-naas dalam pengkhususan',
                'Dan nahnul-muslimiina ahlal-iimaan',
                'Nahnul-\'ulamaa-a nu\'allimul-insaan',
            ],
            footnotes: [
                'Ikhtishaas: pengkhususan dengan dhamir nahnu/ana',
                'Makhshuush: mansub setelah dhamir',
                'Contoh: nahnu-l-\'araba akramun-naas (kami bangsa Arab, paling mulia)',
                'Menunjukkan kebanggaan/pengkhususan terhadap kelompok',
            ]
        },
        {
            chapter: 53,
            title: 'Al-Ighraa\' wat-Tahdziir (Anjuran dan Peringatan)',
            content: [
                'الْإِغْرَاءُ وَالتَّحْذِيرُ نَصْبٌ يَلْزَمُ',
                'كَالصِّدْقَ الصِّدْقَ وَإِيَّاكَ وَالْكَذِبَ تَفْهَمُ',
                'وَالزَمْ طَرِيقَ الْحَقِّ وَالْخَيْرَا',
                'وَاحْذَرْ طَرِيقَ الشَّرِّ وَالضَّيْرَا',
            ],
            translation: [
                'Ighraa dan tahdziir nashab harus',
                'Seperti ash-shidqa ash-shidqa dan iyyaaka wal-kadziba kamu pahami',
                'Dan tetaplah jalan kebenaran dan kebaikan',
                'Dan hati-hatilah jalan keburukan dan bahaya',
            ],
            footnotes: [
                'Ighraa: mendorong untuk melakukan sesuatu',
                'Tahdziir: memperingatkan dari sesuatu',
                'Mughraahu/muhadzdzaru: mansub (fi\'il mahdzuf)',
                'Contoh: ash-shidqa (hendaklah jujur), iyyaaka wal-kadziba (jauhilah dusta)',
            ]
        },
        {
            chapter: 54,
            title: 'Al-Ism al-Manquus (Isim Manqush)',
            content: [
                'الِاسْمُ الْمَنْقُوصُ مَا آخِرُهُ يَاءْ',
                'لَازِمَةٌ مَكْسُورٌ مَا قَبْلَهَا بِالْإِمْضَاءْ',
                'كَالْقَاضِي وَالدَّاعِي وَالسَّاعِي',
                'وَالرَّاضِي وَالْبَاكِي وَالْمَاضِي',
            ],
            translation: [
                'Isim manqush yang akhirnya ya',
                'Tetap, dikasrah sebelumnya dengan kepastian',
                'Seperti al-qaadhi, ad-daa\'i, dan as-saa\'i',
                'Dan ar-raadhi, al-baaki, dan al-maadhi',
            ],
            footnotes: [
                'Isim manqush: isim berakhiran ya dengan kasrah sebelumnya',
                'Ya-nya tetap (lazimah), bukan ya mutsannaa/jam\'',
                'Contoh: al-qaadhi (hakim), ad-daa\'i (pendakwah)',
                'Jika nakirah tanpa al: ya-nya bisa dihapus (qaadin)',
            ]
        },
        {
            chapter: 55,
            title: 'Al-Ism al-Maqsuur (Isim Maqshur)',
            content: [
                'الِاسْمُ الْمَقْصُورُ مَا آخِرُهُ أَلِفْ',
                'لَازِمَةٌ كَالْفَتَى وَالْهُدَى وَالرِّضَا أُلِفْ',
                'وَمُوسَى وَعِيسَى وَيَحْيَى',
                'وَالْمُصْطَفَى وَالْمُرْتَضَى سَمَا',
            ],
            translation: [
                'Isim maqshur yang akhirnya alif',
                'Tetap seperti al-fataa, al-hudaa, dan ar-ridhaa dikenal',
                'Dan Muusaa, \'Iisaa, dan Yahyaa',
                'Dan al-Mushthafaa, al-Murtadhaa tinggi',
            ],
            footnotes: [
                'Isim maqshur: isim berakhiran alif lazimah',
                'Alif ditulis ya jika lebih dari 3 huruf: al-hudaa',
                'Alif ditulis alif jika 3 huruf: al-\'ashaa',
                'Contoh: al-fataa (pemuda), Muusaa (Musa), \'Iisaa (Isa)',
            ]
        },
        {
            chapter: 56,
            title: 'Al-Ism al-Mamdud (Isim Mamdud)',
            content: [
                'الِاسْمُ الْمَمْدُودُ مَا آخِرُهُ هَمْزَةْ',
                'قَبْلَهَا أَلِفٌ زَائِدَةٌ مُمْتَازَةْ',
                'كَالصَّحْرَاءِ وَالسَّمَاءِ وَالْبَيْدَاءِ',
                'وَالْحَمْرَاءِ وَالْخَضْرَاءِ وَالنَّجْلَاءِ',
            ],
            translation: [
                'Isim mamdud yang akhirnya hamzah',
                'Sebelumnya alif za-idah istimewa',
                'Seperti ash-shahraa, as-samaa, dan al-baidaa',
                'Dan al-hamraa, al-khadhraa, dan an-najlaa',
            ],
            footnotes: [
                'Isim mamdud: isim berakhiran hamzah dengan alif sebelumnya',
                'Alif-nya za-idah (tambahan)',
                'Contoh: ash-shahraa (gurun), as-samaa (langit)',
                'Sering untuk warna/cacat: al-hamraa (merah), al-\'amyaa (buta)',
            ]
        },
        {
            chapter: 57,
            title: 'Jam\' at-Taksiir (Jamak Taksir)',
            content: [
                'جَمْعُ التَّكْسِيرِ مَا تَغَيَّرَ بِنَاءْ',
                'مُفْرَدِهِ كَرِجَالٍ وَبُيُوتٍ جَاءْ',
                'وَكُتُبٍ وَأَقْلَامٍ وَمَسَاجِدَ',
                'وَمَدَارِسَ وَطُلَّابٍ وَقَوَاعِدَ',
            ],
            translation: [
                'Jam\' taksir yang berubah bangunan',
                'Mufrad-nya seperti rijaal dan buyuut datang',
                'Dan kutub, aqlaam, dan masaajid',
                'Dan madaaris, thullaab, dan qawaa\'id',
            ],
            footnotes: [
                'Jam\' taksir: jamak dengan mengubah bentuk mufrad',
                'Banyak wazan: af\'aal (akbaar), fu\'uul (buyuut), fi\'aal (rijaal)',
                'Lawan jam\' salim yang hanya menambah huruf',
                'Contoh: rajul → rijaal, bait → buyuut, kitaab → kutub',
            ]
        },
        {
            chapter: 58,
            title: 'Jam\' al-Mudhakkar as-Saalim',
            content: [
                'جَمْعُ الْمُذَكَّرِ السَّالِمُ بِوَاوٍ وَنُونْ',
                'فِي حَالَةِ الرَّفْعِ كَمُعَلِّمُونَ',
                'وَبِيَاءٍ وَنُونٍ فِي النَّصْبِ وَالْجَرِّ',
                'كَمُعَلِّمِينَ فِي الْإِعْرَابِ يَجْرِي',
            ],
            translation: [
                'Jam\' mudzakkar salim dengan waw dan nun',
                'Dalam keadaan rafa\' seperti mu\'allimuun',
                'Dan dengan ya dan nun dalam nashab dan jar',
                'Seperti mu\'allimiina dalam i\'rab berjalan',
            ],
            footnotes: [
                'Jam\' mudzakkar salim: jamak mudzakkar tanpa mengubah mufrad',
                'Rafa\': -uun (mu\'allimuun), nashab/jar: -iin (mu\'allimiina)',
                'Untuk \'aaqil, \'alam/shifah mudzakkar',
                'Contoh: muslim → muslimuun/muslimiina',
            ]
        },
        {
            chapter: 59,
            title: 'Jam\' al-Mu\'annath as-Saalim',
            content: [
                'جَمْعُ الْمُؤَنَّثِ السَّالِمُ بِأَلِفٍ وَتَاءْ',
                'يُرْفَعُ بِالضَّمَّةِ فِي كُلِّ الْأَرْجَاءْ',
                'وَيُنْصَبُ وَيُجَرُّ بِالْكَسْرَةِ',
                'كَمُعَلِّمَاتٍ فِي كُلِّ مَرَّةِ',
            ],
            translation: [
                'Jam\' muannats salim dengan alif dan ta',
                'Di-rafa\' dengan dhammah di semua penjuru',
                'Dan di-nashab dan di-jar dengan kasrah',
                'Seperti mu\'allimaatun setiap kali',
            ],
            footnotes: [
                'Jam\' muannats salim: jamak muannats dengan -aat',
                'Rafa\': -aatun (dhammah), nashab/jar: -aatin (kasrah)',
                'Untuk muannats lafzhan/ma\'naa, \'aaqil/ghairu \'aaqil',
                'Contoh: muslimah → muslimaatun/muslimaatin',
            ]
        },
        {
            chapter: 60,
            title: 'Al-Mutsannaa (Bentuk Dual)',
            content: [
                'الْمُثَنَّى مَا دَلَّ عَلَى اثْنَيْنِ',
                'بِزِيَادَةِ أَلِفٍ وَنُونٍ مُبِينَيْنِ',
                'فِي الرَّفْعِ كَالطَّالِبَانِ',
                'وَفِي النَّصْبِ وَالْجَرِّ طَالِبَيْنِ بَانِ',
            ],
            translation: [
                'Mutsannaa yang menunjuk dua',
                'Dengan tambahan alif dan nun yang jelas',
                'Dalam rafa\' seperti ath-thalibaani',
                'Dan dalam nashab dan jar thalibaini jelas',
            ],
            footnotes: [
                'Mutsannaa: bentuk dual (dua)',
                'Rafa\': -aani (ath-thalibaani), nashab/jar: -aini (ath-thalibaini)',
                'Dibentuk dari mufrad + alif/ya + nun',
                'Contoh: muslim → muslimaani/muslimaini',
            ]
        },
        {
            chapter: 61,
            title: 'Al-Ism al-Mawsuuf (Isim yang Disifati)',
            content: [
                'الْمَوْصُوفُ وَالصِّفَةُ يَتَّفِقَانِ',
                'فِي الْإِعْرَابِ وَالتَّعْرِيفِ وَالْعَدَدِ يَسِيرَانِ',
                'وَالتَّذْكِيرِ وَالتَّأْنِيثِ سَوَاءْ',
                'كَرَجُلٌ كَرِيمٌ وَامْرَأَةٌ كَرِيمَةٌ جَاءْ',
            ],
            translation: [
                'Maushuf dan shifah bersepakat',
                'Dalam i\'rab, ta\'rif, dan \'adad berjalan',
                'Dan tadzki dan ta\'nits sama',
                'Seperti rajulun kariimun dan imra-atun kariimatu datang',
            ],
            footnotes: [
                'Maushuf: yang disifati, shifah: sifat (na\'t)',
                'Harus cocok dalam 10 hal: i\'rab, ta\'rif/tankir, tadzki/ta\'nits, ifrad/tatsniyah/jam\'',
                'Contoh: jaa-a rajulun kariimun (datang lelaki mulia)',
                'Shifah mengikuti maushuf dalam semua hal',
            ]
        },
        {
            chapter: 62,
            title: 'Al-Huruf al-Musyabbahah bil Fi\'l',
            content: [
                'الْحُرُوفُ الْمُشَبَّهَةُ بِالْفِعْلِ سِتَّةْ',
                'إِنَّ وَأَنَّ وَلَكِنَّ وَكَأَنَّ مُثْبِتَةْ',
                'وَلَيْتَ وَلَعَلَّ تَعْمَلُ',
                'كَإِنَّ اللهَ غَفُورٌ يَكْمُلُ',
            ],
            translation: [
                'Huruf musyabbahah bil fi\'il ada enam',
                'Inna, anna, lakinna, dan ka-anna ditetapkan',
                'Dan laita, la\'alla beramal',
                'Seperti innallaaha ghafuurun sempurna',
            ],
            footnotes: [
                'Huruf musyabbahah: menyerupai fi\'il (seperti inna)',
                'Men-nashab isim, men-rafa\' khabar',
                'Inna/anna: sesungguhnya, lakinna: tetapi, ka-anna: seolah',
                'Laita: andai, la\'alla: mudah-mudahan',
            ]
        },
        {
            chapter: 63,
            title: 'Laa an-Naafiyah lil Jins',
            content: [
                'لَا النَّافِيَةُ لِلْجِنْسِ تَنْصِبُ',
                'الِاسْمَ وَتَرْفَعُ الْخَبَرَ وَتُرَتِّبُ',
                'كَلَا رَجُلَ فِي الدَّارِ',
                'وَلَا طَالِبَ عِلْمٍ حَاضِرٌ فِي الدِّيَارِ',
            ],
            translation: [
                'Laa naafiyah lil jins men-nashab',
                'Isim dan men-rafa\' khabar dan menyusun',
                'Seperti laa rajula fiid-daar',
                'Dan laa thaaliba \'ilmin haadhirun fid-diyaar',
            ],
            footnotes: [
                'Laa naafiyah lil jins: meniadakan seluruh jenis',
                'Beramal seperti inna: nashab isim, rafa\' khabar',
                'Isim-nya mabni pada fathah jika mufrad',
                'Contoh: laa rajula fiid-daar (tidak ada lelaki di rumah)',
            ]
        },
        {
            chapter: 64,
            title: 'Maa al-Hijaziyyah (Maa Hijaziyah)',
            content: [
                'مَا الْحِجَازِيَّةُ تَعْمَلُ عَمَلَ لَيْسَ',
                'تَرْفَعُ الِاسْمَ وَتَنْصِبُ الْخَبَرَ لَيْسَ',
                'كَمَا زَيْدٌ قَائِمًا',
                'وَمَا مُحَمَّدٌ حَاضِرًا دَائِمًا',
            ],
            translation: [
                'Maa hijaziyah beramal seperti laisa',
                'Men-rafa\' isim dan men-nashab khabar bukan',
                'Seperti maa Zaidun qaa-iman',
                'Dan maa Muhammadun haadhiran selamanya',
            ],
            footnotes: [
                'Maa hijaziyah: maa yang beramal seperti laisa',
                'Dari bahasa penduduk Hijaz (Makkah-Madinah)',
                'Men-rafa\' isim, men-nashab khabar',
                'Contoh: maa hadzaa basyaran (ini bukan manusia)',
            ]
        },
        {
            chapter: 65,
            title: 'Af\'aal al-Qulub (Fi\'il Hati)',
            content: [
                'أَفْعَالُ الْقُلُوبِ تَنْصِبُ مَفْعُولَيْنِ',
                'أَصْلُهُمَا مُبْتَدَأٌ وَخَبَرٌ مُبِينَيْنِ',
                'كَظَنَنْتُ زَيْدًا قَائِمًا',
                'وَعَلِمْتُ مُحَمَّدًا عَالِمًا',
            ],
            translation: [
                'Af\'aal quluub men-nashab dua maf\'ul',
                'Asalnya mubtada dan khabar jelas',
                'Seperti dhanantu Zaidan qaa-iman',
                'Dan \'alimtu Muhammadan \'aaliman',
            ],
            footnotes: [
                'Af\'aal quluub: fi\'il yang berkaitan dengan hati/pikiran',
                'Men-nashab dua maf\'ul (asal mubtada-khabar)',
                'Tujuh fi\'il: dhanna, hasiba, khaala, za\'ama, \'alima, ra-aa, wajada',
                'Contoh: dhanantu Zaidan qaa-iman (aku mengira Zaid berdiri)',
            ]
        },
        {
            chapter: 66,
            title: 'Af\'aal at-Tahwil (Fi\'il Perubahan)',
            content: [
                'أَفْعَالُ التَّحْوِيلِ تَنْصِبُ كَذَلِكَ',
                'مَفْعُولَيْنِ فِي الْكَلَامِ تَمْلِكَ',
                'كَصَيَّرْتُ الطِّينَ إِنَاءً',
                'وَجَعَلْتُ الْخَشَبَ بَابًا',
            ],
            translation: [
                'Af\'aal tahwil men-nashab demikian',
                'Dua maf\'ul dalam kalam memiliki',
                'Seperti shayyartuth-thiina inaa-an',
                'Dan ja\'altul-khasyaba baaban',
            ],
            footnotes: [
                'Af\'aal tahwil: fi\'il yang menunjukkan perubahan',
                'Men-nashab dua maf\'ul (asalnya mubtada-khabar)',
                'Tujuh fi\'il: shayara, ja\'ala, radda, takhadzha, taraka, wahabha',
                'Contoh: shayyartuth-thiina inaa-an (aku jadikan tanah bejana)',
            ]
        },
        {
            chapter: 67,
            title: 'Al-Mumanu\' min as-Sarf (Yang Tidak Ditanwin)',
            content: [
                'الْمَمْنُوعُ مِنَ الصَّرْفِ لَا يُنَوَّنُ',
                'وَيُجَرُّ بِالْفَتْحَةِ وَلَا يُمَكَّنُ',
                'كَأَحْمَدَ وَمَسَاجِدَ وَأَفْضَلَ',
                'وَفَاطِمَةَ وَعُثْمَانَ قَدْ كَمَلَ',
            ],
            translation: [
                'Mamnu\' min ash-sharf tidak ditanwin',
                'Dan di-jar dengan fathah dan tidak dimungkinkan',
                'Seperti Ahmad, masaajid, dan afdhal',
                'Dan Fathimah, \'Utsman telah sempurna',
            ],
            footnotes: [
                'Mamnu\' min ash-sharf: tidak menerima tanwin dan jar-nya fathah',
                'Sebab: dua \'illat (\'alam+wazan fi\'il, jam\' taksir, dll)',
                'Contoh: Ahmad (\'alam+wazan fi\'il), masaajid (jam\' taksir muntha alif-nun)',
                'Jika ber-al atau mudhaaf, boleh di-jar dengan kasrah',
            ]
        },
        {
            chapter: 68,
            title: 'Khatimah (Penutup)',
            content: [
                'وَهَذِهِ خُلَاصَةُ الْأَلْفِيَّةْ',
                'فِي أَلْفِ بَيْتٍ حَاوِيَةٍ كَافِيَةْ',
                'فَاحْفَظْهَا وَافْهَمْهَا تَكُنْ عَالِمَا',
                'بِالنَّحْوِ وَالصَّرْفِ فَهِيمًا فَاهِمَا',
                'وَصَلَّى اللهُ عَلَى خَيْرِ الْوَرَى',
                'مُحَمَّدٍ وَآلِهِ خَيْرِ الْقُرَى',
            ],
            translation: [
                'Dan inilah ringkasan Alfiyyah',
                'Dalam seribu bait yang menampung dan mencukupi',
                'Maka hafalkan dan pahami menjadilah engkau berilmu',
                'Dengan nahwu dan sharaf yang paham dan mengerti',
                'Dan semoga Allah memberi shalawat kepada sebaik-baik makhluk',
                'Muhammad dan keluarganya sebaik-baik negeri',
            ],
            footnotes: [
                'Khatimah: penutup kitab Alfiyyah Ibn Malik',
                'Alfiyyah: 1000 bait nazham tentang nahwu dan sharaf',
                'Dikarang oleh Imam Ibn Malik (w. 672 H)',
                'Kitab paling masyhur untuk belajar nahwu tingkat lanjut',
            ]
        }
    ];

    // imritiContent is now imported from '../data/imritiData'


    // qawaidContent is now imported from '../data/qawaidData'

    const getKitabContent = (kitabId: string): KitabContent[] => {
        switch (kitabId) {
            case 'alfiyah': return alfiyahContent;
            case 'ajurrumiyah': return ajurrumiyahContent;
            case 'imriti': return imritiContent;
            case 'qawaid': return qawaidContent;
            case 'aqidatul-awam': return aqidatulAwamContent;
            default: return [];
        }
    };

    const filteredKitab = kitabList.filter(kitab =>
        kitab.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        kitab.titleArab.includes(searchQuery)
    );

    const handleKitabClick = (kitab: Kitab) => {
        setSelectedKitab(kitab);
        setSelectedChapter(0);
        setShowBookmarkPanel(false);
    };

    const handleBackToList = () => {
        setSelectedKitab(null);
        setSelectedChapter(0);
        setHighlightedVerse(null);
    };

    const addBookmark = (kitabId: string, chapter: number, verse: number) => {
        const newBookmark: Bookmark = { kitabId, chapter, verse };
        setBookmarks([...bookmarks, newBookmark]);
    };

    const removeBookmark = (index: number) => {
        setBookmarks(bookmarks.filter((_, i) => i !== index));
    };

    const goToBookmark = (bookmark: Bookmark) => {
        const kitab = kitabList.find(k => k.id === bookmark.kitabId);
        if (kitab) {
            setSelectedKitab(kitab);
            setSelectedChapter(bookmark.chapter);
            setHighlightedVerse(bookmark.verse);
            setShowBookmarkPanel(false);
        }
    };

    const copyVerse = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    // Tampilan detail kitab
    if (selectedKitab) {
        const content = getKitabContent(selectedKitab.id);
        const currentContent = content[selectedChapter];

        return (
            <div className="space-y-6">
                {/* Header dengan tombol kembali */}
                <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-lg">
                    <button
                        onClick={handleBackToList}
                        className="flex items-center text-amber-600 hover:text-amber-700 mb-4 transition-colors"
                    >
                        <ChevronRight className="w-5 h-5 rotate-180" />
                        <span className="ml-1">Kembali ke Daftar Kitab</span>
                    </button>

                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                                <Book className="w-8 h-8 text-amber-500" />
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900">{selectedKitab.title}</h2>
                                    <p className="text-xl font-arabic text-amber-600" dir="rtl">{selectedKitab.titleArab}</p>
                                </div>
                            </div>
                            <p className="text-slate-600 mt-3">{selectedKitab.description}</p>
                            <div className="flex items-center space-x-4 mt-3 text-sm text-slate-500">
                                <span>📚 {selectedKitab.chapters} Bab</span>
                                {selectedKitab.verses && <span>📝 {selectedKitab.verses} Bait</span>}
                                <span>✍️ {selectedKitab.author}</span>
                            </div>
                        </div>
                        <span className="text-xs px-3 py-1 bg-amber-100 text-amber-700 rounded-full">
                            {selectedKitab.category}
                        </span>
                    </div>

                    {/* Toolbar Kontrol */}
                    <div className="mt-6 pt-6 border-t border-slate-200">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div className="flex items-center space-x-3">
                                <label className="text-sm text-slate-600">Ukuran Teks:</label>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => setFontSize(Math.max(16, fontSize - 2))}
                                        className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded text-sm"
                                    >
                                        A-
                                    </button>
                                    <span className="text-sm text-slate-600">{fontSize}px</span>
                                    <button
                                        onClick={() => setFontSize(Math.min(36, fontSize + 2))}
                                        className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded text-sm"
                                    >
                                        A+
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={() => setShowTranslation(!showTranslation)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${showTranslation
                                        ? 'bg-sky-500 text-white'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                        }`}
                                >
                                    {showTranslation ? '✓ ' : ''}Terjemahan
                                </button>
                                <button
                                    onClick={() => setShowFootnotes(!showFootnotes)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${showFootnotes
                                        ? 'bg-purple-500 text-white'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                        }`}
                                >
                                    {showFootnotes ? '✓ ' : ''}Catatan Kaki
                                </button>
                                <button
                                    onClick={() => setShowBookmarkPanel(!showBookmarkPanel)}
                                    className="px-4 py-2 rounded-lg text-sm font-medium bg-amber-500 text-white hover:bg-amber-600 transition-colors"
                                >
                                    🔖 Bookmark ({bookmarks.length})
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Panel Bookmark */}
                {showBookmarkPanel && (
                    <div className="bg-white rounded-xl p-6 border border-amber-200 shadow-lg">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-slate-900 flex items-center">
                                🔖 Bookmark Saya
                            </h3>
                            <button
                                onClick={() => setShowBookmarkPanel(false)}
                                className="text-slate-400 hover:text-slate-600"
                            >
                                ✕
                            </button>
                        </div>
                        {bookmarks.length === 0 ? (
                            <p className="text-sm text-slate-500 text-center py-8">
                                Belum ada bookmark. Klik tombol 🔖 Bookmark pada bait yang ingin disimpan.
                            </p>
                        ) : (
                            <div className="space-y-3 max-h-96 overflow-y-auto">
                                {bookmarks.map((bookmark, index) => {
                                    const kitab = kitabList.find(k => k.id === bookmark.kitabId);
                                    return (
                                        <div
                                            key={index}
                                            className="p-4 bg-amber-50 rounded-lg border border-amber-200 hover:border-amber-400 transition-all"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1 cursor-pointer" onClick={() => goToBookmark(bookmark)}>
                                                    <div className="text-sm font-semibold text-slate-900">
                                                        {kitab?.title}
                                                    </div>
                                                    <div className="text-xs text-slate-600 mt-1">
                                                        Bab {bookmark.chapter + 1}, Bait {bookmark.verse + 1}
                                                    </div>
                                                    {bookmark.note && (
                                                        <div className="text-xs text-slate-500 mt-2 italic">
                                                            "{bookmark.note}"
                                                        </div>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() => removeBookmark(index)}
                                                    className="ml-2 text-red-400 hover:text-red-600 text-sm"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Sidebar Daftar Bab */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-lg sticky top-24">
                            <h3 className="font-bold text-slate-900 mb-4 flex items-center">
                                <FileText className="w-5 h-5 mr-2 text-amber-500" />
                                Daftar Bab
                            </h3>
                            <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                                {content.map((chapter, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedChapter(index)}
                                        className={`w-full text-left p-3 rounded-lg transition-all ${selectedChapter === index
                                            ? 'bg-amber-100 border-l-4 border-amber-500 text-amber-900 font-semibold'
                                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                                            }`}
                                    >
                                        <div className="text-xs text-slate-500 mb-1">Bab {chapter.chapter}</div>
                                        <div className="text-sm">{chapter.title}</div>
                                    </button>
                                ))}
                                {content.length === 0 && (
                                    <div className="text-sm text-slate-500 italic text-center py-4">
                                        Konten sedang dalam pengembangan
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Konten Bab */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-lg">
                            {currentContent ? (
                                <>
                                    <div className="border-b border-slate-200 pb-4 mb-6">
                                        <div className="text-sm text-amber-600 font-semibold mb-2">
                                            Bab {currentContent.chapter}
                                        </div>
                                        <h3 className="text-2xl font-bold text-slate-900">
                                            {currentContent.title}
                                        </h3>
                                    </div>

                                    <div className="space-y-6">
                                        {currentContent.content.map((line, index) => (
                                            <div
                                                key={index}
                                                className={`p-6 rounded-lg border-2 transition-all group relative ${highlightedVerse === index
                                                    ? 'bg-amber-50 border-amber-400 shadow-lg'
                                                    : 'bg-slate-50 border-slate-200 hover:border-amber-300'
                                                    }`}
                                            >
                                                {/* Teks Arab */}
                                                <div className="text-right">
                                                    <p
                                                        className="font-arabic leading-loose text-slate-900 mb-3 select-text"
                                                        dir="rtl"
                                                        style={{ fontSize: `${fontSize}px` }}
                                                    >
                                                        {line}
                                                    </p>
                                                </div>

                                                {/* Terjemahan (jika ada dan diaktifkan) */}
                                                {showTranslation && currentContent.translation && currentContent.translation[index] && (
                                                    <div className="mt-4 p-4 bg-sky-50 rounded-lg border border-sky-200">
                                                        <div className="flex items-start">
                                                            <span className="text-xs font-bold text-sky-600 mr-2">ID:</span>
                                                            <p className="text-sm text-slate-700 flex-1">
                                                                {currentContent.translation[index]}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Catatan Kaki (jika ada dan diaktifkan) */}
                                                {showFootnotes && currentContent.footnotes && currentContent.footnotes[index] && (
                                                    <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                                                        <div className="flex items-start">
                                                            <span className="text-xs font-bold text-purple-600 mr-2">📝</span>
                                                            <p className="text-sm text-slate-600 italic flex-1">
                                                                {currentContent.footnotes[index]}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Toolbar Actions */}
                                                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200">
                                                    <div className="text-xs text-slate-500">
                                                        Bait ke-{index + 1}
                                                    </div>
                                                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() => copyVerse(line)}
                                                            className="px-3 py-1 text-xs bg-slate-200 hover:bg-slate-300 rounded text-slate-700"
                                                            title="Salin teks"
                                                        >
                                                            📋 Salin
                                                        </button>
                                                        <button
                                                            onClick={() => addBookmark(selectedKitab.id, selectedChapter, index)}
                                                            className="px-3 py-1 text-xs bg-amber-200 hover:bg-amber-300 rounded text-amber-800"
                                                            title="Tambah bookmark"
                                                        >
                                                            🔖 Bookmark
                                                        </button>
                                                        <button
                                                            onClick={() => setHighlightedVerse(highlightedVerse === index ? null : index)}
                                                            className="px-3 py-1 text-xs bg-yellow-200 hover:bg-yellow-300 rounded text-yellow-800"
                                                            title="Highlight"
                                                        >
                                                            ✨ Highlight
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Navigasi Bab */}
                                    <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-200">
                                        <button
                                            onClick={() => setSelectedChapter(Math.max(0, selectedChapter - 1))}
                                            disabled={selectedChapter === 0}
                                            className="flex items-center px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <ChevronRight className="w-5 h-5 rotate-180" />
                                            <span className="ml-2">Bab Sebelumnya</span>
                                        </button>
                                        <button
                                            onClick={() => setSelectedChapter(Math.min(content.length - 1, selectedChapter + 1))}
                                            disabled={selectedChapter === content.length - 1}
                                            className="flex items-center px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <span className="mr-2">Bab Selanjutnya</span>
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-12">
                                    <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                                    <p className="text-slate-500">Konten kitab sedang dalam pengembangan</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Tampilan daftar kitab
    return (
        <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-lg">
                <div className="flex items-center space-x-2 mb-4">
                    <BookOpen className="w-5 h-5 text-amber-500" />
                    <h2 className="text-xl font-semibold text-slate-900">Perpustakaan Kitab Digital</h2>
                </div>
                <p className="text-slate-600 mb-6">
                    Akses koleksi kitab klasik untuk pembelajaran Bahasa Arab. Klik pada kitab untuk membaca isinya.
                </p>

                <div className="relative">
                    <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Cari kitab... (contoh: alfiyah, ajurrumiyah)"
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredKitab.map((kitab) => (
                    <div
                        key={kitab.id}
                        onClick={() => handleKitabClick(kitab)}
                        className="bg-white rounded-xl p-6 border border-slate-200 hover:border-amber-400 hover:shadow-lg transition-all cursor-pointer group"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                    <BookOpen className="w-8 h-8 text-amber-500 group-hover:scale-110 transition-transform" />
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-lg">{kitab.title}</h3>
                                        <p className="font-arabic text-amber-600 text-lg" dir="rtl">{kitab.titleArab}</p>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-600 mt-3 mb-3">{kitab.description}</p>
                                <div className="flex items-center space-x-3 text-xs text-slate-500">
                                    <span>📚 {kitab.chapters} Bab</span>
                                    {kitab.verses && <span>📝 {kitab.verses} Bait</span>}
                                </div>
                                <div className="text-xs text-slate-500 mt-2">
                                    ✍️ {kitab.author}
                                </div>
                            </div>
                            <span className="text-xs px-3 py-1 bg-amber-100 text-amber-700 rounded-full whitespace-nowrap">
                                {kitab.category}
                            </span>
                        </div>
                        <div className="flex items-center text-amber-600 text-sm font-semibold mt-4 pt-4 border-t border-slate-100">
                            <span>Baca Kitab</span>
                            <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                ))}
            </div>

            {filteredKitab.length === 0 && (
                <div className="bg-white rounded-xl p-12 border border-slate-200 text-center">
                    <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500">Tidak ada kitab yang cocok dengan pencarian Anda</p>
                </div>
            )}
        </div>
    );
};

export default KitabTab;
