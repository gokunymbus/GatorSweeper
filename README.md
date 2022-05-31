# Meowsweeper
A game i built based on Minesweeper with a few twists.

GatorSweeper

# Overview
I have decided to build my own version of minesweeper called GatorSweeper. I plan on writing  about the requirements and any other useful information I uncovered along the way. By the end of this document, you should understand how minesweeper works and how I plan on building my own version of it.
What is Minesweeper? 

The original minesweeper is a guessing game where the player is presented with a grid of tiles that might contain a mine. It’s up to the player to uncover every tile except for the ones with mines under them. Uncovering a tile with no mine will begin uncovering tiles in its perimeter. If a tile in the perimeter is a blank tile the game will begin uncovering perimeters for it, otherwise if the tile has a number in it it is only revealed and its proximities are left alone. 

If the player immediately uncovers a mine, the game ends. If the player uncovers a tile with a number in it, only that tile is revealed.Players can use proximity information to help determine where a mine might be. If the tile shows 8, that means that there are 8 mines around that tile and it’s probably best if you don’t click any tiles surrounding it. Players can also place flags on tiles where they believe a mine might be. The game also keeps track of time and the number of flags you can place. 

If you lose, you can start again and you can even change the difficulty which increases the game board size and likely the number of mines that could appear. 

## Requirements
### Web Based
GatorSweeper will work in any modern web browser on any operating system. As such, I will need to use JavaScript, CSS, and HTML to display and add interactivity to the game. The game will be hosted on my site TBD (gatorsweeper.gokunymbus.com) and available for free. I will utilize a JavaScript framework called ReactJS to handle the state of the UI and CSS to style it. 

### Display the Gameboard
The main part of the game should show an even length rows and columns Grid with no visible information about each cell or Tile within the grid. The Grid is the main portion of the game and it’s what the user interacts and sees when the page loads. 

These colors were used just during development and will not reflect the final design.

Grid
Before displaying the Grid we need to generate a data structure that we can pass to a React component to display. I have broken this process into several high level functions that I will compose together to create data for our Grid. Each function should return a new result without mutating any data provided to it. I wanted each function to perform a smaller action instead of overloading one function with everything. This will allow me to more easily write tests against each function. 

createGrid()
This function will create and return a new multi-dimensional array where the first dimension represents the Rows and the second dimension represents the Columns. The function will rely on linear recursion for both the rows and columns and will recurse based on the configured size of the grid. A new Tile object will be created and stored for each column in a row.  

Example Output

```
Array[row][column] = Tile{proximities: 0, isMeow: false, isRevealed: false}
```

addProximities()
This function will take a Grid and map each Row and Column/Tile. For each map call on a Tile, it will then make a call to getPerimeters(Range) and then reduce the total number of mines in perimeters and create a new Tile factory object and assign the reduced value to the perimeters field. After each Tile has been visited, the resulting new Grid will return.

Example Output
Array[row][column] = {proximities: 8, isMeow: false, isRevealed: false}

getPerimeters()
This function accepts a Range object containing the beginning and ending indexes in the range of the target and reduces the Rows and Columns to a flat Array of TileChangeFactory objects. Tiles are returned based on if the starting and ending row index and the column index are InRange. The function also ignores the target tile.


Example Output
[
{proximities: 8, isMeow: false, isRevealed: false, row: 1, column: 1},
{proximities: 8, isMeow: false, isRevealed: false, row: 1, column: 2},
{proximities: 8, isMeow: false, isRevealed: false, row: 1, column: 3},
{proximities: 8, isMeow: false, isRevealed: false, row: 2, column: 1},
{proximities: 8, isMeow: false, isRevealed: false, row: 2, column: 3},
{proximities: 8, isMeow: false, isRevealed: false, row: 3, column: 1},
{proximities: 8, isMeow: false, isRevealed: false, row: 3, column: 2},
{proximities: 8, isMeow: false, isRevealed: false, row: 3, column: 3}
]
rangeFactory()
The range factory accepts a targetRowIndex and targetColumnIndex, calculates the starting row and index, ending row and index, and the target. It then returns a new object containing all these calculations. 

Example Output
{
	begin: {
		row: 1,
		column: 0
},
end: {
		row: 3,
		column: 2
},
target: {
		row: 2,
		column: 1
}

}

processTarget() and recursePerimeters()
The responsibility of this function is to return a flat change list of Tiles that will need to be mapped back to the original Grid. To do this we need to implement Mutual Recursion where two functions call each other until one more base condition(s) are met and the results are returned up the call stack to the original call. Below you can see an overview of how these two functions call each other. 



mapChanges()
This is a simple function that takes the list of Tile changes and maps them back to the original Grid and returns a new Grid.

React Component
I will be creating a <Grid> react component that will handle iterating through the Grid array and rendering sub components like <Tile>

<Grid gridData={Grid} onTileSelected={} />
Tiles
The Grid is made up of individual tiles that will be represented as an object. I have two factory functions for creating tiles that are used throughout the Grid creation process.
TileFactory()
Returns a new object with the following properties.

isMeow
isRevealed
proximities

The “isMeow” property is determined by a min/max random number generator function.
TileChangeFactory()
Similar to the TileFactory function except two additional properties are returned that indicate the row, and column the tile was originally placed in. TileFactory() and it’s results are used in this function call. 

React Component
I will create a <Tile> Component that handles events and the following states.
Covered - Not visible.
Uncovered - Blank
Uncovered - Displays Proximity information.
Uncovered - Displays Mine or special object.

<Tile {...Tile, onTileSelected={} row={} column={} />
Selecting a Tile
When a tile is selected by a user, a callBack function will be invoked that will be provided by the parent components of the <Tile>. This callback will pass through the tile information so that the parent components can make a decision or make calls to update the grid. 











### Getting started
1. Download the project through Git or just download a zip of it.
2. Make sure you have the latest version of Node.js
3. Run `npm install` to install dependencies.
4. To view in a browser run `npm run devserver`. This will create a server at `localhost:9000` that you can open in your browser.



