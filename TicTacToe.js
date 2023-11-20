let cell = ['', '', '', '', '', '', '', '', ''];
let playerMove = 'X';
let stats = [0, 0, 0];
let runningGame = true;
let gameMode = 1;

for(let i = 0; i < 9; i++)
{
    document.querySelector(`.button${i}`).addEventListener('click', () => playMove(i));
}

document.querySelector('.reset-button').addEventListener('click', () => resetGame());

document.querySelector('.players-button').addEventListener('click', () => changeGameMode());


function playMove(buttonNum)
{
    let cellElement = document.querySelector(`.button${buttonNum}`);
    if(!cellElement.innerHTML && runningGame)
    {
        cellElement.innerHTML = playerMove;
        cell[buttonNum] = playerMove;
        cellElement.classList.add(`player-${playerMove}`);
        if(gameMode === 1 && playerMove === 'O')
        {
            cellElement.classList.add(`computer-O`);
        }
        const audio = new Audio('buttonClick.wav');
        audio.play();
        const result1 = checkWinner();
        const result2 = checkTie();
        if(!result1 && !result2)
        {
            playerMove === 'X' ? playerMove = 'O' : playerMove = 'X';
            if(gameMode === 1 && playerMove === 'O')
            {
                const i = computerChoosing();
                playMove(i);
            }
        } 
        else
        {
            runningGame = false;
            if(gameMode === 1)
            {
                const XOccurrences = getOccurrence(cell, 'X');
                const OOccurrences = getOccurrence(cell, 'O');

                if(OOccurrences < XOccurrences)
                {
                    playerMove = 'O';
                }
                else if(OOccurrences > XOccurrences)
                {
                    playerMove = 'X';
                }
            }       
        }
    }
}

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
                const audio = new Audio('winSound.wav');
                audio.play();
            }
            else if(cell[winningCells[0]] === 'O')
            {
                winnerTextElement.innerHTML = 'Computer O win !';
                const audio = new Audio('winSound.wav');
                audio.play();
            }
        }
        else
        {
            winnerTextElement.innerHTML = `Player ${cell[winningCells[0]]} win !`;
            const audio = new Audio('winSound.wav');
            audio.play();
        }

        if(cell[winningCells[0]] === 'X')
        {
            stats[0]++;
        }
        else if(cell[winningCells[0]] === 'O')
        {
            stats[2]++;
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
            stats[1]++
        }
    }
    
    for(let i = 0; i < 3; i++)
    {
        document.querySelector(`.stats-counter${i+1}`).innerHTML = `${stats[i]}`;
    }
    return winningCells !== undefined;
}

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

function resetGame()
{
    for(let i = 0; i < 9; i++)
    {
        cell[i] = '';
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
    runningGame = true;

    if(gameMode === 1 && playerMove === 'O')
    {
        playMove(randomInt(0, 8));
    }
    else if(gameMode === 2)
    {
        playerMove = 'X';
    }
}

function changeGameMode()
{
    const buttonElement = document.querySelector('.players-button');
    const nameElement = document.querySelector('.stats-name3');
    if(gameMode === 1)
    {
        gameMode = 2;
        buttonElement.innerHTML = '&#8473;<span class="players-button-span">VS</span>&#8473;';
        nameElement.innerHTML = 'PLAYER O';
        playerMove = 'X'
    }
    else
    {
        gameMode = 1;
        buttonElement.innerHTML = '&#8473;<span class="players-button-span">VS</span>&#8450;';
        nameElement.innerHTML = 'COMPUTER O';
    }

    for(let i = 0; i < 3; i++)
    {
        document.querySelector(`.stats-counter${i+1}`).innerHTML = '0';
        stats = [0, 0, 0];
    }
    resetGame();
}

function computerChoosing()
{
    let OOccurrences = getOccurrence(cell, 'O');
    if(OOccurrences === 4)
    {
        const emptyCell = getEmptyCells();
        return emptyCell[0];
    }
    else if(OOccurrences === 3 || OOccurrences === 2) //can be improved bט separating the 2 cases
    {
        const OCell = runSimulation('O');
        if(OCell !== -1)
        {
            return OCell;
        }
        else
        {
            XCell = runSimulation('X');
            if(XCell !== -1)
            {
                return XCell;
            }
            else
            {
                //can be improved
                const emptyCells = getEmptyCells();
                return emptyCells[randomInt(0, emptyCells.length-1)];
            }
        }
    }
    else if(OOccurrences === 1) //can be improved
    {
        XCell = runSimulation('X');
        if(XCell !== -1)
        {
            return XCell;
        }

        let OCellIndex = findOnlyCell('O');
        const options = getOptions(OCellIndex);
        return options[randomInt(0, options.length-1)];
    }
    else
    {
        const XCellIndex = findOnlyCell('X');
        let num = randomInt(0, 8);
        while(num === XCellIndex)
        {
            num = randomInt(0, 8);
        }

        return num;
    }
}

function findOnlyCell(type)
{
    for(let i = 0; i < 9; i++)
    {
        if(cell[i] === type)
        {
            return i;
        }
    }
}

function runSimulation(playerMove)
{
    for(let i = 0; i < 9; i++)
    {
        if(!cell[i])
        {
            cell[i] = playerMove;
            const winningCells = checkWinningCells();
            if(winningCells)
            {
                cell[i] = '';
                return i;
            }
            cell[i] = '';
        }
    }
    return -1;
}

function checkWinningCells()
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

function getEmptyCells()
{
    let arr = [];
    for(let i = 0; i < 9; i++)
    {
        if(!cell[i])
        {
            arr.push(i);
        }
    }
    return arr;
}

function getOptions(OCellIndex)
{
    let myOptions = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
    myOptions = myOptions.filter(option => option.includes(OCellIndex));
    myOptions.forEach(option => option.splice(option.indexOf(OCellIndex), 1));
    myOptions = myOptions.filter(option => cell[option[0]] === '' && cell[option[1]] === '');
    myOptions = myOptions.flat(Infinity);
    myOptions = myOptions.filter((option, index) => myOptions.indexOf(option) === index);
    return myOptions;
}

function randomInt(min, max)
{
    //random int ∈ {min, min+1,...,max-min}
    let num = Math.floor(Math.random() * (max - min + 1) + min);
    while(num === max - min + 1)
    {
        num = Math.floor(Math.random() * (max - min + 1) + min)
    }

    return num;
}

function getOccurrence(array, value)
{
    let count = 0;
    array.forEach(v => (v === value && count++));
    return count;
}