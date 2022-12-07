const lines = 11;
const columns = 9;
const bw = 30;
const matrix = [];
const mines= [] ;
let gameOver = false;
let initialize = false;
let nMines = null;

const game = document.getElementById('game');
const btnReset = document.getElementById('btnReset');

document.addEventListener('DOMContentLoaded', onLoad);

function easyButton() {
  nMines = 10;
}

function mediumButton() {
  nMines = 15;
}

function hardButton() {
  nMines = 20;
}

function onLoad() {
  game.style.width = `${columns * bw}px`;
  game.style.height = `${lines * bw}px`;
  game.addEventListener('click',onClick);
  game.addEventListener('contextmenu',onRightClick);
  btnReset.addEventListener('click', onReset);
  generateTheTable();
}

function onReset() {
	game.innerHTML = '';
	gameOver = false;
	initialize = false;
	btnReset.disabled = true;
	generateTheTable();
}

function onClick(e) {
  if (nMines != null) {
    let tg = e.target.closest('div');
    if (initialize == false) {
      generateMines(nMines, tg.x, tg.y);
      initialize = true;
    }
    if (gameOver || tg.flag == true || tg.classList.contains('show')) {
      return;
    }
    if (tg.value == 'm') {
      tg.innerHTML = `<img src="./imagesMineSweeper/bomb.jpg">`
    } else {
      tg.textContent = tg.value;
    }
    tg.classList.add('show');
    if (tg.value == 'm') {
      alert('You lose!');
      gameOver = true;
	  btnReset.disabled = 
      false;
    }
    if (!tg.value){
      showAll(tg);
    }
  }
}

function onRightClick(e) {
  e.preventDefault();
  let tg = e.target;
  let div = tg.closest('div');
  if (gameOver || tg.classList.contains('show')) {
    return;
  }
  div.flag = !div.flag;
  if (div.flag == true){
    div.innerHTML = `<img src="./imagesMineSweeper/flag.jfif">`
    gameOver = mines.every(x => x.flag == true);
    if (gameOver == true){
      alert('You won!');
	  btnReset.disabled = false;
    }
  } else {
    div.innerHTML='';
  }
}

function showAll(tg) {
  let x = tg.x, y = tg.y;
  tg.textContent = tg.value;
  tg.classList.add('show');
  if(tg.value) {
    return;
  }
  let v = Array.from(game.children).filter(c => c != tg && !c.classList.contains('show') && x - 1 <= c.x && x + 1 >= c.x && y - 1 <= c.y && y + 1 >= c.y);
  v.forEach(showAll);
}

function generateTheTable(){
  matrix.length=0;
  for (let i = 0; i < lines; i++){
    matrix.push(Array(columns));
    for(let j=0; j < columns; j++){
      let div = document.createElement('div');
      div.x = j;
      div.y = i;
      div.style.top = `${i * bw}px`;
      div.style.left = `${j * bw}px`;
      matrix[i][j] = div;
      game.appendChild(div);
    }
  }
}

function generateMines(n, x, y) {
  let counter = game.children.length;
  mines.length = 0;
  for(let i = 0; i < n; i++){
    let element;
    do {
      let ndx = generateTheNumber(0, counter - 1);
      element = game.children[ndx];
    } while(element.value || (element.x == x && element.y == y))
    element.value='m';
    mines.push(element);
  }
  generateTheNeighbors(mines);
}

function generateTheNeighbors(mines) {
  let line, column, val;
  mines.forEach( e => {
    line = e.y;
    column = e.x;
    if (line >= 1) {
      val = matrix[line - 1][column].value;
      if (val != 'm') {
        matrix[line - 1][column].value = (val || 0) + 1;
      }
    }
    if (line < lines - 1) {
      val = matrix[line + 1][column].value;
      if (val != 'm') {
        matrix[line + 1][column].value = (val || 0) + 1;
      }
    }
    for (let i = 0; i < 3; i++) {
      if (line - 1 + i < 0 || line - 1 + i >= lines || column == 0) {
        continue;
      }
      val = matrix[line - 1 + i][column - 1].value;
      if (val == 'm') {
        continue;
      }
      matrix[line - 1 + i][column - 1].value = (val || 0) + 1;
    }
    for (let i = 0; i < 3; i++) {
      if (line - 1 + i < 0 || line - 1 + i >= lines || column == columns - 1) {
        continue;
      }
      val = matrix[line - 1 + i][column + 1].value;
      if(val == 'm') {
        continue;
      }
      matrix[line - 1 + i][column + 1].value = (val || 0) + 1;
    }
  });
}

function generateTheNumber(min, max) {
  return Math.ceil(min + Math.random() * (max - min));
}
