jQuery(document).ready(function($) {
    var board;
    var game = new Chess();
    var selected = null;
    var solution = [];
    var solutionIndex = 0;

    function attachClickHandlers() {
        $('#chessboard .square-55d63').off('click').on('click', function() {
            var square = $(this).data('square');
            if (!selected) {
                selected = square;
                $(this).addClass('selected-square');
                return;
            }
            var move = game.move({ from: selected, to: square, promotion: 'q' });
            $('.square-55d63').removeClass('selected-square');
            selected = null;
            if (move === null) {
                return;
            }
            handleSolution(move);
        });
    }

    function handleSolution(move) {
        if (solution.length) {
            if ((move.from + move.to) !== solution[solutionIndex]) {
                game.undo();
                board.position(game.fen());
                attachClickHandlers();
                return;
            }
            solutionIndex++;
            if (solutionIndex < solution.length) {
                var opp = solution[solutionIndex];
                game.move({ from: opp.substring(0,2), to: opp.substring(2,4), promotion: 'q' });
                solutionIndex++;
            }
        }
        board.position(game.fen());
        attachClickHandlers();
    }

    function initBoard() {
        var orientation = (game.turn() === 'b') ? 'black' : 'white';
        if (pluginParams.orientation && pluginParams.orientation !== 'auto') {
            orientation = pluginParams.orientation;
        }
        var cfg = {
            draggable: true,
            orientation: orientation,
            position: game.fen(),
            pieceTheme: pluginParams.pieceThemeBase + '{piece}.png',
            onDrop: function(src, tgt) {
                var move = game.move({ from: src, to: tgt, promotion: 'q' });
                if (move === null) return 'snapback';
                return handleDragSolution(move);
            }
        };
        board = ChessBoard('chessboard', cfg);
        attachClickHandlers();
    }

    function handleDragSolution(move) {
        if (solution.length) {
            if ((move.from + move.to) !== solution[solutionIndex]) {
                game.undo();
                return 'snapback';
            }
            solutionIndex++;
            if (solutionIndex < solution.length) {
                var opp = solution[solutionIndex];
                game.move({ from: opp.substring(0,2), to: opp.substring(2,4), promotion: 'q' });
                board.position(game.fen());
                solutionIndex++;
                attachClickHandlers();
            }
        }
        board.position(game.fen());
        attachClickHandlers();
    }

    // Custom content
    if (pluginParams.pgn) {
        game.load_pgn(pluginParams.pgn);
    } else if (pluginParams.fen) {
        game.load(pluginParams.fen);
    }
    if (pluginParams.moves) {
        solution = pluginParams.moves.split(',');
    }

    if (!pluginParams.pgn && !pluginParams.fen && !pluginParams.moves) {
        $.get('https://lichess.org/api/puzzle/daily').done(function(data) {
            game.load_pgn(data.game.pgn);
            solution = data.puzzle.solution;
            initBoard();
        }).fail(function() {
            initBoard();
        });
    } else {
        initBoard();
    }
});
