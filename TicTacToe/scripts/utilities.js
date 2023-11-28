import { cell } from "../data/data.js";

//return random int ∈ {min, min+1,...,max-min}
export function randomInt(min, max)
{
    let num = Math.floor(Math.random() * (max - min + 1) + min);
    while(num === max - min + 1)
    {
        num = Math.floor(Math.random() * (max - min + 1) + min)
    }

    return num;
}

//return the number of occurences of the value in the array
export function getOccurrence(array, value)
{
    let count = 0;
    array.forEach(v => (v === value && count++));
    return count;
}

//return list of cells with the value type
export function getIndexesOf(type)
{
    let indexes = [];
    for (let i = 0; i < 9; i++)
    {
        if(cell[i] === type)
        {
            indexes.push(i);
        }
    }
    return indexes;
}

//return all empty cells
export function getEmptyCells()
{
    return getIndexesOf('');
}