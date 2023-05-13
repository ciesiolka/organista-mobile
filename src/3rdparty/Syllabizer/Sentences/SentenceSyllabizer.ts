import type SyllableToken from "./SyllableToken";
import PhoneTokenizer from "../Phones/PhoneTokenizer";
import Syllabizer from "../Syllables/Syllabizer";
import PhoneToken from "../Phones/PhoneToken";

class SentenceSyllabizer {
  private _phonetokenizer: PhoneTokenizer;
  private _syllabizer: Syllabizer;

  public constructor() {
    this._phonetokenizer = new PhoneTokenizer;
    this._syllabizer = new Syllabizer
  }
  
  public syllabize(sentence: string): SyllableToken[] {
    const tokens: SyllableToken[] = [];
    const words: string[] = sentence.split(/\s+|\n+/);
    for (const word of words) {
      tokens.push(...this.syllabizeWord(word));
    }
    return tokens;
  }

  private syllabizeWord(word: string): SyllableToken[] {
    const tokens: SyllableToken[] = []
    const wordElements = word.match(/\p{L}+|[^\p{L}\s]+/gui) ?? [];
    for (const element of wordElements) {
      const wordTokens: SyllableToken[] = [];
      if (element.match(/\p{L}+/ui)) {
        const phones = this._phonetokenizer.tokenize(element);
        const syllables = this._syllabizer.syllabizePhones(phones);
        wordTokens.push(...this.syllablesToTokens(syllables));
      } else {
        wordTokens.push({type: 'joinWithNext', content: element});
      }
      tokens.push(...wordTokens);
    }
    return this.mergeJoinWithNext(tokens);
  }

  private mergeJoinWithNext(tokens: SyllableToken[]): SyllableToken[] {
    const filteredTokens: SyllableToken[] = [];
    let buffer = '';
    for (let i = 0; i < tokens.length; ++i) {
      if (tokens[i].type !== 'joinWithNext') {
        const newToken = tokens[i];
        newToken.content = buffer + newToken.content;
        filteredTokens.push(newToken);
        buffer = '';
      } else {
        buffer += tokens[i].content;
      }
    }
    if (buffer !== '') {
      filteredTokens[filteredTokens.length - 1].content += buffer;
    }
    return filteredTokens;
  }

  private syllablesToTokens(phonesGroups: PhoneToken[][]): SyllableToken[] {
    if (!phonesGroups.find(group => this.hasVowel(group))) {
      return [{type: "joinWithNext", content: phonesGroups.map(group => group.reduce<string>((acc, curr) => acc + curr.content, '')).join('')}]
    }
    if (phonesGroups.length === 1) {
      return [{type: "alone", content: phonesGroups[0].reduce<string>((acc, curr) => acc + curr.content, '')}]
    }
    const output: SyllableToken[] = [];
    for (const phoneSyllable of phonesGroups) {
      output.push({type: 'middle', content: phoneSyllable.reduce<string>((acc, curr) => acc + curr.content, '')})
    }
    output[0].type = 'start';
    output[output.length - 1].type = 'end';
    return output;
  }

  private hasVowel(phonesGroup: PhoneToken[]) {
    return phonesGroup.find(phone => phone.content.match(/[aeiouyąęó]/i)) !== undefined;
  }
}

export default SentenceSyllabizer;