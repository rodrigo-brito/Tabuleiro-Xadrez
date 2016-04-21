jQuery(document).ready(function($){
	var board;
	/** Inicia regras de validação do Xadrez */
	var game = new Chess();
	/** Cores utilizadas para destacar casas de movimentação */
	var color_highlight_black = '#7CC041';
	var color_highlight_white = '#82E22D';

	/**
	 * Remove o realce das posições de movimentação
	 */
	var removerRealce = function() {
		$('#tabuleiro .square-55d63').css('background', '');
	};

	/**
	 * Realça as posições de movimentação com as cores configuradas no cabeçalho
	 */
	var realcarTabuleiro = function(square) {
		var posicaoTabuleiro = $('#tabuleiro .square-' + square);
		if (posicaoTabuleiro.hasClass('black-3c85d') === true) {
    		posicaoTabuleiro.css('background', color_highlight_black);
		}else{
			posicaoTabuleiro.css('background', color_highlight_white);
		}
	};

	/**
	 * Verifica se o jogo finalizou ou se é o turno da peça
	 */
	var onDragStart = function(source, piece) {
		if (game.game_over() === true ||
			(game.turn() === 'w' && piece.search(/^b/) !== -1) ||
			(game.turn() === 'b' && piece.search(/^w/) !== -1)) {
			return false;
		}
	};

	/**
	 * Valida a movimentação
	 */
	var onDrop = function(source, target) {
		removerRealce();

		// Verifica a legalidade da movimentação
		var move = game.move({
			from: source,
			to: target,
			promotion: 'q'
		});

		// Se a movimentação é ilegal, volta com a peça
		if (move === null) return 'snapback';
	};

	/**
	 * Quando o mouse sobrepoe uma dada posição no tabuleiro
	 */
	var onMouseoverSquare = function(square, piece) {
		// Recebe a lista de possibilidades de movimentação
		var moves = game.moves({
			square: square,
			verbose: true
		});

		// Quando não existe movimentações disponívels, sai da função
		if (moves.length === 0) return;

		// Realça a posição que o mouse está em cima
		realcarTabuleiro(square);

		// Realça todas as possibilidades de movimentações da peça que o mouse está em cima
		for (var i = 0; i < moves.length; i++) {
			realcarTabuleiro(moves[i].to);
		}
		console.log(moves);
	};

	// Quando o mouse sai de cima da posição, remove o realce
	var onMouseoutSquare = function(square, piece) {
		removerRealce();
	};

	/**
	 * Atualiza tabuleiro ao final da rodada
	 */
	var onSnapEnd = function() {
		board.position(game.fen());
	};

	/**
	 * Lista de configurações inicias do tabuleiro
	 */
	var cfg = {
		draggable: true,
		position: 'start',
		onDragStart: onDragStart,
		onDrop: onDrop,
		onMouseoutSquare: onMouseoutSquare,
		onMouseoverSquare: onMouseoverSquare,
		onSnapEnd: onSnapEnd
	};
	// Inicia o tabuleiro
	board = ChessBoard('tabuleiro', cfg);
});