var canvas, contextoRenderizacao,	// Variaveis usadas no canvas e renderizacao
larguraJanela = inicializa()["largura"],	// Recebe a largura da janela do jogo
alturaJanela = inicializa()["altura"],	// Recebe a altura da janela do jogo
frames = 0,
estadoJogo,	// Armazena o estado atual do jogo

// Estados do jogo
estado = {
	aIniciar: 0,	// O jogo esta pronto para iniciar
	rodando: 1,	// O jogo esta executando
	terminou: 2	// O jogo terminou
},

// Objeto que representa a nave
nave = {
	x: 50,	// Posicao horizontal da nave na area de jogo
	y: alturaJanela/2 - 25,	// Posicao vertical da nave na area do jogo
	altura: 50,	// Altura da nave
	largura: 50,	// Largura da nave
	velocidadeDesvio: 25,	// Velocidade da nave para os lados
	tempo: 0,
	cor: "#009900",	// Cor da nave

	// Metodo para desenhar a nave
	desenha: function(){
		contextoRenderizacao.fillStyle = this.cor;	// Definindo a cor da nave
		contextoRenderizacao.fillRect(this.x, this.y, this.altura, this.largura);	// Desenhando a nave
	},

	// Metodo para resetar a posicao da nave
	reset: function(){
		this.x = 50;
		this.y = alturaJanela/2 - 25;
		this.tempo = 0;
	},

	// Metodo para identificar as colisoes
	colidiu: function(m){
		// Flag para deteccao de colisoes
		var colisaoEmY = false;
		var colisaoEmX = false;

		// Variaveis auxiliares
		var x0, xF, y0, yF;	// Coordenadas da nave
		var mx0, mxF, my0, myF;	// Coordenadas do meteorito

		// Coordenadas da nave
		x0 = this.x;	// Superior esquerdo (x)
		y0 = this.y;	// Superior esquerdo (y)
		xF = this.x + this.largura;	// Superior direiro (x)
		yF = this.y + this.altura	// Superior direiro (y)

		// Coordenadas do meteorito
		mx0 = m.x;	// Superior esquerdo (x)
		my0 = m.y;	// Superior esquerdo (y)
		mxF = m.x + m.largura;	// Superior direito (x)
		myF = m.y + m.altura;	// Superior direito (y)

		// Detectando se a nave e o meteorito se coincidiram no eixo y
		if((xF > mx0 && xF < mxF) || (x0 > mx0 && x0 < mxF))
			colisaoEmY = true;
		
		// Detectando se a nave e o meteorito se coincidiram no eixo X
		if((yF > my0 && yF < myF) || (y0 > my0 && y0 < myF))
			colisaoEmX = true;

		return colisaoEmY * colisaoEmX;
	}			
},

// Objeto que representa a area de exibicao do placar e afins
areaPlacar = {
	x: 0,
	y: 0,
	largura: larguraJanela,
	altura: 100,
	cron:{
		hors: 0,
		mins: 0,
		segs: 0,
		vis: function(n){
			if(String(n).length<2)
				return "0" + n;
			else
				return n;	

		}
	},

	desenha: function(){
		contextoRenderizacao.fillStyle = "blue";
		contextoRenderizacao.fillRect(this.x, this.y, larguraJanela, this.altura,);
		contextoRenderizacao.fillStyle = "#ffffff";
		contextoRenderizacao.font = "50px terminal";
		contextoRenderizacao.fillText(this.execCron(), 10, 50);
	},


	execCron: function(teste){

		setInterval(function(){
			this.cron.segs++;
			if(this.cron.segs > 59){
				this.cron.segs = 0;
				this.cron.mins++;
			}
			if(this.cron.mins > 59){
				this.cron.mins = 0;
				this.cron.hors++;
			}
			return this.cron.vis(this.cron.hors) +
			":" + this.cron.vis(this.cron.mins) +
			":" + this.cron.vis(this.cron.segs);
		}, 1000);
	},

	adic0: function(temp, limit){
		if(temp >= 0 && temp <=9){
			temp = "0" + temp;
		}
		return temp;
	}
},

