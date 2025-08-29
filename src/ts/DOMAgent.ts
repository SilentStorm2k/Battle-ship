import { Coordinate } from './coordinate';
import { Player } from './player';
import { Ship } from './ship';

export const DOMAgent = {
    player1: null as Player | null,
    player2: null as Player | null,
    placingShips: true,
    shipOrientation: true,

    renderLandingPage() {
        const mainElement = document.querySelector('main');
        if (!mainElement) {
            console.error('Main element not found!');
            return;
        }

        mainElement.innerHTML = '';

        const landingPageContainer = document.createElement('div');
        landingPageContainer.className = 'landing-page';

        const welcomeMessage = document.createElement('h1');
        welcomeMessage.textContent = 'Welcome to Battleship!';

        const form = document.createElement('form');
        form.id = 'landing-form';

        const nameLabel = document.createElement('label');
        nameLabel.textContent = 'Enter your name:';
        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.id = 'userName1';
        nameInput.name = 'userName1';
        nameInput.placeholder = 'Player 1';
        nameInput.required = true;

        const modeLabel = document.createElement('label');
        modeLabel.textContent = 'Select game mode:';
        const modeSelect = document.createElement('select');
        modeSelect.id = 'gameMode';
        modeSelect.name = 'gameMode';

        const aiOption = document.createElement('option');
        aiOption.value = 'vsAI';
        aiOption.textContent = 'Vs. AI';
        modeSelect.appendChild(aiOption);

        const playerOption = document.createElement('option');
        playerOption.value = 'vsPlayer';
        playerOption.textContent = 'Vs. Player';
        modeSelect.appendChild(playerOption);

        const player2Container = document.createElement('div');
        player2Container.id = 'player2-container';

        const nameLabel2 = document.createElement('label');
        nameLabel2.textContent = 'Enter secondary player name:';
        const nameInput2 = document.createElement('input');
        nameInput2.type = 'text';
        nameInput2.id = 'userName2';
        nameInput2.name = 'userName2';
        nameInput2.placeholder = 'Player 2';

        // By default, hide this container.
        player2Container.style.display = 'none';
        player2Container.appendChild(nameLabel2);
        player2Container.appendChild(nameInput2);

        // *** NEW CODE TO HANDLE SHOWING/HIDING THE INPUT ***
        modeSelect.addEventListener('change', (event) => {
            const selectedMode = (event.target as HTMLSelectElement).value;
            if (selectedMode === 'vsPlayer') {
                player2Container.style.display = 'block'; // Show the container
                nameInput2.required = true; // Make the second name required
            } else {
                player2Container.style.display = 'none'; // Hide the container
                nameInput2.required = false; // Make the second name optional/not required
                nameInput2.value = ''; // Clear the value when hidden
            }
        });

        const startGameButton = document.createElement('button');
        startGameButton.type = 'submit';
        startGameButton.textContent = 'Start Game';

        form.appendChild(nameLabel);
        form.appendChild(nameInput);
        form.appendChild(modeLabel);
        form.appendChild(modeSelect);
        form.appendChild(player2Container);
        form.appendChild(startGameButton);

        landingPageContainer.appendChild(welcomeMessage);
        landingPageContainer.appendChild(form);

        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            this.player1 = new Player(data.userName1 as string, false);
            this.player2 = new Player(
                data.userName2 as string,
                (data.gameMode as string) === 'vsAI',
            );
            this.renderGamePage();
        });

        mainElement.appendChild(landingPageContainer);
    },

    async renderGamePage() {
        this.player1?.reset();
        this.player2?.reset();
        this.placingShips = true;
        const mainElement = document.querySelector('main');
        if (!mainElement) {
            console.error('Main element not found!');
            return;
        }

        mainElement.innerHTML = '';

        const gameContainer = document.createElement('div');
        const controlButtons = document.createElement('div');

        const player1Card = document.createElement('h1');
        const player2Card = document.createElement('h1');
        const player1GameBoard = document.createElement('div');
        player1GameBoard.classList.add('gameBoard');
        const player2GameBoard = document.createElement('div');
        player2GameBoard.classList.add('gameBoard');

        player1Card.textContent = this.player1?.name ?? null;
        player2Card.textContent = this.player2?.name ?? null;
        this.populatePlayerGameBoard(this.player1!, player1GameBoard);
        this.populatePlayerGameBoard(this.player2!, player2GameBoard);

        const player1 = document.createElement('div');
        const player2 = document.createElement('div');
        const divider = document.createElement('div');

        player1.append(player1Card, player1GameBoard);
        player2.append(player2Card, player2GameBoard);
        gameContainer.append(player1, divider, player2);

        const shipFlipButton = document.createElement('button');
        shipFlipButton.textContent = 'Flip Ship';
        shipFlipButton.addEventListener('click', () => {
            this.shipOrientation = !this.shipOrientation;
        });
        shipFlipButton.style.display = 'none';

        const restartButton = document.createElement('button');
        restartButton.textContent = 'restart game';
        restartButton.addEventListener('click', () => this.renderGamePage());

        const homeButton = document.createElement('button');
        homeButton.textContent = 'home';
        homeButton.addEventListener('click', () => this.renderLandingPage());

        controlButtons.append(shipFlipButton, restartButton, homeButton);

        mainElement.append(gameContainer, controlButtons);

        // place your ships
        const myShips = [
            // new Ship(5),
            // new Ship(4),
            // new Ship(3),
            // new Ship(3),
            // new Ship(2),
            // new Ship(2),
            new Ship(2),
        ];
        for (const ship of myShips) {
            console.log('placing ship', ship);
            let wasShipPlaced = await this.placeShip(
                this.player1!,
                player1GameBoard,
                shipFlipButton,
                ship,
            );
            while (!wasShipPlaced) {
                wasShipPlaced = await this.placeShip(
                    this.player1!,
                    player1GameBoard,
                    shipFlipButton,
                    ship,
                );
            }
        }

        if (this.player2?.isAi) {
            for (const ship of myShips)
                this.placeAiShip(this.player2, player2GameBoard, ship);
        } else {
            for (const ship of myShips) {
                console.log('placing ship', ship);
                let wasShipPlaced = await this.placeShip(
                    this.player2!,
                    player2GameBoard,
                    shipFlipButton,
                    ship,
                );
                while (!wasShipPlaced) {
                    wasShipPlaced = await this.placeShip(
                        this.player2!,
                        player2GameBoard,
                        shipFlipButton,
                        ship,
                    );
                }
            }
        }

        const tilesP1 = player1GameBoard.querySelectorAll('button');
        player1GameBoard.addEventListener('click', (event) => {
            if (event.target instanceof HTMLButtonElement) {
                const clickedTile: HTMLButtonElement = event.target;
                const tileIndex: number =
                    Array.from(tilesP1).indexOf(clickedTile);

                const R = this.player1?.gameBoard.M ?? 10;
                const C = this.player1?.gameBoard.N ?? 10;

                const x = Math.floor(tileIndex / R);
                const y = tileIndex % C;

                const hit = this.player1?.gameBoard.receiveAttack(
                    new Coordinate(x, y),
                );
                if (hit) clickedTile.classList.add('hit');
                else clickedTile.classList.add('missed');
                clickedTile.classList.add('attacked'); // TODO: improve later, jank solution for disabling clicked cells (should move to backend)
                clickedTile.disabled = true;
                if (this.player1?.gameBoard.isGameOver)
                    // game over do something
                    console.log(
                        'game over',
                        this.player2?.name == '' ? 'AI' : this.player2?.name,
                        'wins!',
                    );
            }
        });

        const tilesP2 = player2GameBoard.querySelectorAll('button');
        player2GameBoard.addEventListener('click', (event) => {
            if (event.target instanceof HTMLButtonElement) {
                const clickedTile: HTMLButtonElement = event.target;
                const tileIndex: number =
                    Array.from(tilesP2).indexOf(clickedTile);

                const R = this.player2?.gameBoard.M ?? 10;
                const C = this.player2?.gameBoard.N ?? 10;

                const x = Math.floor(tileIndex / R);
                const y = tileIndex % C;

                const hit = this.player2?.gameBoard.receiveAttack(
                    new Coordinate(x, y),
                );
                if (hit) clickedTile.classList.add('hit');
                else clickedTile.classList.add('missed');
                clickedTile.classList.add('attacked'); // TODO: improve later, jank solution for disabling clicked cells (should move to backend)
                clickedTile.disabled = true;
                if (this.player2?.gameBoard.isGameOver)
                    // game over do something
                    console.log('game over', this.player1?.name, 'wins!');
            }
        });

        let currentPlayerNum = 2;
        const p1Tiles = player1GameBoard.querySelectorAll('button');
        const p2Tiles = player2GameBoard.querySelectorAll('button');
        p1Tiles.forEach((tile) => (tile.disabled = true));
        while (
            !(
                this.player1?.gameBoard.isGameOver ||
                this.player2?.gameBoard.isGameOver
            )
        ) {
            const nextPlayer = await this.currentMove(
                currentPlayerNum,
                player1GameBoard,
                player2GameBoard,
            );
            if (nextPlayer == 1) {
                p1Tiles.forEach((tile) => {
                    if (!tile.classList.contains('attacked'))
                        tile.disabled = false;
                });
                p2Tiles.forEach((tile) => (tile.disabled = true));
            } else {
                p1Tiles.forEach((tile) => (tile.disabled = true));
                p2Tiles.forEach((tile) => {
                    if (!tile.classList.contains('attacked'))
                        tile.disabled = false;
                });
            }

            currentPlayerNum = currentPlayerNum == 2 ? 1 : 2;
        }
        p1Tiles.forEach((tile) => (tile.disabled = true));
        p2Tiles.forEach((tile) => (tile.disabled = true));
    },

    currentMove(
        playerNum: number,
        player1GameBoard: HTMLDivElement,
        player2GameBoard: HTMLDivElement,
    ) {
        return new Promise<1 | 2>((resolve) => {
            if (playerNum == 1 && this.player2?.isAi) {
                // simulate Ai move
                setTimeout(() => {
                    console.log('thinking...');
                    const R = this.player2?.gameBoard.M ?? 10;
                    const C = this.player2?.gameBoard.N ?? 10;
                    let x = Math.floor(Math.random() * R);
                    let y = Math.floor(Math.random() * C);
                    while (
                        this.player1?.gameBoard.missedShots.has(`${x},${y}`)
                    ) {
                        x = Math.floor(Math.random() * R);
                        y = Math.floor(Math.random() * C);
                    }
                    const p1Tiles = player1GameBoard.querySelectorAll('button');
                    const targetIdx = x * R + y;
                    const targetTile = p1Tiles[targetIdx];
                    targetTile.click();
                    resolve(2);
                }, 200);
            }
            const handleClick = (event: MouseEvent): void => {
                // when valid button is clicked, swap turns
                if (event.target instanceof HTMLButtonElement) {
                    if (playerNum == 1) {
                        resolve(2);
                    } else {
                        resolve(1);
                    }
                }
            };
            if (playerNum == 1)
                player1GameBoard.addEventListener('click', handleClick);
            else player2GameBoard.addEventListener('click', handleClick);
        });
    },

    placeAiShip(ai: Player, gameBoardDiv: HTMLDivElement, ship: Ship) {
        let x = Math.floor(Math.random() * (ai.gameBoard.M + 1));
        let y = Math.floor(Math.random() * (ai.gameBoard.N + 1));
        let orientation = Math.floor(Math.random() * 2) == 1;
        while (
            !ai.gameBoard.placeShip(new Coordinate(x, y), orientation, ship)
        ) {
            x = Math.floor(Math.random() * (ai.gameBoard.M + 1));
            y = Math.floor(Math.random() * (ai.gameBoard.N + 1));
            orientation = Math.floor(Math.random() * 2) == 1;
        }
        return true;
    },

    placeShip(
        player: Player,
        gameBoardDiv: HTMLDivElement,
        shipFlipButton: HTMLButtonElement,
        ship: Ship,
    ): Promise<boolean> {
        return new Promise((resolve) => {
            const tiles = gameBoardDiv.querySelectorAll('button');

            shipFlipButton.style.display = 'block';
            const handleHover = (event: MouseEvent): void => {
                // Check if the event target is a button
                if (event.target instanceof HTMLButtonElement) {
                    const hoveredTile: HTMLButtonElement = event.target;
                    const tileIndex: number =
                        Array.from(tiles).indexOf(hoveredTile);

                    const R = player.gameBoard.M;
                    const C = player.gameBoard.N;

                    const x = Math.floor(tileIndex / R);
                    const y = tileIndex % C;
                    // Remove any existing highlights before applying new ones.
                    tiles.forEach((tile: HTMLButtonElement) => {
                        tile.classList.remove('highlight');
                        tile.classList.remove('invalid');
                    });

                    // Highlight tiles for the ship's length.
                    // This logic needs to be robust for horizontal/vertical placement and board boundaries.
                    const offSet = Math.ceil(ship.len / 2) - 1;
                    let invalid = false;
                    if (
                        !(0 <= x - offSet && x - offSet + ship.len - 1 < R) &&
                        this.shipOrientation
                    ) {
                        invalid = true;
                    }
                    if (
                        !(0 <= y - offSet && y - offSet + ship.len - 1 < R) &&
                        !this.shipOrientation
                    ) {
                        invalid = true;
                    }
                    for (let i = 0; i < ship.len; i++) {
                        let overlapping = false;
                        let highlightTile: HTMLButtonElement | null = null;
                        if (
                            !this.shipOrientation &&
                            0 <= tileIndex + i - offSet &&
                            tileIndex + i - offSet < tiles.length &&
                            y + i - offSet < C &&
                            y + i - offSet >= 0
                        ) {
                            // ship is horizontal, only highlight the tiles that are within the bounds
                            highlightTile = tiles[tileIndex + i - offSet];
                            if (
                                player.gameBoard.shipCoordinates.has(
                                    `${x},${y + i - offSet}`,
                                )
                            )
                                overlapping = true;
                        } else {
                            // either ship is horizontal outside bounds, or its vertical
                            if (this.shipOrientation) {
                                // ship is vertical
                                const curIdx = tileIndex - offSet * R + i * R;
                                if (0 <= curIdx && curIdx < tiles.length) {
                                    highlightTile =
                                        tiles[tileIndex - offSet * R + i * R];
                                    if (
                                        player.gameBoard.shipCoordinates.has(
                                            `${x + i - offSet},${y}`,
                                        )
                                    )
                                        overlapping = true;
                                }
                            }
                        }
                        if (highlightTile && !invalid) {
                            highlightTile.classList.add('highlight');
                        }
                        if (highlightTile && (invalid || overlapping))
                            highlightTile.classList.add('invalid');
                    }
                }
            };

            const handleClick = (event: MouseEvent): void => {
                // Check if the event target is a button
                if (event.target instanceof HTMLButtonElement) {
                    const clickedTile: HTMLButtonElement = event.target;
                    const tileIndex: number =
                        Array.from(tiles).indexOf(clickedTile);

                    const R = player.gameBoard.M;
                    const C = player.gameBoard.N;

                    const x = Math.floor(tileIndex / R);
                    const y = tileIndex % C;

                    // player.placeShip(ship, tileIndex);
                    // or similar methods to update the game state.
                    const wasShipPlaced = player.gameBoard.placeShip(
                        new Coordinate(x, y),
                        this.shipOrientation,
                        ship,
                    );

                    // Clean up by removing the temporary event listeners.
                    gameBoardDiv.removeEventListener('mouseover', handleHover);
                    gameBoardDiv.removeEventListener('click', handleClick);

                    // Remove all highlights.
                    tiles.forEach((tile: HTMLButtonElement) => {
                        tile.classList.remove('highlight');
                        tile.classList.remove('invalid');
                    });
                    tiles.forEach((tile) => {
                        if (!tile.classList.contains('attacked'))
                            tile.disabled = false;
                    });
                    tiles.forEach((tile) => {
                        const tileIdx = Array.from(tiles).indexOf(tile);
                        const x = Math.floor(tileIdx / R);
                        const y = tileIdx % C;
                        if (
                            player.gameBoard.shipCoordinates.has(
                                new Coordinate(x, y).toString(),
                            )
                        )
                            tile.classList.add('ship');
                    });

                    shipFlipButton.style.display = 'none';

                    resolve(wasShipPlaced);
                }
            };

            gameBoardDiv.addEventListener('mouseover', handleHover);
            gameBoardDiv.addEventListener('click', handleClick);
        });
    },

    populatePlayerGameBoard(player: Player, gameBoardDiv: HTMLDivElement) {
        for (let i = 0; i < player.gameBoard.M; i++) {
            for (let j = 0; j < player.gameBoard.N; j++) {
                const cell = document.createElement('button');
                cell.name = String.fromCharCode(j + 65) + i;
                cell.textContent = String.fromCharCode(j + 65) + (i + 1);
                gameBoardDiv.appendChild(cell);
            }
        }
    },
};
