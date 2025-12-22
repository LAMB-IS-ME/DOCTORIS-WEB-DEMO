export enum SearchType {
  DISEASE = 'DISEASE',
  DRUG = 'DRUG',
  SYMPTOM = 'SYMPTOM',
  PATIENT = 'PATIENT'
}

export interface Section {
  heading: string;
  content: string;
}

export interface Reference {
  title: string;
  url: string;
}

export interface MedicalData {
  title: string;
  category: string;
  summary: string;
  sections: Section[];
  warnings: string[];
  references?: Reference[];
}

export interface SearchHistoryItem {
  id: string;
  query: string;
  type: SearchType;
  timestamp: number;
}
