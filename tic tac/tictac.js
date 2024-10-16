"use strict";

(() => {
  window.addEventListener("load", () => {
    const canvas = document.querySelector("#gameCanvas");
    const ctx = canvas.getContext("2d");

    const restartButton = document.querySelector("#restart");
    const currentPlayerText = document.querySelector("#current-player");
    const scoreboard = document.querySelector("#scoreboard");

    const CELLS_PER_AXIS = 3;
    const CELL_SIZE = canvas.width / CELLS_PER_AXIS;

    let grid, currentPlayer, gameOver;
    let player1Score = 0, player2Score = 0;

    const PLAYERS = {
      Player1: { symbol: "X", name: "X" },
      Player2: { symbol: "O", name: "O" }
    };

    function initGame() {
      grid = Array(CELLS_PER_AXIS * CELLS_PER_AXIS).fill(null);
      currentPlayer = "Player1";
      gameOver = false;
      updateUI();
      render();
    }

    function updateUI() {
      currentPlayerText.textContent = PLAYERS[currentPlayer].name;
      scoreboard.textContent = `X: ${player1Score} | O: ${player2Score}`;
    }

    function render() {
      clearCanvas();
      drawGridLines();
      drawGridCells();
    }

    function clearCanvas() {
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function drawGridLines() {
      ctx.strokeStyle = "black";
      ctx.lineWidth = 2;
      for (let i = 1; i < CELLS_PER_AXIS; i++) {
        ctx.beginPath();
        ctx.moveTo(i * CELL_SIZE, 0);
        ctx.lineTo(i * CELL_SIZE, canvas.height);
        ctx.stroke();
        ctx.moveTo(0, i * CELL_SIZE);
        ctx.lineTo(canvas.width, i * CELL_SIZE);
        ctx.stroke();
      }
    }

    function drawGridCells() {
      grid.forEach((cell, index) => {
        if (cell) {
          const x = (index % CELLS_PER_AXIS) * CELL_SIZE;
          const y = Math.floor(index / CELLS_PER_AXIS) * CELL_SIZE;
          ctx.fillStyle = "black";
          ctx.font = "50px Arial";
          ctx.fillText(cell, x + CELL_SIZE / 3, y + 2 * CELL_SIZE / 3);
        }
      });
    }

    function handleMove(event) {
      if (gameOver) return;

      const { row, col } = getGridCoordinates(event.offsetX, event.offsetY);
      const index = row * CELLS_PER_AXIS + col;

      if (!grid[index]) {
        grid[index] = PLAYERS[currentPlayer].symbol;
        processTurn();
      }
    }

    function getGridCoordinates(x, y) {
      return { row: Math.floor(y / CELL_SIZE), col: Math.floor(x / CELL_SIZE) };
    }

    function processTurn() {
      if (checkWin()) {
        gameOver = true;
        currentPlayerText.textContent = `${PLAYERS[currentPlayer].name} Wins!`;
        updateScores();
      } else if (checkDraw()) {
        gameOver = true;
        currentPlayerText.textContent = "It's a Draw!";
      } else {
        switchPlayer();
        render();
        updateUI();
      }
    }

    function switchPlayer() {
      currentPlayer = currentPlayer === "Player1" ? "Player2" : "Player1";
    }

    function checkDraw() {
      return grid.every(cell => cell !== null);
    }

    function checkWin() {
      const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
      ];

      return winPatterns.some(pattern => {
        const [a, b, c] = pattern;
        if (grid[a] && grid[a] === grid[b] && grid[a] === grid[c]) {
          return true;
        }
        return false;
      });
    }

    function updateScores() {
      if (currentPlayer === "Player1") {
        player1Score++;
      } else {
        player2Score++;
      }
      updateUI();
    }

    canvas.addEventListener("mousedown", handleMove);
    restartButton.addEventListener("click", initGame);

    initGame();
  });
})();
