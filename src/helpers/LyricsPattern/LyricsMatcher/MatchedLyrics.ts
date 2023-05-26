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
    const cfg: configType = { ...defaultConfig, ...config };
    const versesWithPrintedVerseNumber: { [key: string | number]: boolean } = {};
    const strLines: string[] = []
    let previousVerse: string|number|undefined = undefined;
    for (const line of this._syllables) {
      let strLine = '';
      for (const phrase of line) {
        for (const syllable of phrase) {
          let str = '';
          if (syllable.verse) {
            if (this.isRefrain(syllable.verse)) {
              if (previousVerse !== syllable.verse) {
                str += cfg.refrainStyle;
              }
            } else if (!(syllable.verse in versesWithPrintedVerseNumber)) {
              str += `$0${syllable.verse}.~`;
              versesWithPrintedVerseNumber[syllable.verse] = true;
              if (previousVerse !== syllable.verse) {
                str += cfg.verseStyle;
              }
            } else {
              if (previousVerse !== syllable.verse) {
                str += cfg.verseStyle
              }
            }
          }
          
          previousVerse = syllable.verse;
          if (syllable.underlined) {
            str += cfg.underlinedStyle
            previousVerse = 'underlined';
          }
          str += syllable.content;
          if (syllable.type === 'alone' || syllable.type === 'end') {
            str += ' ';
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