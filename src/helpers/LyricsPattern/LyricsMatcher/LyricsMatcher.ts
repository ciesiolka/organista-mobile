import LyricsType from "@/helpers/SongDescription/LyricsType";
import PatternEl from "../Type/PatternEl";
import SentenceSyllabizer from "@/3rdparty/Syllabizer/Sentences/SentenceSyllabizer";
import SyllableToken from "@/3rdparty/Syllabizer/Sentences/SyllableToken";
import PatternDotEl from "../Type/PatternDotEl";
import PatternTildeEl from "../Type/PatternTildeEl";
import PatternStarEl from "../Type/PatternStarEl";
import PatternStringEl from "../Type/PatternStringEl";
import PatternQuestionEl from "../Type/PatternQuestionEl";

type MatchingTracker = {
  syllabizedVersePhrases: { [key: string | number]: SyllableToken[][]; };
  syllabizedPhrases: { [key: number]: PatternEl[]; };
  origLyrics: LyricsType,
  verseOrderPointer: number;
};

class LyricsMatcher {
  private _syllabizer: SentenceSyllabizer;

  public constructor() {
    this._syllabizer = new SentenceSyllabizer;
  }

  public match(lyrics: LyricsType, patternLines: Array<Array<Array<PatternEl>>>): string[] {
    const matchingTracker: MatchingTracker = {
      syllabizedVersePhrases: {},
      origLyrics: lyrics,
      syllabizedPhrases: {},
      verseOrderPointer: 0
    };
    const output: SyllableToken[][][] = [];

    for (const line of patternLines) {
      const linePhraseTokens: SyllableToken[][] = [];
      for (const phrase of line) {
        const phraseTokens: SyllableToken[] = [];
        for (const patternEl of phrase) {
          phraseTokens.push(this.matchPattern(patternEl, matchingTracker));
        }
        linePhraseTokens.push(phraseTokens);
      }
      output.push(linePhraseTokens);
    }

    return this.stringifyTokens(output);
  }

  private stringifyTokens(tokens: SyllableToken[][][]): string[] {
    return [''];
  }

  private matchPattern(element: PatternEl, tracker: MatchingTracker): SyllableToken {
    switch (element.type) {
      case ".":
        return this.matchDotPattern(element, tracker);
      case "~":
        return this.matchTildePattern(element, tracker);
      case "*":
        return this.matchStarPattern(element, tracker);
      case "s":
        return this.matchStringPattern(element, tracker);
      case "?":
        return this.matchQuestionPattern(element, tracker);
    }
  }

  private matchQuestionPattern(element: PatternQuestionEl, tracker: MatchingTracker): SyllableToken {
    throw new Error("Method not implemented.");
  }

  private matchStringPattern(element: PatternStringEl, tracker: MatchingTracker): SyllableToken {
    throw new Error("Method not implemented.");
  }

  private matchStarPattern(element: PatternStarEl, tracker: MatchingTracker): SyllableToken {
    throw new Error("Method not implemented.");
  }

  private matchTildePattern(element: PatternTildeEl, tracker: MatchingTracker): SyllableToken {
    throw new Error("Method not implemented.");
  }

  private matchDotPattern(element: PatternDotEl, tracker: MatchingTracker): SyllableToken {
    throw new Error("Method not implemented.");
  }
}

export default LyricsMatcher;