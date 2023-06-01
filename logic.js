
// Sara Paguaga 20634
// Referencia(Minimax): https://www.youtube.com/watch?v=trKjYdBASyQ&t=420s&ab_channel=TheCodingTrain
// Referencia(Heuristica - Minimax optimizado): https://www.mililink.com/upload/article/279817393aams_vol_216_april_2022_a25_p3303-3313_kavita_sheoran,_et_al..pdf  

function connected(f1, f2, f3, f4) {
    return f1 != 0 && f1 == f2 && f1 == f3 && f1 == f4;
}

function validateWin(board) {
    // Chequeando filas
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 4; col++) {
        if (connected(board[row][col], board[row][col + 1], board[row][col + 2], board[row][col + 3])) {
          return board[row][col];
        }
      }
    }
  
    // Chequeando columnas
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 7; col++) {
        if (connected(board[row][col], board[row + 1][col], board[row + 2][col], board[row + 3][col])) {
          return board[row][col];
        }
      }
    }
  
    // Chequeando diagonales /
    for (let row = 3; row < 6; row++) {
      for (let col = 0; col < 4; col++) {
        if (connected(board[row][col], board[row - 1][col + 1], board[row - 2][col + 2], board[row - 3][col + 3])) {
          return board[row][col];
        }
      }
    }
  
    // Chequeando diagonales \
    for (let row = 3; row < 6; row++) {
      for (let col = 3; col < 7; col++) {
        if (connected(board[row][col], board[row - 1][col - 1], board[row - 2][col - 2], board[row - 3][col - 3])) {
          return board[row][col];
        }
      }
    }
  
    // Chequeando si hay espacios vacios
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 7; col++) {
        if (board[row][col] == 0) {
          return 'emptySpot';
        }
      }
    }
  
    // Si no hay ganador y no hay espacios vacios, es un empate
    return 'tie';
}
  
const scores_c4 = (playerTurnID) => {
    if (playerTurnID === 1){
        return { 1: 1, 2: -1, tie: 0 };
    }else {
        return { 1: -1, 2: 1, tie: 0 };
    }
}

function consecutiveCount(board, playerTurnID) {
    let twoInRow = 0;
    let threeInRow = 0;

    // Cuenta las fichas en linea horizontal
    for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 5; col++) {
            if (board[row][col] == playerTurnID && board[row][col + 1] == playerTurnID) {
                twoInRow++;
            }
            if (board[row][col] == playerTurnID && board[row][col + 1] == playerTurnID && board[row][col + 2] == playerTurnID) {
                threeInRow++;
            }
        }
    }

    // Cuenta las fichas en linea vertical
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 7; col++) {
            if (board[row][col] == playerTurnID && board[row + 1][col] == playerTurnID) {
                twoInRow++;
            }
            if (board[row][col] == playerTurnID && board[row + 1][col] == playerTurnID && board[row + 2][col] == playerTurnID) {
                threeInRow++;
            }
        }
    }

    // Cuenta las fichas en linea diagonal /
    for (let row = 2; row < 6; row++) {
        for (let col = 0; col < 5; col++) {
            if (board[row][col] == playerTurnID && board[row - 1][col + 1] == playerTurnID) {
                twoInRow++;
            }
            if (board[row][col] == playerTurnID && board[row -1][col + 1] == playerTurnID && board[row - 2][col + 2] == playerTurnID) {
                threeInRow++;
            }
        }
    }

    // Cuenta las fichas en linea diagonal \
    for (let row = 2; row < 6; row++) {
        for (let col = 2; col < 7; col++) {
            if (board[row][col] == playerTurnID && board[row - 1][col - 1] == playerTurnID) {
                twoInRow++;
            }
            if(board[row][col] == playerTurnID && board[row - 1][col - 1] == playerTurnID && board[row - 2][col - 2]) {
                threeInRow++;
            }
        }
    }

    return { threeInRow, twoInRow };
}


function assignHeuristic(board, playerTurnID) {
    let opponentID = (playerTurnID == 1) ? 2 : 1;
    
    let aiConsecutive = consecutiveCount(board, playerTurnID);
    let opponentConsecutive = consecutiveCount(board, opponentID);

    let score = aiConsecutive.twoInRow * 3 + aiConsecutive.threeInRow * 9 
                - opponentConsecutive.twoInRow * 3 - opponentConsecutive.threeInRow * 9;

    return score;
}



function minimax(board, depth, alpha, beta, isMaximizing, playerTurnID){ 

    let res = validateWin(board);
    if (res !== 'emptySpot'){
        return scores_c4(playerTurnID)[res];
    }

    if (depth >= 4) {
        return assignHeuristic(board, playerTurnID);
    }

    if (isMaximizing){
        let bestScore = -Infinity;
        for (let i = 0; i < 7; i++){
            // Chequeando si hay espacio disponible en la columna
            let row = checkAvailability(board, i);
            if (row != -1){
                // Board temporal para probar opciones con minimax
                let temp_board = JSON.parse(JSON.stringify(board));
                temp_board[row][i] = playerTurnID;

                // Definiendo score con minimax
                let minMaxScore = minimax(temp_board, depth+1, alpha, beta, false, playerTurnID);
                bestScore = (minMaxScore > bestScore) ? minMaxScore : bestScore;

                alpha = Math.max(alpha, minMaxScore);
                if (beta <= alpha) {
                    break;
                }
            }
        }
        return bestScore;
    }
    else{
        let bestScore = Infinity;
        for (let i = 0; i < 7; i++){
            // Chequeando si hay espacio disponible en la columna
            let row = checkAvailability(board, i);
            if (row != -1){
                // Board temporal para probar opciones con minimax
                let temp_board = JSON.parse(JSON.stringify(board));
                let oponentID = (playerTurnID == 1) ? 2 : 1;

                // Definiendo score con minimax
                temp_board[row][i] = oponentID;
                let minMaxScore = minimax(temp_board, depth+1, alpha, beta, true, playerTurnID);
                bestScore = (minMaxScore < bestScore) ? minMaxScore : bestScore;

                beta = Math.min(beta, minMaxScore);
                if (beta <= alpha) {
                    break;
                }
            }
        }
        return bestScore;
    }
}


function checkAvailability(board, col) {
    for (let i = 5; i >= 0; i--) {
        if (board[i][col] == 0) {
            return i;
        }
    }
    return -1;
}


function bestMove_connect4(board, playerTurnID) {
    
    let bestScore = -Infinity;
    let bestMove;
    let alpha = -Infinity;
    let beta = Infinity;

    for (let i = 0; i < 7; i++){
        // Chequeando si hay espacio disponible en la columna
        let row = checkAvailability(board, i);
        if (row != -1){
            // Board temporal para probar opciones con minimax
            let temp_board = JSON.parse(JSON.stringify(board));
            temp_board[row][i] = playerTurnID;
            let score = minimax(temp_board, 0, alpha, beta, false, playerTurnID);

            if (score > bestScore){
                bestScore = score;
                bestMove = i;
            }
        }
    }
    return bestMove;
}

module.exports = {
    bestMove_connect4
};
  
