import PatternElBase from "./PatternElBase";

type PatternStringEl = PatternElBase & {
  type: 's';
  content: string;
}

export default PatternStringEl;