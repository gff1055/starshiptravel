var canvas, contextoRenderizacao,	// Variaveis usadas no canvas e renderizacao
larguraJanela = inicializa()["largura"],	// Recebe a largura da janela do jogo
alturaJanela = inicializa()["altura"],	// Recebe a altura da janela do jogo
frames = 0,
velocidadeDesvio = 25,	// Velocidade da nave para os lados
estadoJogo,
estado =	{
				aIniciar: 0,
				rodando: 1,
				terminou: 2
			},

// Objeto que representa a nave
nave =	{
			x: 50,	// Posicao horizontal da nave na area de jogo
			y: alturaJanela/2 - 25,	// Posicao vertical da nave na area do jogo
			altura: 50,	// Altura da nave
			largura: 50,	// Largura da nave
			cor: "#009900",	// Cor da nave

			// Metodo para desenhar a nave
			desenha:	function(){
							contextoRenderizacao.fillStyle = this.cor;	// Definindo a cor da nave
							contextoRenderizacao.fillRect(this.x, this.y, this.altura, this.largura);	// Desenhando a nave
						},

			atualiza:	function(){
							
						},
			
			colidiu:	function(m){
				var colisaoEmY = false;
				var colisaoEmX = false;

				var x0, xF, y0, yF;
				var mx0, mxF, my0, myF;

				x0 = this.x;
				xF = this.x + this.largura;
				y0 = this.y;
				yF = this.y + this.altura

				mx0 = m.x;
				mxF = m.x + m.largura;
				my0 = m.y;
				myF = m.y + m.altura;

				if((xF >= mx0 && xF <= mxF) || (x0 >= mx0 && x0 <= mxF))
					colisaoEmY = true;
				/*else if(this.x >= m.x && this.x <= m.x + m.largura)
					colisaoEmY = true;*/
				
				if((yF >= my0 && yF <= myF) || (y0 >= my0 && y0 <= myF))
					colisaoEmX = true;

/*				if(this.y + this.altura >= m.y && this.y + this.altura <= m.y + m.altura)
					colisaoEmX = true;
				else if(this.y >= m.y && this.y <= m.y + m.altura)
					colisaoEmX = true;*/
				
				return colisaoEmY * colisaoEmX;
				
				
				
			}
			
		},

areaPlacar =	{
					x: 0,
					y: 0,
					largura: larguraJanela,
					altura: 100,

					desenha:	function(){
									contextoRenderizacao.fillStyle = "blue";
									contextoRenderizacao.fillRect(this.x, this.y, larguraJanela, this.altura,);
								}
				},

// Objeto que representa os meteoritos
arrMeteoritos = 	{
						meteoritos: [],	// Array onde fica os meteoritos
						paletaCores: ["#555555","#777777","#333333","#999999","#111111"],	// Cor que os meteoritos tem
						velocidadeMeteorito: 3,
						tempoChegaMeteorito: 0,

						// Insere os meteoritos no jogo
						insere:	function(){
									// Inserindo um meteorito
									this.meteoritos.push(	{
																x:larguraJanela,	// Posicao horizontal do meteorito
																y:100 + Math.floor((alturaJanela - 150)*Math.random()),	// Posicao vertical do meteorito
																largura: 50,	// Largura do meteorito
																altura: 50,	// Altura do meteorito
																cor: this.paletaCores[Math.floor(5 * Math.random())],	// Cor do meteorito
															}
									);
									this.tempoChegaMeteorito = 30;
								},

						// Metodo para desenhar o meteorito
						desenha:	function(){
										// Percorrendo o array de meteoritos
										for(var i=0, tam = this.meteoritos.length; i<tam; i++){
											contextoRenderizacao.fillStyle = this.meteoritos[i].cor;	// Recebendo a cor definida
											// Desenhando o meteorio
											contextoRenderizacao.fillRect(
												this.meteoritos[i].x,
												this.meteoritos[i].y,
												this.meteoritos[i].largura,
												this.meteoritos[i].altura
											);
										}
									},

						atualiza:	function(){
										for(var i = 0, tam = this.meteoritos.length; i < tam; i++){
											this.meteoritos[i].x = this.meteoritos[i].x - this.velocidadeMeteorito;
											

											
											if(this.meteoritos[i].x <= -this.meteoritos[i].largura){
												this.meteoritos.splice(i,1);
												tam--;
												i--;
											}
										}
										if(this.tempoChegaMeteorito == 0)
											this.insere();
										else
											this.tempoChegaMeteorito--;
									}
						
};

