
export interface Message {
  role: 'user' | 'assistant';
  content: string;
  image?: string;
}

export interface ImageAction {
  id: string;
  type: 'generate' | 'edit';
  prompt: string;
  timestamp: number;
  resultUrl: string;
}

export enum AppMode {
  CREATE = 'create',
  EDIT = 'edit',
  ASSISTANT = 'assistant'
}
