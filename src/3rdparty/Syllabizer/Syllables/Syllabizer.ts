import PhoneToken from "../Phones/PhoneToken";

type State = {
  syllables: PhoneToken[][];
  syllableBuffer: PhoneToken[];
  index: number;
  phones: PhoneToken[];
};

class Syllabizer {
  public syllabizePhones(phones: PhoneToken[]): PhoneToken[][] {

    const state: State = {
      syllables: [],
      index: 0,
      syllableBuffer: [],
      phones: phones
    }

    for (; state.index < phones.length; ++state.index) {
      const currSyl = phones[state.index];

      if (currSyl.type === 'v') {
        this.handleVowel(state);
      } else {
        this.handleConsonant(state)
      }
    }

    if (state.syllableBuffer.length > 0) {
      state.syllables.push(state.syllableBuffer);
    }
    return state.syllables;
  }


  private handleVowel(state: State) {
    const currSyll = state.phones[state.index];
    const nextSyll = this.arrayAt(state.phones, state.index + 1);

    state.syllableBuffer.push(currSyll);
    if (nextSyll?.type === 'v') {
      state.syllables.push(state.syllableBuffer);
      state.syllableBuffer = [];
    }
  }

  private handleConsonant(state: State) {
    const prevSyll = this.arrayAt(state.phones, state.index - 1);
    const currSyll = state.phones[state.index];
    const nextSyll = this.arrayAt(state.phones, state.index + 1);
    const nextNextSyll = this.arrayAt(state.phones, state.index + 2);


    if (prevSyll?.type === 'v' && nextSyll?.type === 'v') {
      state.syllables.push(state.syllableBuffer);
      state.syllableBuffer = [currSyll];
    } else if (prevSyll?.type === 'v' && nextSyll?.type === 'c' && nextNextSyll?.type === 'v') {
      state.syllableBuffer.push(currSyll);
      state.syllables.push(state.syllableBuffer);
      state.syllableBuffer = []
    } else if (prevSyll?.type === 'c' && nextSyll?.type === 'c') {
      state.syllables.push(state.syllableBuffer);
      state.syllableBuffer = [currSyll];
    } else {
      state.syllableBuffer.push(currSyll);
    }
  }

  private arrayAt<T>(array: Array<T>, index: number): T | undefined {
    if (index < 0) { return undefined; };
    if (index >= array.length) { return undefined; }
    return array[index];
  }
}

export default Syllabizer;