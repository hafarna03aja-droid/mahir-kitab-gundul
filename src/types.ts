export type TabId = 'analisis' | 'kitab' | 'asisten' | 'tutor';

export interface Tab {
  id: TabId;
  label: string;
  icon: string;
}

export interface IrabEntry {
  word: string;
  vocalized_word?: string;
  word_translation?: string;
  analysis_details: {
    i_rab: string;
    i_rab_translation?: string;
    sharaf: string;
    sharaf_translation?: string;
    root_word: string;
    balaghah?: string;
  };
}

export interface AnalysisResult {
  originalText: string;
  vocalizedText: string;
  translation: string;
  irab: IrabEntry[];
}
