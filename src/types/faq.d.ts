export interface IFaqRequest {
  id: string;
  body: {
    question: string;
    contents: string[];
  }[];
}
