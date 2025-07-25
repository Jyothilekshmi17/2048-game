
        let board = [];
        let score = 0;
        let hasWon = false;
        
        // Initialize the game
        function initGame() {
            // Create 4x4 grid
            for (let i = 0; i < 4; i++) {
                board[i] = [0, 0, 0, 0];
            }
            
            // Create grid cells
            const grid = document.getElementById('grid');
            grid.innerHTML = '';
            for (let i = 0; i < 16; i++) {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                grid.appendChild(cell);
            }
            
            // Add initial tiles
            addNewTile();
            addNewTile();
            updateDisplay();
            updateScore();
        }
        
        function updateDisplay() {
            const grid = document.getElementById('grid');
            // Remove existing tiles
            const existingTiles = grid.querySelectorAll('.tile');
            existingTiles.forEach(tile => tile.remove());
            
            // Add tiles for current board state
            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 4; j++) {
                    if (board[i][j] !== 0) {
                        const tile = document.createElement('div');
                        tile.className = `tile tile-${board[i][j]}`;
                        tile.textContent = board[i][j];
                        
                        // Calculate precise position
                        const x = j * 95; // 80px tile + 15px gap
                        const y = i * 95; // 80px tile + 15px gap
                        
                        tile.style.left = `${x}px`;
                        tile.style.top = `${y}px`;
                        
                        grid.appendChild(tile);
                    }
                }
            }
        }
        
        function addNewTile() {
            const emptyCells = [];
            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 4; j++) {
                    if (board[i][j] === 0) {
                        emptyCells.push({row: i, col: j});
                    }
                }
            }
            
            if (emptyCells.length > 0) {
                const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
                board[randomCell.row][randomCell.col] = Math.random() < 0.9 ? 2 : 4;
                
                // Mark as new tile for animation
                setTimeout(() => {
                    const grid = document.getElementById('grid');
                    const newTile = grid.querySelector(`[style*="left: ${randomCell.col * 95}px"][style*="top: ${randomCell.row * 95}px"]`);
                    if (newTile) {
                        newTile.classList.add('tile-new');
                    }
                }, 50);
            }
        }
        
        function updateScore() {
            document.getElementById('score').textContent = score;
            const bestScore = localStorage.getItem('best2048') || 0;
            if (score > bestScore) {
                localStorage.setItem('best2048', score);
            }
            document.getElementById('best').textContent = Math.max(score, bestScore);
        }
        
        function moveLeft() {
            let moved = false;
            let mergedPositions = [];
            let newBoard = JSON.parse(JSON.stringify(board));
            
            for (let i = 0; i < 4; i++) {
                let row = newBoard[i];
                let filteredRow = row.filter(val => val !== 0);
                
                // Merge adjacent same tiles
                for (let j = 0; j < filteredRow.length - 1; j++) {
                    if (filteredRow[j] === filteredRow[j + 1]) {
                        filteredRow[j] *= 2;
                        score += filteredRow[j];
                        filteredRow[j + 1] = 0;
                        mergedPositions.push({row: i, col: j});
                        
                        if (filteredRow[j] === 2048 && !hasWon) {
                            hasWon = true;
                            setTimeout(() => {
                                document.getElementById('game-won').classList.add('show');
                            }, 300);
                        }
                    }
                }
                
                filteredRow = filteredRow.filter(val => val !== 0);
                while (filteredRow.length < 4) {
                    filteredRow.push(0);
                }
                
                for (let j = 0; j < 4; j++) {
                    if (board[i][j] !== filteredRow[j]) {
                        moved = true;
                    }
                }
                
                newBoard[i] = filteredRow;
            }
            
            if (moved) {
                board = newBoard;
                updateDisplay();
                
                // Add merge animation
                setTimeout(() => {
                    mergedPositions.forEach(pos => {
                        const grid = document.getElementById('grid');
                        const tile = grid.querySelector(`[style*="left: ${pos.col * 95}px"][style*="top: ${pos.row * 95}px"]`);
                        if (tile) {
                            tile.classList.add('tile-merged');
                        }
                    });
                }, 50);
                
                setTimeout(() => {
                    addNewTile();
                    updateDisplay();
                    updateScore();
                    
                    if (isGameOver()) {
                        setTimeout(() => {
                            document.getElementById('game-over').classList.add('show');
                        }, 300);
                    }
                }, 150);
            }
        }
        
        function moveRight() {
            let moved = false;
            let mergedPositions = [];
            let newBoard = JSON.parse(JSON.stringify(board));
            
            for (let i = 0; i < 4; i++) {
                let row = newBoard[i];
                let filteredRow = row.filter(val => val !== 0);
                
                for (let j = filteredRow.length - 1; j > 0; j--) {
                    if (filteredRow[j] === filteredRow[j - 1]) {
                        filteredRow[j] *= 2;
                        score += filteredRow[j];
                        filteredRow[j - 1] = 0;
                        mergedPositions.push({row: i, col: 4 - (filteredRow.length - j)});
                        
                        if (filteredRow[j] === 2048 && !hasWon) {
                            hasWon = true;
                            setTimeout(() => {
                                document.getElementById('game-won').classList.add('show');
                            }, 300);
                        }
                    }
                }
                
                filteredRow = filteredRow.filter(val => val !== 0);
                while (filteredRow.length < 4) {
                    filteredRow.unshift(0);
                }
                
                for (let j = 0; j < 4; j++) {
                    if (board[i][j] !== filteredRow[j]) {
                        moved = true;
                    }
                }
                
                newBoard[i] = filteredRow;
            }
            
            if (moved) {
                board = newBoard;
                updateDisplay();
                
                setTimeout(() => {
                    mergedPositions.forEach(pos => {
                        const grid = document.getElementById('grid');
                        const tile = grid.querySelector(`[style*="left: ${pos.col * 95}px"][style*="top: ${pos.row * 95}px"]`);
                        if (tile) {
                            tile.classList.add('tile-merged');
                        }
                    });
                }, 50);
                
                setTimeout(() => {
                    addNewTile();
                    updateDisplay();
                    updateScore();
                    
                    if (isGameOver()) {
                        setTimeout(() => {
                            document.getElementById('game-over').classList.add('show');
                        }, 300);
                    }
                }, 150);
            }
        }
        
        function moveUp() {
            let moved = false;
            let mergedPositions = [];
            let newBoard = JSON.parse(JSON.stringify(board));
            
            for (let j = 0; j < 4; j++) {
                let column = [];
                for (let i = 0; i < 4; i++) {
                    column.push(newBoard[i][j]);
                }
                
                let filteredColumn = column.filter(val => val !== 0);
                
                for (let i = 0; i < filteredColumn.length - 1; i++) {
                    if (filteredColumn[i] === filteredColumn[i + 1]) {
                        filteredColumn[i] *= 2;
                        score += filteredColumn[i];
                        filteredColumn[i + 1] = 0;
                        mergedPositions.push({row: i, col: j});
                        
                        if (filteredColumn[i] === 2048 && !hasWon) {
                            hasWon = true;
                            setTimeout(() => {
                                document.getElementById('game-won').classList.add('show');
                            }, 300);
                        }
                    }
                }
                
                filteredColumn = filteredColumn.filter(val => val !== 0);
                while (filteredColumn.length < 4) {
                    filteredColumn.push(0);
                }
                
                for (let i = 0; i < 4; i++) {
                    if (board[i][j] !== filteredColumn[i]) {
                        moved = true;
                    }
                    newBoard[i][j] = filteredColumn[i];
                }
            }
            
            if (moved) {
                board = newBoard;
                updateDisplay();
                
                setTimeout(() => {
                    mergedPositions.forEach(pos => {
                        const grid = document.getElementById('grid');
                        const tile = grid.querySelector(`[style*="left: ${pos.col * 95}px"][style*="top: ${pos.row * 95}px"]`);
                        if (tile) {
                            tile.classList.add('tile-merged');
                        }
                    });
                }, 50);
                
                setTimeout(() => {
                    addNewTile();
                    updateDisplay();
                    updateScore();
                    
                    if (isGameOver()) {
                        setTimeout(() => {
                            document.getElementById('game-over').classList.add('show');
                        }, 300);
                    }
                }, 150);
            }
        }
        
        function moveDown() {
            let moved = false;
            let mergedPositions = [];
            let newBoard = JSON.parse(JSON.stringify(board));
            
            for (let j = 0; j < 4; j++) {
                let column = [];
                for (let i = 0; i < 4; i++) {
                    column.push(newBoard[i][j]);
                }
                
                let filteredColumn = column.filter(val => val !== 0);
                
                for (let i = filteredColumn.length - 1; i > 0; i--) {
                    if (filteredColumn[i] === filteredColumn[i - 1]) {
                        filteredColumn[i] *= 2;
                        score += filteredColumn[i];
                        filteredColumn[i - 1] = 0;
                        mergedPositions.push({row: 4 - (filteredColumn.length - i), col: j});
                        
                        if (filteredColumn[i] === 2048 && !hasWon) {
                            hasWon = true;
                            setTimeout(() => {
                                document.getElementById('game-won').classList.add('show');
                            }, 300);
                        }
                    }
                }
                
                filteredColumn = filteredColumn.filter(val => val !== 0);
                while (filteredColumn.length < 4) {
                    filteredColumn.unshift(0);
                }
                
                for (let i = 0; i < 4; i++) {
                    if (board[i][j] !== filteredColumn[i]) {
                        moved = true;
                    }
                    newBoard[i][j] = filteredColumn[i];
                }
            }
            
            if (moved) {
                board = newBoard;
                updateDisplay();
                
                setTimeout(() => {
                    mergedPositions.forEach(pos => {
                        const grid = document.getElementById('grid');
                        const tile = grid.querySelector(`[style*="left: ${pos.col * 95}px"][style*="top: ${pos.row * 95}px"]`);
                        if (tile) {
                            tile.classList.add('tile-merged');
                        }
                    });
                }, 50);
                
                setTimeout(() => {
                    addNewTile();
                    updateDisplay();
                    updateScore();
                    
                    if (isGameOver()) {
                        setTimeout(() => {
                            document.getElementById('game-over').classList.add('show');
                        }, 300);
                    }
                }, 150);
            }
        }
        
        function isGameOver() {
            // Check for empty cells
            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 4; j++) {
                    if (board[i][j] === 0) return false;
                }
            }
            
            // Check for possible merges
            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 4; j++) {
                    const current = board[i][j];
                    if ((j < 3 && board[i][j + 1] === current) || 
                        (i < 3 && board[i + 1][j] === current)) {
                        return false;
                    }
                }
            }
            
            return true;
        }
        
        function newGame() {
            board = [];
            score = 0;
            hasWon = false;
            document.getElementById('game-over').classList.remove('show');
            document.getElementById('game-won').classList.remove('show');
            initGame();
        }
        
        // Event listeners
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    moveLeft();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    moveRight();
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    moveUp();
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    moveDown();
                    break;
            }
        });
        
        // Touch support for mobile
        let startX, startY;
        
        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            e.preventDefault();
        });
        
        document.addEventListener('touchend', (e) => {
            if (!startX || !startY) return;
            
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            
            const diffX = startX - endX;
            const diffY = startY - endY;
            
            if (Math.abs(diffX) > Math.abs(diffY)) {
                if (diffX > 30) moveLeft();
                else if (diffX < -30) moveRight();
            } else {
                if (diffY > 30) moveUp();
                else if (diffY < -30) moveDown();
            }
            
            startX = null;
            startY = null;
            e.preventDefault();
        });
        
        // Load best score and start game
        document.getElementById('best').textContent = localStorage.getItem('best2048') || 0;
        initGame();
  