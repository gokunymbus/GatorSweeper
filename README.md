# GatorSweeper
![alt text](https://gatorsweeper.gokunymbus.com/gator-social-banner.png)

This is a passion project i have recently taken on, i built everything i could from scratch and designed the game and themes myself. It was honestly a fun experience and i hope to continue improving and working on it over time.

## Requirements
- node v14.17.X
- npm 6.14.X

## Installation and Running
1. Clone the repo locally ./GatorSweeper or a directory of your choise.
2. After node is installed, open a terminal inside the project directory.
3. Run `npm install`
4. To view the project in a browser and see changes in real time you can run `npm run devserver`

## Running Tests
1. To run the unit tests you can run `npm run test`.

## Running minified build
1. To run "prod" build run `npm run buildprod`.

## Running linting
1. To run linting `npm run lint`.

## Live site
The current project can be veiwed on https://gatorsweeper.gokunymbus.com/.

## Overview
I decided to build my own version of minesweeper called GatorSweeper. I used JavaScript, ReactJS, CSS, and HTML to build the project. I also rely on Jest for unit tests and React Testing library to test some behavior of components.

## Testing Library
On previous projects i always used Jest for unit tests but i also frequently used Enzyme but due to many reasons including: it's no longer maitained, and encourages bad testing practies i have decided to move to using React Testing Library. RTL is a great project that is actively maintained and supports more stable testing practices.

## TODOS/Future work
1. Linting should pass the build
  1. Currently the project is not passing the Google style rules linting, working on that.
2. Add a rest button when the game ends
3. Add the ability to save the game state on the server and even import states. 
4. See history of previous games.
5. Add a how to play section.
6. Create final translated strings for ARIA labeles
  1. The primary strings on the game are translated but the aria versions are not.
  2. Ideally i would use a translation library.
7. Create a better Winning theme.
  1. RIght now it just changes the image of the gator.
  2. It should look more like a win with a new theme and maybe other special effects. 










