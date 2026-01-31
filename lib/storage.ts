export interface SectionProgress {
    wpm: number;
    accuracy: number;
    date: string;
    completed: boolean;
  }
  
  export interface AristotleTyperProgress {
    [key: string]: SectionProgress;
  }
  
  const STORAGE_KEY = 'aristotleTyperProgress';
  
  export function loadProgress(): AristotleTyperProgress {
    if (typeof window === 'undefined') return {};

    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return {};
    
    try {
      return JSON.parse(stored);
    } catch (error) {
      console.error('Failed to parse progress from localStorage', error);
      return {};
    }
  }

  export function saveProgress(bookNumber: string, sectionNumber: number, data: SectionProgress) {
    const sectionId = `${bookNumber}.${sectionNumber}`;
    
    const currentProgress = loadProgress();
    currentProgress[sectionId] = data;
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentProgress));
  }
  
  export function isSectionCompleted(bookNumber: string, sectionNumber: number): boolean {
    const sectionId = `${bookNumber}.${sectionNumber}`;
    const progress = loadProgress();
    return progress[sectionId]?.completed || false;
  }
  
  export function getSectionStats(bookNumber: string, sectionNumber: number): SectionProgress | null {
    const sectionId = `${bookNumber}.${sectionNumber}`;
    const progress = loadProgress();
    return progress[sectionId] || null;
  }
  
  export function resetProgress() {
    localStorage.removeItem(STORAGE_KEY);
  }