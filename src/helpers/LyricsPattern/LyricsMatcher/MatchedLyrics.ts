import SyllableToken from "@/3rdparty/Syllabizer/Sentences/SyllableToken";

class MatchedLyrics {
  private _syllables: SyllableToken[][][];
  
  constructor(syllables: SyllableToken[][][]) {
    this._syllables = syllables;
  }

  public getTokens(): SyllableToken[][][] {
    return this._syllables;
  }
}

export default MatchedLyrics;