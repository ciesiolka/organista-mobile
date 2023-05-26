type SyllableToken = {
  content: string,
  type: 'start' | 'middle' | 'end' | 'alone' | 'joinWithNext',
  underlined?: boolean,
  verse?: string | number
}

export default SyllableToken;