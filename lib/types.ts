
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  image?: string;
  timestamp: number;
  subject: ToolType | 'General';
}

export type ToolType =
  | 'product-photography'
  | 'fashion-photography'
  | 'image-to-prompt'
  | 'video-ads';

export interface ToolInfo {
  id: ToolType;
  name: string;
  icon: string;
  color: string;
  description: string;
}
