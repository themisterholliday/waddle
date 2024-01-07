// *===================================
// * Words "DB"
// *===================================

import grouped_dictionary_words from '../../assets/grouped_dictionary_words.json';

export interface WordsDB {
  get_all_dictionary_words: () => {[key: string]: string[]};
  get_all_selectable_words: () => {[key: string]: string[]};
  get_random_selectable_word_by: (options: {word_length: number}) => string;
}

export function get_default_words_db(): WordsDB {
  return {
    get_all_dictionary_words,
    get_all_selectable_words,
    get_random_selectable_word_by,
  };
}

export function get_all_dictionary_words(): {[key: string]: string[]} {
  const all_words = grouped_dictionary_words as {
    [key: string]: string[];
  };

  const converted_data: {[key: string]: string[]} = {};

  for (const key in all_words) {
    converted_data[key] = all_words[key].map(
      value => (value = value.toUpperCase())
    );
  }
  return converted_data;
}

export function get_all_selectable_words(): {[key: string]: string[]} {
  const all_words = grouped_dictionary_words as {
    [key: string]: string[];
  };
  const converted_data: {[key: string]: string[]} = {};

  for (const key in all_words) {
    converted_data[key] = all_words[key].map(
      value => (value = value.toUpperCase())
    );
  }
  return converted_data;
}

export function get_random_selectable_word_by({
  word_length,
}: {
  word_length: number;
}): string {
  const parsed_word =
    get_all_selectable_words()[word_length][
      Math.floor(Math.random() * get_all_selectable_words()[word_length].length)
    ];
  return parsed_word;
}