// Objeto que representa os meteoritos
arrMeteoritos = {
	meteoritos: [],	// Array onde fica os meteoritos
	paletaCores: ["#555555","#777777","#333333","#999999","#111111"],	// Cor que os meteoritos tem
	velocidadeMeteorito: 3,	// Velocidade dos meteoritos
	tempoChegaMeteorito: 0,	// Temporizador de meteoritos


	// Insere os meteoritos no jogo
	insere:	function(){
		// Inserindo um meteorito
		this.meteoritos.push({
			x:larguraJanela,	// Posicao horizontal do meteorito
			y:100 + Math.floor((alturaJanela - 150)*Math.random()),	// Posicao vertical do meteorito
			largura: 50,	// Largura do meteorito
			altura: 50,	// Altura do meteorito
			cor: this.paletaCores[Math.floor(5 * Math.random())],	// Cor do meteorito
		});
		this.tempoChegaMeteorito = 15 + Math.floor(30 * Math.random());
	},

	
	// Metodo para desenhar o meteorito
	desenha: function(){
		// Percorrendo o array de meteoritos
		for(var i=0, tam = this.meteoritos.length; i<tam; i++){
			met = this.meteoritos[i];
			contextoRenderizacao.fillStyle = met.cor;	// Recebendo a cor definida
			
			// Desenhando o meteorio
			contextoRenderizacao.fillRect(met.x, met.y, met.largura, met.altura);
		}
	},


	// Metodo para atualizar a localizacao dos meteoritos
	atualiza: function(){
	// Percorrendo o array de meteoritos
		for(var i = 0, tam = this.meteoritos.length; i < tam; i++){
			this.meteoritos[i].x = this.meteoritos[i].x - this.velocidadeMeteorito;	// Decrementa o x dos meteoritos (Deslocamento)
			
			// A nave colidiu com o meteorito?
			if(nave.colidiu(this.meteoritos[i]))
				estadoJogo = estado.terminou;	// O jogador perdeu o jogo
		
			// O meteorito chegou na outra extremidade do canvas?
			else if(this.meteoritos[i].x <= -this.meteoritos[i].largura){
				this.meteoritos.splice(i,1);	// Retira o meteorito do array
				tam--;	// Atualiza o tamanho do array
				i--;	// Atualiza o indice atual do array
			}
		}

		// O temporizador de meteoritos chegou a 0?
		if(this.tempoChegaMeteorito == 0)
			this.insere();	// Insere um meteorito

		// O temporizador nao chegou a 0
		else
			this.tempoChegaMeteorito--;	// Decrementa o temporizador
	},

	// Metodo para resetar o array depois que o jogo terminar
	limpa: function(){
		this.meteoritos = [];	// Reseta o array
	}
						
};


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
			if(nave.y <= areaPlacar.altura)
				nave.y = areaPlacar.altura;
			else
				nave.y = nave.y - nave.velocidadeDesvio;
		}

		// Condicional no caso da tecla "seta para baixo" ser pressionada
		else if (event.key == "ArrowDown"){
			if(nave.y + nave.altura >= alturaJanela)
				nave.y = alturaJanela - nave.altura;
			else
				nave.y = nave.y + nave.velocidadeDesvio;
		}

		else if (event.key == "ArrowLeft"){
			if(nave.x <= 50)
				nave.x = 50;
			else
				nave.x = nave.x - nave.velocidadeDesvio;
		}


		else if (event.key == "ArrowRight"){
			if(nave.x + nave.largura >= larguraJanela - 50)
				nave.x = larguraJanela - 50 - nave.largura ;
			else
				nave.x = nave.x + nave.velocidadeDesvio;
		}
		
	}
	
	// O jogo esta pronto para iniciar e o usuario apertou a tecla ENTER?
	else if(estadoJogo == estado.aIniciar && event.key == "Enter")
		estadoJogo = estado.rodando;	// O estado do jogo é setado para RODANDO

	// O jogo terminou e o usuario apertou a tecla ENTER?
	else if(estadoJogo == estado.terminou && event.key == "Enter"){
		estadoJogo = estado.aIniciar;	// O estado do jogo é setado pronto para iniciar nova partida
		arrMeteoritos.limpa();	// Reseta o array de meteoritos
	}
		
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

	// O jogo esta executando?
	if(estadoJogo == estado.rodando)
		arrMeteoritos.atualiza();	// Atualiza o array de meteoritos

	// O jogador perdeu?
	else if(estadoJogo == estado.terminou){
		nave.reset();
	}
}


// Funcao para desenhar os componentes do jogo
function desenha(){
	contextoRenderizacao.fillStyle = '#06004c';	// Definindo a cor de fundo do jogo
	contextoRenderizacao.fillRect(0, 0, larguraJanela, alturaJanela);	// Desenhamdo o fundo do jogo (o espaço)

	// O jogo esta pronto para iniciar?
	if(estadoJogo == estado.aIniciar){

		// Exibe uma tela verde de inicio de jogo
		contextoRenderizacao.fillStyle = 'green';	// setando a cor	
		contextoRenderizacao.fillRect(larguraJanela/2-50, alturaJanela/2-50, 100, 100);	// Desenhando o retangulo
	}

	// O jogo esta executando?
	else if(estadoJogo == estado.rodando){
		nave.desenha();	// Desenha a nave
		arrMeteoritos.desenha();	// Desenha os meteoritos
	}
	
	// O jogo acabou?
	else if(estadoJogo == estado.terminou){

		// Exibe a tela vermelha de fim de jogo
		contextoRenderizacao.fillStyle = 'red';	// Seta a cor
		contextoRenderizacao.fillRect(larguraJanela/2-50, alturaJanela/2-50, 100, 100 );	// Desenha o retangulo
	}

	areaPlacar.desenha();	// Desenha a area que exibe o placar
}


// Executa os metodos principais do jogo
function main(){
	areaDeJogo = document.getElementById("areaDeJogo");	// recebe o elemento associado ao id "areaDeJogo"
	areaDeJogo.width = larguraJanela;	// atribui a largura setada anteriormente
	areaDeJogo.height = alturaJanela;	// atribui a altura setada anteriormente
	areaDeJogo.style.border = "1px solid #000";	// Seta a borda do elemento
	contextoRenderizacao = areaDeJogo.getContext("2d");	// Contexto de renderização é 2D
	estadoJogo = estado.aIniciar;	// O jogo rece o status pronto para iniciar
	document.addEventListener("keydown", teclado);	// Associa a funcao teclado ao evento de pressionamento do teclado "keydown"
		
	roda();	// Executa o jogo
}

// Funcao principal
main();