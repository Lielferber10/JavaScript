import { cell, playerMove, stats, runningGame, gameMode, modifyCell, modifyPlayerMove, modifyStats, modifyRunningGame, modifyGameMode, modifyGameLevel } from "../data/data.js";

import { computerChoosing } from "./cumputerMove.js";

import { randomInt, getOccurrence } from "./utilities.js";

for(let i = 0; i < 9; i++)
{
    document.querySelector(`.button${i}`).addEventListener('click', () => playMove(i));
}

document.querySelector('.reset-button').addEventListener('click', () => resetGame());

document.querySelector('.players-button').addEventListener('click', () => changeGameMode());

document.querySelector('#computer-skills-drop-down').addEventListener('change', (event) => changeGameLevel(event));

//play a round in the game
function playMove(buttonNum)
{
    let cellElement = document.querySelector(`.button${buttonNum}`);
    if(!cellElement.innerHTML && runningGame)
    {
        cellElement.innerHTML = playerMove;
        modifyCell(playerMove, buttonNum);
        cellElement.classList.add(`player-${playerMove}`);
        if(gameMode === 1 && playerMove === 'O')
        {
            cellElement.classList.add(`computer-O`);
        }
        const audio = new Audio('../other/buttonClick.wav');
        audio.play();
        const result1 = checkWinner();
        const result2 = checkTie();
        if(!result1 && !result2)
        {
            playerMove === 'X' ? modifyPlayerMove('O') : modifyPlayerMove('X');
            if(gameMode === 1 && playerMove === 'O')
            {
                const i = computerChoosing();
                playMove(i);
            }
        } 
        else
        {
            modifyRunningGame(false);
            if(gameMode === 1)
            {
                const XOccurrences = getOccurrence(cell, 'X');
                const OOccurrences = getOccurrence(cell, 'O');

                if(OOccurrences < XOccurrences)
                {
                    modifyPlayerMove('O');
                }
                else if(OOccurrences > XOccurrences)
                {
                    modifyPlayerMove('X');
                }
            }       
        }
    }
}


//if the last player won or there is a tie return true and end the game otherwise return undefiend
function checkWinner()
{
    let winningCells = checkWinningCells();
    if(winningCells)
    {
        const winnerTextElement = document.querySelector('.winner');
        if(gameMode === 1)
        {
            if(cell[winningCells[0]] === 'X')
            {
                winnerTextElement.innerHTML = 'Player X win !';
                const audio = new Audio('../other/winSound.wav');
                audio.play();
            }
            else if(cell[winningCells[0]] === 'O')
            {
                winnerTextElement.innerHTML = 'Computer O win !';
                const audio = new Audio('../other/winSound.wav');
                audio.play();
            }
        }
        else
        {
            winnerTextElement.innerHTML = `Player ${cell[winningCells[0]]} win !`;
            const audio = new Audio('../other/winSound.wav');
            audio.play();
        }

        if(cell[winningCells[0]] === 'X')
        {
            modifyStats(stats[0]+1, 0);
        }
        else if(cell[winningCells[0]] === 'O')
        {
            modifyStats(stats[2]+1, 2);
        }

        for(let i = 0; i < 3; i++)
        {
            document.querySelector(`.button${winningCells[i]}`).classList.add('winningCell');
        }

        for(let i = 0; i < 9; i++)
        {
            if(!document.querySelector(`.button${i}`).classList.contains('winningCell'))
            {
                document.querySelector(`.button${i}`).classList.add('lossingCell');
            }
        }
    }
    else
    {
        const tie = checkTie();
        if(tie)
        {
            document.querySelector('.winner').innerHTML = `Tie !`;
            modifyStats(stats[1]+1, 1);
        }
    }
    
    for(let i = 0; i < 3; i++)
    {
        document.querySelector(`.stats-counter${i+1}`).innerHTML = `${stats[i]}`;
    }
    return winningCells !== undefined;
}

//checl if there is a tie
function checkTie()
{
    for(let i = 0; i < 9; i++)
    {
        if(!cell[i])
        {
            return false
        }
    }
    return true;
}


//reset and restart the game
function resetGame()
{
    for(let i = 0; i < 9; i++)
    {
        modifyCell('', i);
        let cellElement = document.querySelector(`.button${i}`);
        cellElement.innerHTML = '';
       
        if(cellElement.classList.contains(`player-X`))
        {
            cellElement.classList.remove(`player-X`);
        }
        else if(cellElement.classList.contains(`player-O`))
        {
            cellElement.classList.remove(`player-O`);
            if(gameMode === 1)
            {
                cellElement.classList.remove(`computer-O`);
            }
        }

        if(cellElement.classList.contains('winningCell'))
        {
            cellElement.classList.remove('winningCell');
        }
        else if(cellElement.classList.contains('lossingCell'))
        {
            cellElement.classList.remove('lossingCell');
        }
    }

    document.querySelector('.winner').innerHTML = '';
    modifyRunningGame(true);
    if(gameMode === 1 && playerMove === 'O')
    {
        playMove(randomInt(0, 8));
    }
    else if(gameMode === 2)
    {
        modifyPlayerMove('X');
    }
}

//change game mode to P v P or P v C
function changeGameMode()
{
    const buttonElement = document.querySelector('.players-button');
    const nameElement = document.querySelector('.stats-name3');
    if(gameMode === 1)
    {
        modifyGameMode(2);
        buttonElement.innerHTML = '&#8473;<span class="players-button-span">VS</span>&#8473;';
        nameElement.innerHTML = 'PLAYER O';
        modifyPlayerMove('X');
        document.querySelector('#computer-skills-drop-down').classList.add('computer-skills-drop-down-empty');
    }
    else
    {
        modifyGameMode(1);
        buttonElement.innerHTML = '&#8473;<span class="players-button-span">VS</span>&#8450;';
        nameElement.innerHTML = 'COMPUTER O';
        document.querySelector('#computer-skills-drop-down').classList.remove('computer-skills-drop-down-empty');
        document.querySelector('#computer-skills-drop-down').value = 'expert'
    }

    for(let i = 0; i < 3; i++)
    {
        document.querySelector(`.stats-counter${i+1}`).innerHTML = '0';
        modifyStats(0, i);
    }
    resetGame();
}


//checl if there are winning cells. if so return them, otherwise return undefiend
export function checkWinningCells()
{
    for(let i = 0; i < 3; i++)
    {
        if(cell[3*i] && cell[3*i] === cell[1+3*i] && cell[1+3*i] === cell[2+3*i])
        {
            return [3*i, 1+3*i, 2+3*i];
        }
        else if(cell[i] &&cell[i] === cell[3+i] && cell[3+i] === cell[6+i])
        {
            return [i, 3+i, 6+i];
        }
    }

    if(cell[0] && cell[0] === cell[4] && cell[4] === cell[8])
    {
        return [0, 4, 8];
    }
    else if(cell[2] && cell[2] === cell[4] && cell[4] === cell[6])
    {
        return [2, 4, 6];
    }
    return undefined
}


//change game level ∈ {novice, expert, devine}
function changeGameLevel(event)
{
    const selectedValue = event.target.value;
    switch (selectedValue)
    {
        case 'novice':
            modifyGameLevel(1);
            break;
        case 'expert':
            modifyGameLevel(2);
            break;
        case 'devine':
            modifyGameLevel(3);
            break;
    }
    resetGame();
}


