export interface IFaqRequest {
  id: string;
  name: string;
  body: {
    question: string;
    contents: string[];
  }[];
}
