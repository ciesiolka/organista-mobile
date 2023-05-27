import DotSlot from "./Type/DotSlot";
import Slot from "./Type/Slot";
import QuestionSlot from "./Type/QuestionSlot";
import StarSlot from "./Type/StarSlot";
import StringSlot from "./Type/StringSlot";
import TildeSlot from "./Type/TildeSlot";

type PhrasePattern = Array<Slot>
type PhraseLine = Array<PhrasePattern>
type VerseTrackerType = { phrase: number, syllable: number };

class LyricsPatternParser {
  /**
   * 
   * @param patternLines Array of tokens - one string for each line
   * @returns Array of lines, each line is an array of phrases, each phrase is an array of Pattern elements (tokens).
   * The return type is Array<Array<Array<PatternEl>>>
   */
  public parse(patternLines: string[]): PhraseLine[] {
    const linePhrases: PhraseLine[] = [];
    const verseTracker: VerseTrackerType = { phrase: 0, syllable: 0 };
    for (const line of patternLines) {
      linePhrases.push(this.parseLine(line, verseTracker))
    }
    return linePhrases;
  }

  private parseLine(patternLine: string, verseTracker: VerseTrackerType): PhraseLine {
    const output: PhraseLine = [];
    const patternPhrases = patternLine.split('|').map(e => e.trim());
    for (const phrase of patternPhrases) {
      output.push(this.parsePhrase(phrase, verseTracker));
    }
    return output;
  }

  private parsePhrase(patternPhrase: string, verseTracker: VerseTrackerType): PhrasePattern {
    const output: PhrasePattern = [];
    const elsMatch = patternPhrase.match(/(\.-*)|(\*+)|(~)|(\?)|("(\\"|[^"])+")|('(\\'|[^'])+')|(<\d+(,-?\d+)?>)+/ig);
    if (!elsMatch) {
      return [];
    }
    const elsArray = Array.from(elsMatch);
    ++verseTracker.phrase;
    verseTracker.syllable = 0
    for (const el of elsArray) {
      if (el.charAt(0) === '<') {
        this.parseArrowSymbol(el, verseTracker);
      } else {
        output.push(this.parseSymbol(el, verseTracker));
      }
    }
    return output;
  }

  private parseSymbol(symbol: string, verseTracker: VerseTrackerType): Slot {
    switch (symbol.charAt(0)) {
      case '.':
        return this.parseDotSymbol(symbol, verseTracker);
      case '*':
        return this.parseStarSymbol(symbol);
      case '~':
        return this.parseTildeSymbol(verseTracker);
      case "'":
      case '"':
        return this.parseStringSymbol(symbol, verseTracker);
      case '?':
        return this.parseQuestionSymbol(verseTracker);
    }
    throw new Error(`Unsupported symbol received: ${symbol}`);
  }

  private parseStringSymbol(symbol: string, verseTracker: VerseTrackerType): StringSlot {
    const content = symbol.slice(1,-1);
    if (symbol.charAt(0) === '"') {
      return {
        type: 's',
        content: content.replace('\\"', '"'),
        syllable: ++verseTracker.syllable,
        phrase:  verseTracker.phrase
      }
    } else if (symbol.charAt(0) === "'") {
      return {
        type: 's',
        content: content.replace("\\'", "'"),
        syllable: ++verseTracker.syllable,
        phrase:  verseTracker.phrase
      }
    }
    throw new Error(`Unsupported symbol: ${symbol}`);
  }

  private parseTildeSymbol(verseTracker: VerseTrackerType): TildeSlot {
    return {
      type: "~",
      phrase: verseTracker.phrase,
      syllable: ++(verseTracker.syllable),
    }
  }

  private parseDotSymbol(symbol: string, verseTracker: VerseTrackerType): DotSlot {
    return {
      phrase: verseTracker.phrase,
      syllable: ++(verseTracker.syllable),
      length: symbol.length,
      type: '.',
    }
  }

  private parseStarSymbol(symbol: string): StarSlot {
    return {
      type: '*',
      length: symbol.length
    }
  }

  private parseArrowSymbol(symbol: string, verseTracker: VerseTrackerType): void {
    const matches = symbol.match(/<(\d+)(,(-?\d+))?>/);
    if (!matches) {
      throw new Error(`Symbol must be a valid arrow symbol. Received: ${symbol}`);
    }
    const matchesArr = Array.from(matches);
    const verseNumber = matchesArr[1];
    const syllableNumber = matchesArr[3];

    if (verseNumber) {
      verseTracker.phrase = +verseNumber;
    }
    if (syllableNumber) {
      verseTracker.syllable = +syllableNumber - 1;
    }
  }

  private parseQuestionSymbol(verseTracker: VerseTrackerType): QuestionSlot {
    return {
      phrase: verseTracker.phrase,
      syllable: ++(verseTracker.syllable),
      type: '?',
    }  }
}

export default LyricsPatternParser;