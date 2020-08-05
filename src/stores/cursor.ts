import { writable } from 'svelte/store';

const _cursor = writable<'' | 'pointer' | 'move'>('');
export const cursor = {
  ..._cursor,
  clear() {
    _cursor.set('');
  },
};
