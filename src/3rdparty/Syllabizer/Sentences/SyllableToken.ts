type SyllableToken = {
  content: string,
  type: 'start' | 'middle' | 'end' | 'alone' | 'joinWithNext',
  underlined: boolean,
}

export default SyllableToken;