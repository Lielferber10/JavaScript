import { cell, gameLevel, modifyCell } from "../data/data.js";

import { checkWinningCells } from "./TicTacToe.js";

import { randomInt, getOccurrence, getIndexesOf, getEmptyCells,  } from "./utilities.js";



//make a computer move
export function computerChoosing()
{
    const OOccurrences = getOccurrence(cell, 'O');
    const emptyCells = getEmptyCells();
    if(OOccurrences === 4)
    {
        return emptyCells[0];
    }
    else if(OOccurrences === 3 || OOccurrences === 2)
    {
        const OCell = runSimulation('O');
        if(OCell !== -1)
        {
            if(gameLevel > 1)
            {
                return OCell;
            }
            return emptyCells[randomInt(0, emptyCells.length-1)];
        }
        else
        {
            const XCell = runSimulation('X');
            if(XCell !== -1)
            {
                if(gameLevel > 1)
                {
                    return XCell;
                }
                return emptyCells[randomInt(0, emptyCells.length-1)];
            }
            else
            {
                const XOccurrences = getOccurrence(cell, 'X');
                if(XOccurrences === 4)
                {
                    const emptyCells = getEmptyCells();
                    return emptyCells[randomInt(0, emptyCells.length-1)];
                }
                else if(XOccurrences === 2 || XOccurrences === 3)
                {
                    const emptyCells = getEmptyCells();
                    if(gameLevel === 2)
                    {
                        for(let i = 0; i < emptyCells.length; i++)
                        {
                            modifyCell('O', emptyCells[i]);
                            if(runSimulation('O') !== -1)
                            {
                                const options = [emptyCells[i], runSimulation('O')];
                                modifyCell('', emptyCells[i]);
                                return options[randomInt(0, 1)];
                            }
                            modifyCell('', emptyCells[i]);
                        }
                    }
                    else if(gameLevel === 3)
                    {
                        return preventTrap();
                    }
                    return emptyCells[randomInt(0, emptyCells.length-1)];
                }
            }
        }
    }
    else if(OOccurrences === 1)
    {
        const emptyCells = getEmptyCells();
        if(gameLevel === 1)
        {
            return emptyCells[randomInt(0, emptyCells.length-1)];
        }

        const XOccurrences = getOccurrence(cell, 'X');
        if(XOccurrences === 2)
        {
            const XCell = runSimulation('X');
            if(XCell !== -1)
            {
                return XCell;
            }
            else
            {
                const OCellIndex = getIndexesOf('O')[0];
                const options = getOptions(OCellIndex);
                if(gameLevel === 2)
                {
                    return options[randomInt(0, options.length-1)];
                }
                else if(gameLevel === 3)
                {
                    return preventTrap();
                }
            }
        }
        else if(XOccurrences === 1)
        {
            const XCellIndex = getIndexesOf('X')[0];
            const OCellIndex = getIndexesOf('O')[0];
            const options = getOptions(OCellIndex);
            if(gameLevel === 2)
            {      
                return options[randomInt(0, options.length-1)];
            }
            else if(gameLevel === 3)
            {
                const options2 = [0,1,2,3,4,5,6,7,8].filter(option => options.indexOf(option) === -1 && option !== OCellIndex && option !== XCellIndex);
                return options2[randomInt(0, options2.length-1)];
            }
        }
    }
    else
    {
        const XCellIndex = getIndexesOf('X')[0];
        if(gameLevel < 3)
        {
            let num = randomInt(0, 8);
            while(num === XCellIndex)
            {
                num = randomInt(0, 8);
            }
            return num;
        }
        else if(gameLevel === 3)
        {
            if(XCellIndex !== 4)
            {
                return 4;
            }
            else
            {
                const options = [0,2,6,8];
                return options[randomInt(0, 3)];
            }
        }
    }
}

//return a cell that must be selected in order to prevent the opponent from winning (if exist). Otherwise return random empty cell
function preventTrap()
{
    const XOptions = getOptions2('X');
    let OOptions = getOptions2('O');
    OOptions = OOptions.flat(Infinity);
    OOptions = OOptions.filter((option, index) => OOptions.indexOf(option) === index);
    if(XOptions.length === 2)
    {
        const optionsIntersection = XOptions[0].filter(option => XOptions[1].includes(option));
        if(!optionsIntersection)
        {   
            return OOptions[randomInt(0, OOptions.length-1)];
        }
        else
        {
            const options = preventTrap2(OOptions, optionsIntersection)
            return options[randomInt(0, options.length-1)];
        }
    }
    else if(XOptions.length === 3)
    {
        const optionsIntersection1 = XOptions[0].filter(option => XOptions[1].includes(option));
        const optionsIntersection2 = XOptions[1].filter(option => XOptions[2].includes(option));
        const optionsIntersection3 = XOptions[0].filter(option => XOptions[2].includes(option));
        const options1 = preventTrap2(OOptions, optionsIntersection1);
        const options2 = preventTrap2(OOptions, optionsIntersection2);
        const options3 = preventTrap2(OOptions, optionsIntersection3);
        let options = [];
        if(!options1)
        {
            options = options2;
        }
        else
        {
            options = options1.filter(option => options2.includes(option));
        }
        if(!options)
        {
            options = options3;
        }
        else
        {
            options = options.filter(option => options3.includes(option));
        }
        if(!options)
        {
            const emptyCells = getEmptyCells();
            return emptyCells[randomInt(0, emptyCells.length-1)];
        }
        else
        {
            return options[0];
        }
    }
}


//return list of cells that can be selected (within the list returned from getOptions2('O)) in order to prevent the opponent from winning.
function preventTrap2(OOptions, optionsIntersection)
{
    let options = []
    for(let i = 0; i < OOptions.length; i++)
    {
        modifyCell('O', OOptions[i]);
        const OCell = runSimulation('O');
        if(!optionsIntersection.includes(OCell))
        {
            modifyCell('', OOptions[i]);
            options.push(OOptions[i]);
        }
        modifyCell('', OOptions[i]);
    }   
    return options;
}

//check if there is an empty cell that can be selected to make any player win. if so return it, otherwise return -1
function runSimulation(playerMove)
{
    for(let i = 0; i < 9; i++)
    {
        if(!cell[i])
        {
            modifyCell(playerMove, i);
            const winningCells = checkWinningCells();
            if(winningCells)
            {
                modifyCell('', i);
                return i;
            }
            modifyCell('', i);
        }
    }
    return -1;
}

//given a cell index, return a list of cells that can be selected in order to create (with another specific cell and the input cell) full row/column/diagonal
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

//return a list of cells that can be selected in order to create (with another 2 specifics cells) full row/column/diagonal
function getOptions2(type)
{
    const indexes = getIndexesOf(type);
    let options = [];
    for(let i = 0; i < indexes.length; i++)
    {
        options.push(getOptions(indexes[i]));
    }
    return options;
}