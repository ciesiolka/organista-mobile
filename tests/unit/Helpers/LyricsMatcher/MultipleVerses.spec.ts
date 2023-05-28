import LyricsMatcher from "@/helpers/LyricsPattern/LyricsMatcher/LyricsMatcher";
import LyricsPatternParser from "@/helpers/LyricsPattern/LyricsPatternParser";
import LyricsType from "@/helpers/SongDescription/LyricsType";

describe("Lyrics Matcher correctly assignes multiple verse with", () => {
  const patternParser = new LyricsPatternParser();
  const matcher = new LyricsMatcher();

  function prepareTwoVersesVerseAbc(pattern: string, lyrics: [string, string], order: [(string|number), (string|number)]): string {
    const parsedPattern = patternParser.parse([pattern]);
     

    const lyricsObject: LyricsType = {
      order,
      verses: {
        [order[0]]: lyrics[0],
        [order[1]]: lyrics[1]
      }
    }
  
    const matched = matcher.match(lyricsObject, parsedPattern);
    return matched.toAbcString();
  }

  it("two single syllables", () => {
    const abc = prepareTwoVersesVerseAbc('.|.', ['ab', 'ba'], [1, 'c']);
    expect(abc).toEqual("w: $01.~$1ab $2ba");
  })
});