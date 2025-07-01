jQuery(document).ready(function($) {
	
	function toggleTurn(game) {
		const fen = game.fen().split(' ');
		fen[1] = (fen[1] === 'w') ? 'b' : 'w'; // Toggle the turn
		const newFen = fen.join(' ');
		game.load(newFen);
	}
    console.log("Document is ready");

    $.get('https://lichess.org/api/puzzle/daily')
    .done(function(data) {
        console.log("Received daily puzzle data", data);

        var game = new Chess();
        var pgnData = data.game.pgn;
		console.log("PGN: " + pgnData);
        var initialPly = data.puzzle.initialPly;
		console.log("InitialPly: " + initialPly);
        var solution = data.puzzle.solution;
		console.log("Solution: " + solution);

        // Load PGN
        game.load_pgn(pgnData);
		var fen = game.fen();
        console.log("Generated FEN for daily puzzle: " + fen);


        // Current FEN should now be the starting position for the puzzle
        // Set orientation based on who is to move or user preference
        var gameOrientation = (game.turn() === 'b') ? 'black' : 'white';
        if (pluginParams.orientation && pluginParams.orientation !== 'auto') {
            gameOrientation = pluginParams.orientation;
        }
                var solutionIndex = 0
        var cfg = {
                draggable: true,
                                orientation: gameOrientation,
                position: fen,
                pieceTheme: pluginParams.pieceThemeBase + '{piece}.png',
                onDrop: function(source, target) {
					var move = game.move({ from: source, to: target, promotion: 'q' });
					console.log("Attempted move: ", move, " from ", source, " to ", target);
					// Check if the move is legal
					if (move === null) {
						return 'snapback';
					}

					// Check if the move is in the puzzle's solution
					if ((move.from + move.to) !== solution[solutionIndex]) {
						game.undo(); // undo the move in the game object, because it's not part of the solution
						return 'snapback';
					}

					// Remove this move from the solution
					solutionIndex++;

					// Make the opponent's move from the solution, if available
					if (solutionIndex < solution.length) {
						var opponentMove = solution[solutionIndex];
						game.move({ from: opponentMove.substring(0, 2), to: opponentMove.substring(2, 4), promotion: 'q' });

						// Update the board after the opponent's move
						board.position(game.fen());
						console.log("Generated FEN for daily puzzle: " + game.fen());
						// Advance the solution index again to be ready for the next player move
						solutionIndex++;
						setTimeout(function() {
						  board.position(game.fen());
						}, 100);
					}
				}

            };

        var board = ChessBoard('chessboard', cfg);
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        console.log("Request failed: " + textStatus + ", " + errorThrown);
    });
});
