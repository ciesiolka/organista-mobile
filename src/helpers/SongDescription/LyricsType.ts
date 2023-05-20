type LyricsType = {
  verses: { [key: string | number]: string; };
  order: (string | number)[];
};

export default LyricsType;