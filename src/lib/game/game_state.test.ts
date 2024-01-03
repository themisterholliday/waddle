import {describe, expect, it} from 'vitest';
import {get_game_state_manager} from './game_state';

import type {Word, WordsDB} from './words_db';

describe('Game State is Init', () => {
  it('has default game state', () => {
    const word = {name: 'test', definition: 'test'};
    const words_db = build_mock_words_db(word);
    const state_manager = get_game_state_manager({words_db, word_length: 4});
    expect(state_manager.get_game_state().state).toEqual('playing');
    expect(state_manager.get_game_state().tries_remaining).toEqual(6);
    expect(state_manager.get_game_state().word_to_guess).toEqual(word);
  });

  it('init with default words_db value', () => {
    const state_manager = get_game_state_manager({word_length: 4});
    expect(state_manager.get_game_state().state).toEqual('playing');
    expect(state_manager.get_game_state().tries_remaining).toEqual(6);
    expect(state_manager.get_game_state().word_to_guess).toBeDefined();
  });
});

describe('Playing Scenarios', () => {
  it('1 guess', () => {
    const word = {name: 'test', definition: 'test'};
    const words_db = build_mock_words_db(word);
    const state_manager = get_game_state_manager({words_db, word_length: 4});

    const game_state = state_manager.guess_word('tate');
    expect(game_state.state).toEqual('playing');
    expect(game_state.tries_remaining).toEqual(5);
    expect(game_state.characters_correctly_guessed).toEqual([
      {character: 't', index_in_word: '0'},
    ]);
    expect(
      game_state.characters_correctly_guessed_but_improper_placement
    ).toEqual(['e']);
    expect(game_state.characters_incorrectly_guessed).toEqual(['a']);
  });

  it('2 guesses', () => {
    const word = {name: 'test', definition: 'test'};
    const words_db = build_mock_words_db(word);
    const state_manager = get_game_state_manager({words_db, word_length: 4});

    const game_state = state_manager.guess_word('tate');
    expect(game_state.state).toEqual('playing');
    expect(game_state.tries_remaining).toEqual(5);
    expect(game_state.characters_correctly_guessed).toEqual([
      {character: 't', index_in_word: '0'},
    ]);
    expect(
      game_state.characters_correctly_guessed_but_improper_placement
    ).toEqual(['e']);
    expect(game_state.characters_incorrectly_guessed).toEqual(['a']);

    const game_state_2 = state_manager.guess_word('tell');
    expect(game_state_2.state).toEqual('playing');
    expect(game_state_2.tries_remaining).toEqual(4);
    expect(game_state_2.characters_correctly_guessed).toEqual([
      {character: 't', index_in_word: '0'},
      {character: 'e', index_in_word: '1'},
    ]);
    expect(
      game_state_2.characters_correctly_guessed_but_improper_placement
    ).toEqual([]);
    expect(game_state_2.characters_incorrectly_guessed).toEqual(['a', 'l']);
  });

  it('3 guesses - succeeded', () => {
    const word = {name: 'test', definition: 'test'};
    const words_db = build_mock_words_db(word);
    const state_manager = get_game_state_manager({words_db, word_length: 4});

    const game_state = state_manager.guess_word('tate');
    expect(game_state.state).toEqual('playing');
    expect(game_state.tries_remaining).toEqual(5);
    expect(game_state.characters_correctly_guessed).toEqual([
      {character: 't', index_in_word: '0'},
    ]);
    expect(
      game_state.characters_correctly_guessed_but_improper_placement
    ).toEqual(['e']);
    expect(game_state.characters_incorrectly_guessed).toEqual(['a']);

    const game_state_2 = state_manager.guess_word('tell');
    expect(game_state_2.state).toEqual('playing');
    expect(game_state_2.tries_remaining).toEqual(4);
    expect(game_state_2.characters_correctly_guessed).toEqual([
      {character: 't', index_in_word: '0'},
      {character: 'e', index_in_word: '1'},
    ]);
    expect(
      game_state_2.characters_correctly_guessed_but_improper_placement
    ).toEqual([]);
    expect(game_state_2.characters_incorrectly_guessed).toEqual(['a', 'l']);

    const game_state_3 = state_manager.guess_word('test');
    expect(game_state_3.state).toEqual('succeeded');
  });

  it('6 guesses - failed', () => {
    const word = {name: 'test', definition: 'test'};
    const words_db = build_mock_words_db(word);
    const state_manager = get_game_state_manager({words_db, word_length: 4});

    const game_state = state_manager.guess_word('tate');
    expect(game_state.state).toEqual('playing');
    expect(game_state.tries_remaining).toEqual(5);
    expect(game_state.characters_correctly_guessed).toEqual([
      {character: 't', index_in_word: '0'},
    ]);
    expect(
      game_state.characters_correctly_guessed_but_improper_placement
    ).toEqual(['e']);
    expect(game_state.characters_incorrectly_guessed).toEqual(['a']);

    const game_state_2 = state_manager.guess_word('tell');
    expect(game_state_2.state).toEqual('playing');
    expect(game_state_2.tries_remaining).toEqual(4);
    expect(game_state_2.characters_correctly_guessed).toEqual([
      {character: 't', index_in_word: '0'},
      {character: 'e', index_in_word: '1'},
    ]);
    expect(
      game_state_2.characters_correctly_guessed_but_improper_placement
    ).toEqual([]);
    expect(game_state_2.characters_incorrectly_guessed).toEqual(['a', 'l']);

    state_manager.guess_word('tell');
    state_manager.guess_word('tell');
    state_manager.guess_word('tell');

    const game_state_failed = state_manager.guess_word('tell');
    expect(game_state_failed.state).toEqual('failed');
    expect(game_state_failed.tries_remaining).toEqual(0);
  });
});

describe('Hint', () => {
  it('1 hint', () => {
    const word = {name: 'test', definition: 'test'};
    const words_db = build_mock_words_db(word);
    const state_manager = get_game_state_manager({words_db, word_length: 4});

    const game_state = state_manager.get_hint();
    expect(game_state.state).toEqual('playing');
    expect(game_state.tries_remaining).toEqual(6);
    expect([
      {character: 't', index_in_word: '0'},
      {character: 'e', index_in_word: '1'},
      {character: 's', index_in_word: '2'},
      {character: 't', index_in_word: '3'},
    ]).toContainEqual(game_state.characters_correctly_guessed[0]);
    expect(
      game_state.characters_correctly_guessed_but_improper_placement
    ).toEqual([]);
    expect(game_state.characters_incorrectly_guessed).toEqual([]);
  });
});

function build_mock_words_db(word: Word): WordsDB {
  return {
    get_all_words: () => {
      return {[word.name.length]: [word]};
    },
    get_random_word_by() {
      return word;
    },
  };
}
