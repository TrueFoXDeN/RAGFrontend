export interface ContextItem {
  file: string;
  text: string;
  page: number;
}

export interface Message {
  text: string;
  type: 'response' | 'prompt';
  context: ContextItem[];
}
