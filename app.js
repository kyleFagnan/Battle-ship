document.addEventListener("DOMContentLoaded", () => {
  const userGrid = document.querySelector(".grid-user");
  const computerGrid = document.querySelector(".grid-computer");
  const displayGrid = document.querySelector(".grid-display");
  const ships = document.querySelectorAll(".ship");
  const destroyer = document.querySelector(".destroyer-container");
  const submarine = document.querySelector(".submarine-container");
  const cruiser = document.querySelector(".cruiser-container");
  const battleship = document.querySelector(".battleship-container");
  const carrier = document.querySelector(".carrier-container");
  const startButton = document.querySelector("#start");
  const rotateButton = document.querySelector("#rotate");
  const turnDisplay = document.querySelector("#whos-go");
  const infoDisplay = document.querySelector("#info");
  const userSqaures = [];
  const computerSqaures = [];
  const width = 10;
  let isHorizontal = true;

  //create boards 
  function createBoards(grid, sqaures) {
    for (let i = 0; i < width * width; i++) {
      const sqaure = document.createElement("div");
      sqaure.dataset.id = i;
      grid.appendChild(sqaure);
      sqaures.push(sqaure);
    }
  }

  createBoards(userGrid, userSqaures);
  createBoards(computerGrid, computerSqaures);

  const shipArray = [
    {
      name: 'destroyer',
      directions: [
        [0, 1],
        [0, width]
      ]
    },
    {
      name: 'submarine',
      directions: [
        [0, 1, 2],
        [0, width, width*2]
      ]
    },
    {
      name: 'cruiser',
      directions: [
        [0, 1, 2],
        [0, width, width*2]
      ]
    },
    {
      name: 'battleship',
      directions: [
        [0, 1, 2, 3],
        [0, width, width*2, width*3]
      ]
    },
    {
      name: 'carrier',
      directions: [
        [0, 1, 2, 3, 4],
        [0, width, width*2, width*3, width*4]
      ]
    },
  ]

  //place computer ships randomly
  function generate(ship) {
    let randomDirection = Math.floor(Math.random() * ship.directions.length);
    let current = ship.directions[randomDirection];
    if (randomDirection === 0) direction = 1;
    if (randomDirection === 1) direction = 10;
    let randomStart = Math.abs(Math.floor(Math.random() * computerSqaures.length - (ship.directions[0].length)));

    const isTaken = current.some(index => computerSqaures[randomStart + index].classList.contains('taken'));
    const isAtRightEdge = current.some(index => (randomStart + index) % width === width - 1);
    const isAtLeftEdge = current.some(index => (randomStart + index) % width === 0);

    if(!isTaken && !isAtRightEdge && !isAtLeftEdge) current.forEach(index => computerSqaures[randomStart + index].classList.add('taken', ship.name));

    else generate(ship);
  };

  generate(shipArray[0]);
  generate(shipArray[1]);
  generate(shipArray[2]);
  generate(shipArray[3]);
  generate(shipArray[4]);

  //rotate ships
  function rotate() {
    if(isHorizontal) {
      destroyer.classList.toggle('destroyer-container-vertical');
      submarine.classList.toggle('submarine-container-vertical');
      cruiser.classList.toggle('cruiser-container-vertical');
      battleship.classList.toggle('battleship-container-vertical');
      carrier.classList.toggle('carrier-container-vertical');
      isHorizontal = false;
    }
    if(!isHorizontal) {
      destroyer.classList.toggle('destroyer-container');
      submarine.classList.toggle('submarine-container');
      cruiser.classList.toggle('cruiser-container');
      battleship.classList.toggle('battleship-container');
      carrier.classList.toggle('carrier-container');
      isHorizontal = true;
    }
  }
  rotateButton.addEventListener('click', rotate)

  //move ships
  ships.forEach(ship => ship.addEventListener('dragstart', dragStart));
  userSqaures.forEach(sqaure => sqaure.addEventListener('dragstart', dragStart));
  userSqaures.forEach(sqaure => sqaure.addEventListener('dragover', dragOver));
  userSqaures.forEach(sqaure => sqaure.addEventListener('dragenter', dragEnter));
  userSqaures.forEach(sqaure => sqaure.addEventListener('dragleave', dragLeave));
  userSqaures.forEach(sqaure => sqaure.addEventListener('dragDrop', dragDrop));
  userSqaures.forEach(sqaure => sqaure.addEventListener('dragend', dragEnd));

  let selectedShipNameWithIndex;
  let draggedShip;
  let draggedShipLength;

  ships.forEach(ship => ship.addEventListener('mousedown', (e) => {
    selectedShipNameWithIndex = e.target.id
  }))

  function dragStart() {
    draggedShip = this;
    draggedShipLength = this.childNodes.length;
    console.log(draggedShip)
  }

  function dragOver(e) {
    e.preventDefault();
  }

  function dragEnter(e) {
    e.preventDefault();
  }

  function dragLeave() {
    
  }
  function dragDrop() {
    let shipNameWithLastId = draggedShip.lastChild.id;
    let shipClass = shipNameWithLastId.slice(0, -2);
    console.log(shipClass);
    let lastShipIndex = parseInt(shipNameWithLastId.substr(-1));
    let shipLastId = lastShipIndex + parseInt(this.dataset.id);
    const notAllowedHorizontal = [0,10,20,30,40,50,60,70,80,90,1,11,21,31,41,51,61,71,81,91,2,22,32,42,52,62,72,82,92,3,13,23,33,43,53,63,73,83,93];
    const notAllowedVertical = [99,98,97,96,95,94,93,92,91,90,89,88,87,86,85,84,83,82,81,80,79,78,77,76,75,74,73,72,71,70,69,68,67,66,65,64,63,62,61,60];
    let newNotAllowedHorizontal = notAllowedHorizontal.splice(0, 10 * lastShipIndex);
    let newNotAllowedHorizontal = notAllowedVertical.splice(0, 10 * lastShipIndex);
    selectedShipIndex = parseInt(selectedShipNameWithIndex.substr(-1));
    
    shipLastId =shipLastId - selectedShipIndex;

    if (isHorizontal && !newNotAllowedHorizontal.includes(shipLastId)) {
      for (let i = 0; i < draggedShipLength; i++) {
      userSqaures[parseInt(this.dataset.id) - selectedShipIndex  + i].classList.add('taken', shipClass);
    }
  } else if (!isHorizontal && !notAllowedVertical.includes(shipLastId)) {
    for (let i = 0; i < draggedShipLength; i++) {
      userSqaures[parseInt(this.dataset.id) - selectedShipIndex + width * i].classList.add('taken', shipClass);
    }
  } else return;

  displayGrid.removeChild(draggedShip);

  }

  function dragEnd() {
    
  }

});