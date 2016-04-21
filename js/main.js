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
	 * Adiciona mensagem de movimentação, cheque ou chequemate
	 * @param  {String} jogador  Nome do Jogador ou Cor
	 * @param  {String} classe   Classe da mensagem (info,danger,warning)
	 * @param  {String} mensagem Mensagem a ser exibida
	 */
	 var adicionarAlerta = function(jogador, classe, mensagem){
	 	var alerta = '<div class="alert alert-'+classe+'"><strong>'+jogador+': </strong>'+mensagem+'</div>';
	 	$("#alertas").prepend(alerta);
	 }

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

		imprimirMovimentacao( move );//Aidicona alerta de movimentação
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
	 * Retorna o nome da peça a partir de sua abreviação
	 */
	var getNomePeca = function( abreviacao ){
		switch(abreviacao) {
			case 'p':
				return 'Peão'
			case 'k':
				return 'Rei'
			case 'b':
				return 'Bispo'
			case 'q':
				return 'Rainha'
			case 'r':
				return 'Torre'
			case 'n':
				return 'Cavalo'
			default:
				return 'Peça'
		}
	}

	/**
	 * Imprimir Movimentação
	 */
	var imprimirMovimentacao = function( movimentacao ){
		var jogador = movimentacao.color == 'w' ? 'Branco' : 'Preto';
		if ( !game.game_over() ) {
			adicionarAlerta( jogador ,'info', getNomePeca( movimentacao.piece )+' '+movimentacao.from+' para '+movimentacao.to);
			if( game.in_check() ){ //Verifica se jogador está em cheque
				adicionarAlerta( jogador ,'warning', 'Cheque!' );
			}
		}else{
			//Emite mensagens de fim de jogo
			if( game.in_checkmate() ){
				adicionarAlerta( jogador, 'danger', 'Cheque Mate!' );
			}
			adicionarAlerta('Partida','danger','Fim de jogo!');
		}
	};

	/**
	 * Trata lógica de negócio por iteração
	 */
	 var randGame = function(){
	 	if (!game.game_over()) {

			var moves = game.moves(); //Recebe as possibilidades de movimentação
			var move = moves[Math.floor(Math.random() * moves.length)];//Seleciona um movimento aleatorio
			var movimentacao_result = game.move(move); //Movimenta peça

			board.position(game.fen()); //Atualiza Tabuleiro
			imprimirMovimentacao( movimentacao_result );//Aidicona alerta de movimentação

			//Aciona nova jogada randômica em 1 segundo
			setTimeout(randGame, 1000);
		}
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

	/**
	 * Inicia jogo randômico
	 */
	$('.btn-rand-game').click(function(event) {
		setTimeout(randGame, 1000);
	});
});