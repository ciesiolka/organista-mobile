import LyricsType from "@/helpers/SongDescription/LyricsType";
import Slot from "../Type/Slot";
import SentenceSyllabizer from "@/3rdparty/Syllabizer/Sentences/SentenceSyllabizer";
import SyllableToken from "@/3rdparty/Syllabizer/Sentences/SyllableToken";
import DotSlot from "../Type/DotSlot";
import TildeSlot from "../Type/TildeSlot";
import StarSlot from "../Type/StarSlot";
import StringSlot from "../Type/StringSlot";
import QuestionSlot from "../Type/QuestionSlot";
import MatchedLyrics from "./MatchedLyrics";

type MatchingTracker = {
  syllabizedVersePhrases: { [key: string | number]: SyllableToken[][]; };
  syllabizedPhrases: SyllableToken[][];
  origLyrics: LyricsType,
  verseOrderPointer: number;
  nextUnderlined: boolean;
  syllableIndex: number;
};

class LyricsMatcher {
  private _syllabizer: SentenceSyllabizer;

  public constructor() {
    this._syllabizer = new SentenceSyllabizer;
  }

  public match(lyrics: LyricsType, patternLines: Slot[][][]): MatchedLyrics {
    const matchingTracker: MatchingTracker = {
      syllabizedVersePhrases: {},
      origLyrics: lyrics,
      syllabizedPhrases: [],
      verseOrderPointer: 0,
      nextUnderlined: false,
      syllableIndex: 1
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

    return new MatchedLyrics(output, matchingTracker.syllabizedVersePhrases);
  }

  /**
   * 
   * @param phrase Number of phrase, numbed from 1
   * @param syllable Number of syllable, numbered from 1. If negative, gives nth syllable from the end. Value 0 throws an exception.
   */
  private getSyllable(phrase: number, syllable: number, t: MatchingTracker): SyllableToken {
    if (phrase < 1) {
      throw new Error(`Phrase number ${phrase} is less than 1`);
    }
    if (syllable === 0) {
      throw new Error(`Syllable number equals 0`);
    }

    // syllabize missing phrase
    if (t.syllabizedPhrases.length < phrase) {
      const verseSymbol = t.origLyrics.order[t.verseOrderPointer];
      if (!(verseSymbol in t.syllabizedVersePhrases)) {
        const verseText = t.origLyrics.verses[verseSymbol];
        const versePhrases = verseText.split('*');
        t.syllabizedVersePhrases[verseSymbol] = versePhrases
          .map(txt => this._syllabizer.syllabize(txt.trim())
          .map(e => { return {...e, verse: verseSymbol} }));
      }
      t.syllabizedPhrases.push(...t.syllabizedVersePhrases[verseSymbol]);
      t.verseOrderPointer++;
    }
    const phraseEls = t.syllabizedPhrases[phrase - 1];
    const phraseLen = phraseEls.length;

    if (syllable > 0 && phraseLen < syllable) {
      throw new Error(`Unable to fetch ${syllable}° syllable of ${phrase}° phrase. The phrase has only ${phraseLen} syllablles.`);
    }
    if (syllable < 0) {
      if (syllable + phrase < 0) {
        throw new Error(`Unable to fetch ${syllable}° syllable of ${phrase}° phrase. The phrase has only ${phraseLen} syllablles.`);
      }
      return phraseEls[phraseLen + syllable];
    }
    else {
      if (syllable > phraseLen) {
        throw new Error(`Unable to fetch ${syllable}° syllable of ${phrase}° phrase. The phrase has only ${phraseLen} syllablles.`);
      }
      return phraseEls[syllable - 1];
    }
  }

  private matchPattern(element: Slot, tracker: MatchingTracker): SyllableToken {
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

  private matchDotPattern(element: DotSlot, tracker: MatchingTracker): SyllableToken {
    const syllable = this.getSyllable(element.phrase, element.syllable, tracker);
    if (syllable.type == 'end' || syllable.type === 'alone') {
      return { ...syllable, content: syllable.content + '_'.repeat(element.length - 1)};
    }
    else {
      return { ...syllable, content: syllable.content + '-'.repeat(element.length - 1)};
    }
  }

  private matchQuestionPattern(element: QuestionSlot, tracker: MatchingTracker): SyllableToken {
    throw new Error("Method not implemented.");
  }

  private matchStringPattern(element: StringSlot, tracker: MatchingTracker): SyllableToken {
    throw new Error("Method not implemented.");
  }

  private matchStarPattern(element: StarSlot, tracker: MatchingTracker): SyllableToken {
    return { type: "alone", content: "*".repeat(element.length) };
  }

  private matchTildePattern(element: TildeSlot, tracker: MatchingTracker): SyllableToken {
    throw new Error("Method not implemented.");
  }
}

export default LyricsMatcher;