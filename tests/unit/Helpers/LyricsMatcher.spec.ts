import LyricsMatcher from "@/helpers/LyricsPattern/LyricsMatcher/LyricsMatcher";
import LyricsPatternParser from "@/helpers/LyricsPattern/LyricsPatternParser";
import LyricsType from "@/helpers/SongDescription/LyricsType";

describe("Lyrics Matcher", () => {
  const patternParser = new LyricsPatternParser();
  const matcher = new LyricsMatcher();

  it("Correctly assigns single syllable", () => {
    const patternStr = '.';
    const parsedPattern = patternParser.parse([patternStr]);

    const lyricsObject: LyricsType = {
      order: [1],
      verses: {
        1: "a"
      }
    }

    const matched = matcher.match(lyricsObject, parsedPattern);
    const abcS = matched.toAbcString();
    expect(abcS).toEqual('w: $01.~$1a');
  });
});