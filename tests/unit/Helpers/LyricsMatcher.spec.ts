import LyricsMatcher from "@/helpers/LyricsPattern/LyricsMatcher/LyricsMatcher";
import LyricsPatternParser from "@/helpers/LyricsPattern/LyricsPatternParser";
import LyricsType from "@/helpers/SongDescription/LyricsType";

describe("Lyrics Matcher", () => {
  const patternParser = new LyricsPatternParser();
  const matcher = new LyricsMatcher();

  function prepareSingleLineAbc(pattern: string, lyricsText: string): string {
    const parsedPattern = patternParser.parse([pattern]);
  
    const lyricsObject: LyricsType = {
      order: [1],
      verses: {
        1: lyricsText
      }
    }
  
    const matched = matcher.match(lyricsObject, parsedPattern);
    return matched.toAbcString();
  }

  it("Correctly assigns single syllable", () => {
    const abcS = prepareSingleLineAbc('.', 'a');
    expect(abcS).toEqual('w: $01.~$1a');
  });

  it("Correctly assigns two syllables", () => {
    const abcS = prepareSingleLineAbc('..', 'abba');
    expect(abcS).toEqual('w: $01.~$1ab-ba');
  });
});