
// Sara Paguaga 20634

const { bestMove_connect4 } = require('./logic');

const io = require('socket.io-client');
const socket = io('http://localhost:4000');

tournamentID = "142857"


socket.on('connect', ()=>{
  console.log("Conectad@ al servidor");
    socket.emit('signin', {
      user_name: "Sara",
      tournament_id: "142857",
      user_role: 'player'
    });
});


socket.on('ok_signin', ()=>{
    console.log("Has ingresado correctamente!");
  });


socket.on('ready', (data)=>{
    var gameID = data.game_id;
    var playerTurnID = data.player_turn_id;
    var board = data.board;
    var c4_move = bestMove_connect4(board, playerTurnID);

    console.log("Move: " + c4_move + " player: " + playerTurnID);    
    console.log(board);
    console.log("")

    
    socket.emit('play', {
      tournament_id:tournamentID,
      player_turn_id: data.player_turn_id,
      game_id: data.game_id,
      movement:  c4_move
    })
  })


  socket.on('finish', (data)=>{
    var gameID = data.game_id;
    var playerTurnID = data.player_turn_id;
    var winnerTurnID = data.winner_turn_id;
    var board = data.board;
    
    console.log("Winner:", winnerTurnID);
    console.log(board);
    console.log("Juego terminado");
    
    socket.emit('player_ready', {
      tournament_id: tournamentID,
      player_turn_id: playerTurnID,
      game_id: gameID
    });
  });

socket.on('disconnect', ()=>{
    console.log("Desconectado del servidor");
  }
);

socket.on('error', (error_info)=>{
    console.log("Error: " + error_info);
  }
);

