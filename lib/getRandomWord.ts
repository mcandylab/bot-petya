import words from "./words.js";

class GetRandomWord {
  static execute(): string {
    const randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex];
  }
}

export default GetRandomWord;
