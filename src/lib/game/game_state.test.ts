import {describe, expect, it} from 'vitest';
import {get_game_state_manager} from './game_state';
import type {WordsDB} from './words_db';

describe('Game State is Init', () => {
  it('has default game state', () => {
    const word = 'TEST';
    const words_db = build_mock_words_db(word);
    const state_manager = get_game_state_manager({words_db, word_length: 4});
    expect(state_manager.get_game_state().playing_state).toEqual('playing');
    expect(state_manager.get_game_state().tries_remaining).toEqual(6);
    expect(state_manager.get_game_state().word_to_guess).toEqual(word);
  });

  it('init with default words_db value', () => {
    const state_manager = get_game_state_manager({word_length: 4});
    expect(state_manager.get_game_state().playing_state).toEqual('playing');
    expect(state_manager.get_game_state().tries_remaining).toEqual(6);
    expect(state_manager.get_game_state().word_to_guess).toBeDefined();
  });
});

describe('Playing Scenarios', () => {
  it('1 guess', () => {
    const word = 'TEST';
    const words_db = build_mock_words_db(word);
    const state_manager = get_game_state_manager({words_db, word_length: 4});

    const game_state = state_manager.guess_word('TATE');
    expect(game_state.playing_state).toEqual('playing');
    expect(game_state.tries_remaining).toEqual(5);
    expect(game_state.characters_correctly_guessed).toEqual([
      {character: 'T', index_in_word: '0'},
    ]);
    expect(
      game_state.characters_correctly_guessed_but_improper_placement
    ).toEqual([
      {character: 'T', index_in_word: '2'},
      {character: 'E', index_in_word: '3'},
    ]);
    expect(game_state.characters_incorrectly_guessed).toEqual(['A']);
  });

  it('2 guesses', () => {
    const word = 'TEST';
    const words_db = build_mock_words_db(word);
    const state_manager = get_game_state_manager({words_db, word_length: 4});

    const game_state = state_manager.guess_word('TATE');
    expect(game_state.playing_state).toEqual('playing');
    expect(game_state.tries_remaining).toEqual(5);
    expect(game_state.characters_correctly_guessed).toEqual([
      {character: 'T', index_in_word: '0'},
    ]);
    expect(
      game_state.characters_correctly_guessed_but_improper_placement
    ).toEqual([
      {character: 'T', index_in_word: '2'},
      {character: 'E', index_in_word: '3'},
    ]);
    expect(game_state.characters_incorrectly_guessed).toEqual(['A']);

    const game_state_2 = state_manager.guess_word('TELL');
    expect(game_state_2.playing_state).toEqual('playing');
    expect(game_state_2.tries_remaining).toEqual(4);
    expect(game_state_2.characters_correctly_guessed).toEqual([
      {character: 'T', index_in_word: '0'},
      {character: 'E', index_in_word: '1'},
    ]);
    expect(
      game_state_2.characters_correctly_guessed_but_improper_placement
    ).toEqual([
      {
        character: 'T',
        index_in_word: '2',
      },
      {
        character: 'E',
        index_in_word: '3',
      },
    ]);
    expect(game_state_2.characters_incorrectly_guessed).toEqual(['A', 'L']);
  });

  it('3 guesses - succeeded', () => {
    const word = 'TEST';
    const words_db = build_mock_words_db(word);
    const state_manager = get_game_state_manager({words_db, word_length: 4});

    const game_state = state_manager.guess_word('TATE');
    expect(game_state.playing_state).toEqual('playing');
    expect(game_state.tries_remaining).toEqual(5);
    expect(game_state.characters_correctly_guessed).toEqual([
      {character: 'T', index_in_word: '0'},
    ]);
    expect(
      game_state.characters_correctly_guessed_but_improper_placement
    ).toEqual([
      {character: 'T', index_in_word: '2'},
      {character: 'E', index_in_word: '3'},
    ]);
    expect(game_state.characters_incorrectly_guessed).toEqual(['A']);

    const game_state_2 = state_manager.guess_word('TELL');
    expect(game_state_2.playing_state).toEqual('playing');
    expect(game_state_2.tries_remaining).toEqual(4);
    expect(game_state_2.characters_correctly_guessed).toEqual([
      {character: 'T', index_in_word: '0'},
      {character: 'E', index_in_word: '1'},
    ]);
    expect(
      game_state_2.characters_correctly_guessed_but_improper_placement
    ).toEqual([
      {
        character: 'T',
        index_in_word: '2',
      },
      {
        character: 'E',
        index_in_word: '3',
      },
    ]);
    expect(game_state_2.characters_incorrectly_guessed).toEqual(['A', 'L']);

    const game_state_3 = state_manager.guess_word('TEST');
    expect(game_state_3.playing_state).toEqual('succeeded');
  });

  it('6 guesses - failed', () => {
    const word = 'TEST';
    const words_db = build_mock_words_db(word);
    const state_manager = get_game_state_manager({words_db, word_length: 4});

    const game_state = state_manager.guess_word('TATE');
    expect(game_state.playing_state).toEqual('playing');
    expect(game_state.tries_remaining).toEqual(5);
    expect(game_state.characters_correctly_guessed).toEqual([
      {character: 'T', index_in_word: '0'},
    ]);
    expect(
      game_state.characters_correctly_guessed_but_improper_placement
    ).toEqual([
      {character: 'T', index_in_word: '2'},
      {character: 'E', index_in_word: '3'},
    ]);
    expect(game_state.characters_incorrectly_guessed).toEqual(['A']);

    const game_state_2 = state_manager.guess_word('TELL');
    expect(game_state_2.playing_state).toEqual('playing');
    expect(game_state_2.tries_remaining).toEqual(4);
    expect(game_state_2.characters_correctly_guessed).toEqual([
      {character: 'T', index_in_word: '0'},
      {character: 'E', index_in_word: '1'},
    ]);
    expect(
      game_state_2.characters_correctly_guessed_but_improper_placement
    ).toEqual([
      {character: 'T', index_in_word: '2'},
      {character: 'E', index_in_word: '3'},
    ]);
    expect(game_state_2.characters_incorrectly_guessed).toEqual(['A', 'L']);

    state_manager.guess_word('TELL');
    state_manager.guess_word('TELL');
    state_manager.guess_word('TELL');

    const game_state_failed = state_manager.guess_word('TELL');
    expect(game_state_failed.playing_state).toEqual('failed');
    expect(game_state_failed.tries_remaining).toEqual(0);
  });

  it('6 guesses - 5 wrong, 1 right', () => {
    const word = 'TEST';
    const words_db = build_mock_words_db(word);
    const state_manager = get_game_state_manager({words_db, word_length: 4});

    const game_state = state_manager.guess_word('TATE');
    expect(game_state.playing_state).toEqual('playing');
    expect(game_state.tries_remaining).toEqual(5);
    expect(game_state.characters_correctly_guessed).toEqual([
      {character: 'T', index_in_word: '0'},
    ]);
    expect(
      game_state.characters_correctly_guessed_but_improper_placement
    ).toEqual([
      {character: 'T', index_in_word: '2'},
      {character: 'E', index_in_word: '3'},
    ]);
    expect(game_state.characters_incorrectly_guessed).toEqual(['A']);

    const game_state_2 = state_manager.guess_word('TELL');
    expect(game_state_2.playing_state).toEqual('playing');
    expect(game_state_2.tries_remaining).toEqual(4);
    expect(game_state_2.characters_correctly_guessed).toEqual([
      {character: 'T', index_in_word: '0'},
      {character: 'E', index_in_word: '1'},
    ]);
    expect(
      game_state_2.characters_correctly_guessed_but_improper_placement
    ).toEqual([
      {character: 'T', index_in_word: '2'},
      {character: 'E', index_in_word: '3'},
    ]);
    expect(game_state_2.characters_incorrectly_guessed).toEqual(['A', 'L']);

    state_manager.guess_word('TELL');
    state_manager.guess_word('TELL');
    state_manager.guess_word('TELL');

    const game_state_failed = state_manager.guess_word('TELL');
    expect(game_state_failed.playing_state).toEqual('failed');
    expect(game_state_failed.tries_remaining).toEqual(0);
  });

  it('1 guess - two correctly guessed characters of same character', () => {
    const word = 'TEST';
    const words_db = build_mock_words_db(word);
    const state_manager = get_game_state_manager({words_db, word_length: 4});

    const game_state = state_manager.guess_word('TART');
    expect(game_state.playing_state).toEqual('playing');
    expect(game_state.tries_remaining).toEqual(5);
    expect(game_state.characters_correctly_guessed).toEqual([
      {character: 'T', index_in_word: '0'},
      {character: 'T', index_in_word: '3'},
    ]);
    expect(
      game_state.characters_correctly_guessed_but_improper_placement
    ).toEqual([]);
    expect(game_state.characters_incorrectly_guessed).toEqual(['A', 'R']);
  });
});

describe('Hint', () => {
  it('1 hint', () => {
    const word = 'TEST';
    const words_db = build_mock_words_db(word);
    const state_manager = get_game_state_manager({words_db, word_length: 4});

    const game_state = state_manager.get_hint();
    expect(game_state.playing_state).toEqual('playing');
    expect(game_state.tries_remaining).toEqual(6);
    expect([
      {character: 'T', index_in_word: '0'},
      {character: 'E', index_in_word: '1'},
      {character: 'S', index_in_word: '2'},
      {character: 'T', index_in_word: '3'},
    ]).toContainEqual(game_state.characters_correctly_guessed[0]);
    expect(
      game_state.characters_correctly_guessed_but_improper_placement
    ).toEqual([]);
    expect(game_state.characters_incorrectly_guessed).toEqual([]);
  });
});

function build_mock_words_db(word: string): WordsDB {
  return {
    get_all_selectable_words: () => {
      return {[word.length]: [word]};
    },
    get_all_dictionary_words: () => {
      return {[word.length]: [word]};
    },
    get_random_selectable_word_by() {
      return word;
    },
  };
}
