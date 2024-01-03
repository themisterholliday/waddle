// *===================================
// * Game State & Usage
// *===================================

import {get_default_words_db, type Word, type WordsDB} from './words_db';

export interface CorrectlyGuessedCharacter {
  character: string;
  index_in_word: string;
}

export interface GameState {
  state: 'playing' | 'failed' | 'succeeded';
  word_to_guess: Word;
  tries_remaining: number;

  characters_correctly_guessed: CorrectlyGuessedCharacter[];
  characters_correctly_guessed_but_improper_placement: string[];

  characters_incorrectly_guessed: string[];
}

export interface GameStateManager {
  get_game_state: () => GameState;

  is_valid_word: (word: string) => boolean;

  guess_word: (word: string) => GameState;

  // Adds a random CorrectlyGuessedCharacter to the correctly guessed characters array
  get_hint: () => GameState;
}

function get_initial_game_state(word_to_guess: Word): GameState {
  return {
    state: 'playing',
    word_to_guess,
    tries_remaining: 6,
    characters_correctly_guessed: [],
    characters_correctly_guessed_but_improper_placement: [],
    characters_incorrectly_guessed: [],
  };
}

function get_updated_improper_placement_array({
  characters_correctly_guessed,
  characters_correctly_guessed_but_improper_placement,
}: {
  characters_correctly_guessed: CorrectlyGuessedCharacter[];
  characters_correctly_guessed_but_improper_placement: string[];
}): string[] {
  const clean_improper_placement =
    characters_correctly_guessed_but_improper_placement.filter(
      x => !characters_correctly_guessed.map(x => x.character).includes(x)
    );
  return clean_improper_placement;
}

interface IGameStateManagerOptions {
  words_db?: WordsDB;
  word_length: number;
}

export function get_game_state_manager({
  words_db = get_default_words_db(),
  word_length,
}: IGameStateManagerOptions): GameStateManager {
  const random_word = words_db.get_random_word_by({word_length});
  let parent_state = get_initial_game_state(random_word);

  function get_updated_new_state(new_state: GameState): GameState {
    return {
      ...new_state,
      characters_correctly_guessed:
        new_state.characters_correctly_guessed.filter(
          (value, index, array) =>
            array.findIndex(
              v =>
                v.character === value.character &&
                v.index_in_word === value.index_in_word
            ) === index
        ),
      characters_correctly_guessed_but_improper_placement: [
        ...new Set(
          new_state.characters_correctly_guessed_but_improper_placement
        ),
      ],
      characters_incorrectly_guessed: [
        ...new Set(new_state.characters_incorrectly_guessed),
      ],
    };
  }

  return {
    get_game_state: () => parent_state,
    is_valid_word: word => {
      return words_db
        .get_all_words()
        [word.length].some(value => word === value.name);
    },
    guess_word: word => {
      let new_state = {...parent_state};

      // TODO: (Craig Holliday 01/03/2024)
      // do validation on word
      // - length
      // - has symbols
      // - is all capital letters

      // check is correct word
      if (word === new_state.word_to_guess.name) {
        new_state = get_updated_new_state({...new_state, state: 'succeeded'});
        parent_state = {...new_state};
        return new_state;
      }

      const new_characters_correctly_guessed: CorrectlyGuessedCharacter[] = [
        ...new_state.characters_correctly_guessed,
      ];
      const new_characters_correctly_guessed_but_improper_placement: string[] =
        [...new_state.characters_correctly_guessed_but_improper_placement];
      const new_characters_incorrectly_guessed = [
        ...new_state.characters_incorrectly_guessed,
      ];

      // check each letter and put in proper array
      // - characters_correctly_guessed
      // - characters_correctly_guessed_but_improper_placement
      // - characters_incorrectly_guessed
      const previous_characters: string[] = [];
      for (const [index, character] of word.split('').entries()) {
        if (!new_state.word_to_guess.name.includes(character)) {
          new_characters_incorrectly_guessed.push(character);
          continue;
        }
        if (previous_characters.includes(character)) {
          continue;
        }
        if (new_state.word_to_guess.name[index] === character) {
          new_characters_correctly_guessed.push({
            character,
            index_in_word: index.toString(),
          });
        } else {
          new_characters_correctly_guessed_but_improper_placement.push(
            character
          );
        }

        previous_characters.push(character);
      }

      // update correctly guessed arrays so that none in the correctly guessed array are in the improperly placed array
      const clean_improper_placement_array =
        get_updated_improper_placement_array({
          characters_correctly_guessed: new_characters_correctly_guessed,
          characters_correctly_guessed_but_improper_placement:
            new_characters_correctly_guessed_but_improper_placement,
        });

      // subtract tries_remaining
      const new_tries_remaining = new_state.tries_remaining - 1;

      if (new_tries_remaining <= 0) {
        new_state = get_updated_new_state({
          ...new_state,
          tries_remaining: new_tries_remaining,
          state: 'failed',
        });
        parent_state = {...new_state};
        return new_state;
      }

      new_state = get_updated_new_state({
        ...new_state,
        tries_remaining: new_tries_remaining,
        characters_correctly_guessed: new_characters_correctly_guessed,
        characters_correctly_guessed_but_improper_placement:
          clean_improper_placement_array,
        characters_incorrectly_guessed: new_characters_incorrectly_guessed,
      });
      parent_state = {...new_state};
      return new_state;
    },
    get_hint: () => {
      let new_state = {...parent_state};
      // pick a random not yet guessed character and add it to correctly guessed characters
      const random_index = Math.floor(
        Math.random() * new_state.word_to_guess.name.length
      );
      const random_character = new_state.word_to_guess.name[random_index];
      const selected_character = {
        character: random_character,
        index_in_word: random_index.toString(),
      };
      const new_characters_correctly_guessed = [
        ...new_state.characters_correctly_guessed,
        selected_character,
      ];
      // update correctly guessed arrays so that none in the correctly guessed array are in the improperly placed array
      const clean_improper_placement_array =
        get_updated_improper_placement_array({
          characters_correctly_guessed: new_characters_correctly_guessed,
          characters_correctly_guessed_but_improper_placement:
            new_state.characters_correctly_guessed_but_improper_placement,
        });
      new_state = get_updated_new_state({
        ...new_state,
        characters_correctly_guessed: new_characters_correctly_guessed,
        characters_correctly_guessed_but_improper_placement:
          clean_improper_placement_array,
      });
      parent_state = {...new_state};
      return new_state;
    },
  };
}
