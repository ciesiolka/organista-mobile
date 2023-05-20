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
  syllabizedPhrases: SyllableToken[][];
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
      syllabizedPhrases: [],
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

  /**
   * 
   * @param phrase Number of phrase, numbed from 1
   * @param syllable Number of syllable, numbered from 1. If negative, gives nth syllable from the end. Value 0 throws an exception.
   */
  private getSyllable(phrase: number, syllable: number, t: MatchingTracker): SyllableToken {
    if (phrase < 1) {
      throw new Error(`Phrase number ${phrase} is less than 1`)
    }
    if (syllable === 0) {
      throw new Error(`Syllable number equals 0`)
    }
    
    if (!(t.syllabizedPhrases.length < phrase)) {
      const verseSymbol = t.origLyrics.order[t.verseOrderPointer];
      if (!(verseSymbol in t.syllabizedVersePhrases)) {
        const verseText = t.origLyrics.verses[verseSymbol];
        const versePhrases = verseText.split('*');
        t.syllabizedVersePhrases[verseSymbol] = versePhrases.map(txt => this._syllabizer.syllabize(txt.trim()));
      }
      t.syllabizedPhrases.push(...t.syllabizedVersePhrases[verseSymbol])
      t.verseOrderPointer++;
    }
    const phraseEls = t.syllabizedPhrases[phrase - 1];
    const phraseLen = phraseEls.length;
    
    if (syllable > 0 && phraseLen < syllable) {
      throw new Error(`Unable to fetch ${syllable}° syllable of ${phrase}° phrase. The phrase has only ${phraseLen} syllablles.`)
    }
    if (syllable < 0) {
      if (syllable + phrase < 0) {
        throw new Error(`Unable to fetch ${syllable}° syllable of ${phrase}° phrase. The phrase has only ${phraseLen} syllablles.`);
      }
      return phraseEls[phraseLen + syllable]
    }
    else {
      if (syllable > phraseLen) {
        throw new Error(`Unable to fetch ${syllable}° syllable of ${phrase}° phrase. The phrase has only ${phraseLen} syllablles.`)
      }
      return phraseEls[syllable - 1];
    }
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
    return {type: "alone", content: "*".repeat(element.length) }
  }

  private matchTildePattern(element: PatternTildeEl, tracker: MatchingTracker): SyllableToken {
    throw new Error("Method not implemented.");
  }

  private matchDotPattern(element: PatternDotEl, tracker: MatchingTracker): SyllableToken {
    const syllable = this.getSyllable(element.phrase, element.syllable, tracker);
    if (syllable.type == 'end' || syllable.type === 'alone') {
      return {type: syllable.type, content: syllable.content + '_'.repeat(element.length - 1)}
    }
    else {
      return {type: syllable.type, content: syllable.content + '-'.repeat(element.length - 1)}
    }
  }
}

export default LyricsMatcher;