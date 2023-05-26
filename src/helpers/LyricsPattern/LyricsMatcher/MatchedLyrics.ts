import SyllableToken from "@/3rdparty/Syllabizer/Sentences/SyllableToken";

type configType = {
  printVerseNumber?: boolean,
  verseStyle?: string,
  refrainStyle?: string,
  underlinedStyle?: string
}

const defaultConfig: configType = {
  printVerseNumber: true,
  verseStyle: "$1",
  refrainStyle: "$2",
  underlinedStyle: "$3"
}

type AbcStringifyTracker = {
  cfg: configType,
  versesWithPrintedVerseNumber: { [key: string | number]: boolean },
  previousVerse: string|number|undefined
}

class MatchedLyrics {
  private _syllables: SyllableToken[][][];

  constructor(syllables: SyllableToken[][][]) {
    this._syllables = syllables;
  }

  public getTokens(): SyllableToken[][][] {
    return this._syllables;
  }

  private isRefrain(verseNumber: string | number): boolean {
    if (typeof verseNumber === "number") {
      return false;
    }
    return verseNumber.match(/^[cr]/i) !== undefined;
  }

  /**
   * Returns a ABC compliant text starting with w: for each text line
   */
  public toAbcString(config: configType = {}): string {
    const strLines: string[] = []
    const tracker: AbcStringifyTracker = {
      cfg: { ...defaultConfig, ...config },
      previousVerse: undefined,
      versesWithPrintedVerseNumber: {}
    }

    for (const line of this._syllables) {
      let strLine = '';
      for (const phrase of line) {
        for (const syllable of phrase) {
          let str = '';
          if ("verse" in syllable && syllable.verse) {
            if (this.isRefrain(syllable.verse)) {
              if (tracker.previousVerse !== syllable.verse) {
                str += tracker.cfg.refrainStyle;
              }
            } else if (!(syllable.verse in tracker.versesWithPrintedVerseNumber)) {
              str += `$0${syllable.verse}.~`;
              tracker.versesWithPrintedVerseNumber[syllable.verse] = true;
              if (tracker.previousVerse !== syllable.verse) {
                str += tracker.cfg.verseStyle;
              }
            } else {
              if (tracker.previousVerse !== syllable.verse) {
                str += tracker.cfg.verseStyle
              }
            }
          }
          
          tracker.previousVerse = syllable.verse;
          if (syllable.underlined) {
            str += tracker.cfg.underlinedStyle
            tracker.previousVerse = 'underlined';
          }
          str += syllable.content;
          if (syllable.type === 'alone' || syllable.type === 'end') {
            str += ' ';
          } else if (syllable.type === "start" || syllable.type === "middle") {
            str += '-';
          }
          strLine += str;
        }
      }
      strLines.push(strLine);
    }
    return strLines.map(e => 'w: ' + e.trim()).join("\n");
  }
}

export default MatchedLyrics;