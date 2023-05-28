import LyricsMatcher from "@/helpers/LyricsPattern/LyricsMatcher/LyricsMatcher";
import LyricsPatternParser from "@/helpers/LyricsPattern/LyricsPatternParser";
import LyricsType from "@/helpers/SongDescription/LyricsType";

describe("Lyrics Matcher correctly assignes", () => {
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

  it("single syllable", () => {
    const abc = prepareSingleLineAbc('.', 'a');
    expect(abc).toEqual('w: $01.~$1a');
  });

  it("two syllables", () => {
    const abc = prepareSingleLineAbc('..', 'abba');
    expect(abc).toEqual('w: $01.~$1ab-ba');
  });

  it("two separated syllables", () => {
    const abc = prepareSingleLineAbc('..', 'or or');
    expect(abc).toEqual('w: $01.~$1or or');
  });

  it("two syllabled, first prolonged", () => {
    const abc = prepareSingleLineAbc('.-.', 'abba');
    expect(abc).toEqual('w: $01.~$1ab--ba');
  })

  it("two syllables, second prolonged", () => {
    const abc = prepareSingleLineAbc('..-', 'abba');
    expect(abc).toEqual('w: $01.~$1ab-ba_');
  })

  it("three syllables", () => {
    const abc = prepareSingleLineAbc("...", 'zbawienie');
    expect(abc).toEqual("w: $01.~$1zba-wie-nie");
  });

  it("three syllables", () => {
    const abc = prepareSingleLineAbc("...", 'zbawienie');
    expect(abc).toEqual("w: $01.~$1zba-wie-nie");
  });

  it("syllable and star before", () => {
    const abc = prepareSingleLineAbc("*.", 'a');
    expect(abc).toEqual("w: * $01.~$1a");
  });

  it("syllable and star after", () => {
    const abc = prepareSingleLineAbc(".*", 'a');
    expect(abc).toEqual("w: $01.~$1a *");
  });

  it("syllable and two stars before", () => {
    const abc = prepareSingleLineAbc("**.", 'a');
    expect(abc).toEqual("w: ** $01.~$1a");
  })

  it.skip("tilde and two syllables", () => {
    const abc = prepareSingleLineAbc("~..", "A myśmy się chlubić powinni");
    expect(abc).toEqual("w: $01.~$1A~myśmy~się~chlubić~po-$3win-$1ni");
  })

  it.skip("two tildes and two syllables", () => {
    const abc = prepareSingleLineAbc("~~..", "A myśmy się _chlu_bić powinni");
    expect(abc).toEqual("w: $01.~$1A~myśmy~się $3chlu$1bić~po-win-ni");
  })
});