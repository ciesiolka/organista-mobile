import PatternDotEl from "./PatternDotEl";
import PatternQuestionEl from "./PatternQuestionEl";
import PatternStarEl from "./PatternStarEl";
import PatternStringEl from "./PatternStringEl";
import PatternTildeEl from "./PatternTildeEl";

type PatternEl
  = PatternDotEl
  | PatternTildeEl
  | PatternStarEl
  | PatternStringEl
  | PatternQuestionEl

export default PatternEl;