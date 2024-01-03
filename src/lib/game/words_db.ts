// *===================================
// * Words "DB"
// *===================================

import grouped_dictionary_words from '../../assets/grouped_dictionary_words.json';

export interface Word {
  name: string;
  definition: string;
}

export interface WordsDB {
  get_all_words: () => {[key: string]: Word[]};
  get_random_word_by: (options: {word_length: number}) => Word;
}

export function get_default_words_db(): WordsDB {
  return {
    get_all_words,
    get_random_word_by,
  };
}

export function get_all_words(): {[key: string]: Word[]} {
  return grouped_dictionary_words as {[key: string]: Word[]};
}

export function get_random_word_by({word_length}: {word_length: number}): Word {
  return get_all_words()[word_length][Math.floor(Math.random() * 100)];
}
