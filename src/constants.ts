// Contoh teks Arab yang dikategorikan untuk memudahkan pengguna

export interface Example {
  label: string;
  text: string;
}

export const CATEGORIZED_EXAMPLES: Record<string, Example[]> = {
  'Al-Quran': [
    { label: 'Al-Fatihah 1-2', text: 'بسم الله الرحمن الرحيم الحمد لله رب العالمين' },
    { label: 'Al-Ikhlas', text: 'قل هو الله احد الله الصمد' },
    { label: 'Al-Baqarah 255', text: 'الله لا اله الا هو الحي القيوم' },
  ],
  'Hadits': [
    { label: 'Niat', text: 'انما الاعمال بالنيات' },
    { label: 'Ilmu', text: 'طلب العلم فريضة على كل مسلم' },
    { label: 'Akhlaq', text: 'المؤمن القوي خير واحب الى الله' },
  ],
  'Amtsal (Peribahasa)': [
    { label: 'Kesabaran', text: 'الصبر مفتاح الفرج' },
    { label: 'Ilmu', text: 'العلم نور والجهل ظلام' },
    { label: 'Persahabatan', text: 'الصديق وقت الضيق' },
  ],
  'Kalimat Sederhana': [
    { label: 'Kalimat Dasar', text: 'محمد طالب مجتهد' },
    { label: 'Jumlah Fi\'liyyah', text: 'ذهب الطالب الى المدرسة' },
    { label: 'Pertanyaan', text: 'من اين انت' },
  ],
};
