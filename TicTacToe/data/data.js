export let cell = ['', '', '', '', '', '', '', '', ''];
export let playerMove = 'X';
export let stats = [0, 0, 0];
export let runningGame = true;
export let gameMode = 1;
export let gameLevel = 2;

export function modifyCell(value, index) {cell[index] = value;}
export function modifyPlayerMove(value) {playerMove = value;}
export function modifyStats(value, index) {stats[index] = value;}
export function modifyRunningGame(value) {runningGame = value;}
export function modifyGameMode(value) {gameMode = value;}
export function modifyGameLevel(value) {gameLevel = value;}
