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
  const all_words = grouped_dictionary_words as {
    [key: string]: {key: string; value: string}[];
  };
  const converted_data: {[key: string]: Word[]} = {};

  for (const key in all_words) {
    converted_data[key] = all_words[key].map(value => ({
      name: value.key.toUpperCase(),
      definition: value.value,
    }));
  }
  return converted_data;
}

export function get_random_word_by({word_length}: {word_length: number}): Word {
  const parsed_word =
    get_all_words()[word_length][
      Math.floor(Math.random() * get_all_words()[word_length].length)
    ];
  return parsed_word;
}
