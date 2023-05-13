type SyllableToken = {
  content: string,
  type: 'start' | 'middle' | 'end' | 'alone' | 'joinWithNext'
}

export default SyllableToken;