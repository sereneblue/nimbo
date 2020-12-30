import { writable, Writable } from 'svelte/store';
import nimbo from '../nimbo';

export const nimboStore: Writable<any> = writable(new nimbo())