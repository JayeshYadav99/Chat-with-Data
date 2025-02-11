export interface ChatResponse {
  success: boolean;
  data: string | null;
}
export type VercelChatMessage = {
  role: string;
  content: string;
};
