import PatternElBase from "./PatternElBase";

type PatternDotEl = PatternElBase & {
  type: '.'
  length: number;
}

export default PatternDotEl;