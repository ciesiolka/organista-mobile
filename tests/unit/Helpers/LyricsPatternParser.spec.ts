import LyricsPatternParser from "@/helpers/LyricsPattern/LyricsPatternParser";

describe("Lyrics pattern parser", () => {
  const parser = new LyricsPatternParser;
  
  it("Parses single syllable", () => {
    const pattern = '.';
    
    const parsedLines = parser.parse([pattern]);
    expect(parsedLines).toHaveLength(1);
    
    const firstLinePhrases = parsedLines[0];
    expect(firstLinePhrases).toHaveLength(1);

    const firstPhrase = firstLinePhrases[0];
    expect(firstPhrase).toHaveLength(1);

    expect(firstPhrase[0]).toEqual({ type: '.', length: 1, phrase: 1, syllable: 1});
  })

  it("Parses two syllables", () => {
    const pattern = '..';
    
    const parsedLines = parser.parse([pattern]);
    expect(parsedLines).toHaveLength(1);
    
    const firstLinePhrases = parsedLines[0];
    expect(firstLinePhrases).toHaveLength(1);

    const firstPhrase = firstLinePhrases[0];
    expect(firstPhrase).toHaveLength(2);

    expect(firstPhrase[0]).toEqual({ type: '.', length: 1, phrase: 1, syllable: 1});
    expect(firstPhrase[1]).toEqual({ type: '.', length: 1, phrase: 1, syllable: 2});
  })

  it("Parses single, prolonged syllable", () => {
    const pattern = '.-';
    
    const parsedLines = parser.parse([pattern]);
    expect(parsedLines).toHaveLength(1);
    
    const firstLinePhrases = parsedLines[0];
    expect(firstLinePhrases).toHaveLength(1);

    const firstPhrase = firstLinePhrases[0];
    expect(firstPhrase).toHaveLength(1);

    expect(firstPhrase[0]).toEqual({ type: '.', length: 2, phrase: 1, syllable: 1});
  })

  it("Parses two phrases of single syllable", () => {
    const pattern = '.|.';
    
    const parsedLines = parser.parse([pattern]);
    expect(parsedLines).toHaveLength(1);
    
    const firstLinePhrases = parsedLines[0];
    expect(firstLinePhrases).toHaveLength(2);

    const firstPhrase = firstLinePhrases[0];
    expect(firstPhrase).toHaveLength(1);

    expect(firstPhrase[0]).toEqual({ type: '.', length: 1, phrase: 1, syllable: 1});

    const secondPhrase = firstLinePhrases[1];
    expect(secondPhrase).toHaveLength(1);

    expect(secondPhrase[0]).toEqual({ type: '.', length: 1, phrase: 2, syllable: 1});

  })
})