function colisaoEmY(blocoA, blocoB){
	if (blocoA.x+blocoA.largura>=)
}

// Funcao para inicializar as dimensoes de execucao do jogo
function inicializa(){
	var dimensao = [];	// Array que armazena as dimensoes do jogo
	dimensao["largura"] = window.innerWidth;	// Pega a largura da janela do usuario
	dimensao["altura"] = window.innerHeight;	// Pega a altura da janela do usuario
	
	// Seta a area de execucao do jogo
	if(dimensao["largura"]>=600){
		dimensao["largura"] = 600;
		dimensao["altura"] = 600;
	}

	return dimensao;
}

// Funcao que recebe os comandos do teclado e os envia para o jogo
function teclado(){
	if(estadoJogo == estado.rodando){
		// Condicional no caso da tecla "seta para cima" ser pressionada
		if(event.key == "ArrowUp"){
			if(nave.y == areaPlacar.altura)
				nave.y = areaPlacar.altura;
			else
				nave.y = nave.y-velocidadeDesvio;
		}

		// Condicional no caso da tecla "seta para baixo" ser pressionada
		else if (event.key == "ArrowDown"){
			if(nave.y + nave.altura == alturaJanela)
				nave.y = alturaJanela - nave.altura;
			else
				nave.y = nave.y+velocidadeDesvio;
		}
		
	}
	
	else if(estadoJogo == estado.aIniciar && event.key == "Enter")
		estadoJogo = estado.rodando;

	else if(estadoJogo == estado.terminou && event.key == "Enter")
		estadoJogo = estado.aIniciar;
		
}


// Metodo para executar o jogo
function roda(){
	atualiza();	// atualiza os caracteres do jogo
	desenha();	// Desenha os caracteres do jogo
	window.requestAnimationFrame(roda);	// Reexecuta a funcao roda indefinidamente
}

// Metodo para atualizar o jogo
function atualiza(){
	frames++;
	if(estadoJogo == estado.rodando)
		arrMeteoritos.atualiza();
}

// Funcao para desenhar os componentes do jogo
function desenha(){
	contextoRenderizacao.fillStyle = '#06004c';	// Definindo a cor de fundo do jogo
	contextoRenderizacao.fillRect(0, 0, larguraJanela, alturaJanela);	// Desenhamdo o fundo do jogo (o espaço)

	if(estadoJogo == estado.aIniciar){
		contextoRenderizacao.fillStyle = 'green';
		contextoRenderizacao.fillRect(larguraJanela/2-50, alturaJanela/2-50, 100, 100);
	}

	else if(estadoJogo == estado.rodando)
		arrMeteoritos.desenha();	// Desenhando os meteoritos
	
	else if(estadoJogo == estado.terminou){
		contextoRenderizacao.fillStyle = 'red';
		contextoRenderizacao.fillRect(larguraJanela/2+50, alturaJanela/2+50, 100, 100 );
	}

	areaPlacar.desenha();
	nave.desenha();	// Desenhando a nave
}

// Executa os metodos principais do jogo
function main(){
	areaDeJogo = document.getElementById("areaDeJogo");	// recebe o elemento canvas associado ao id "areaDeJogo"
	areaDeJogo.width = larguraJanela;	// atribui a largura setada anteriormente na canvas do jogo
	areaDeJogo.height = alturaJanela;	// atribui a altura setada anteriormente na canvas do jogo
	areaDeJogo.style.border = "1px solid #000";	// Seta a borda do elemento canvas
	contextoRenderizacao = areaDeJogo.getContext("2d");	// Contexto de renderização é 2D
	estadoJogo = estado.aIniciar;
	document.addEventListener("keydown", teclado);	// Associa a funcao teclado ao evento de pressionamento do teclado "keydown"
		
	roda();	// Executa o jogo
}

// Funcao principal
main();