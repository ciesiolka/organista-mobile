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
    const abc = prepareSingleLineAbc('.', 'a');
    expect(abc).toEqual('w: $01.~$1a');
  });

  it("Correctly assigns two syllables", () => {
    const abc = prepareSingleLineAbc('..', 'abba');
    expect(abc).toEqual('w: $01.~$1ab-ba');
  });

  it("Correctly assigns two separated syllables", () => {
    const abc = prepareSingleLineAbc('..', 'or or');
    expect(abc).toEqual('w: $01.~$1or or');
  });

  it("Correctly assigns two syllabled, first prolonged", () => {
    const abc = prepareSingleLineAbc('.-.', 'abba');
    expect(abc).toEqual('w: $01.~$1ab--ba');
  })

  it("Correctly assigns two syllables, second prolonged", () => {
    const abc = prepareSingleLineAbc('..-', 'abba');
    expect(abc).toEqual('w: $01.~$1ab-ba_');
  })

  it("Correctly assigns three syllables", () => {
    const abc = prepareSingleLineAbc("...", 'zbawienie');
    expect(abc).toEqual("w: $01.~$1zba-wie-nie");
  });
});