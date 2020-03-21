var canvas, contextoRenderizacao,				// Variaveis usadas no canvas e renderizacao
larguraJanela = inicializa()["largura"],		// Recebe a largura da janela do jogo
alturaJanela = inicializa()["altura"],			// Recebe a altura da janela do jogo
frames = 0,
estadoJogo,										// Armazena o estado atual do jogo
img,

// Estados do jogo
estado = {
	aIniciar: 0,								// O jogo esta pronto para iniciar
	rodando: 1,									// O jogo esta executando
	terminou: 2									// O jogo terminou
},


fundo = {
	x:0,

	desenha: function(){
		spriteEspaco.desenha(this.x,0);
		spriteEspaco.desenha(this.x + spriteEspaco.largura, 0);
	},

	atualiza: function(){
		if(this.x == -spriteEspaco.largura)
			this.x = 0;
		this.x = this.x-1;
		console.log(this.x);
	}
},



// Objeto que representa a nave
nave = {
	x: 50,										// Posicao horizontal da nave na area de jogo
	y: alturaJanela/2 - 25,						// Posicao vertical da nave na area do jogo
	altura: spriteNave.altura,									// Altura da nave
	largura: spriteNave.largura,								// Largura da nave
	velocidadeDesvio: 25,						// Velocidade da nave para os lados
	cor: "#009900",								// Cor da nave


	// Metodo para desenhar a nave
	desenha: function(){
		//contextoRenderizacao.fillStyle = this.cor;						// Definindo a cor da nave
		//contextoRenderizacao.fillRect(this.x, this.y, this.altura, this.largura);	// Desenhando a nave
		spriteNave.desenha(this.x, this.y);
	},


	// Metodo para resetar a posicao da nave
	reset: function(){
		this.x = 50;
		this.y = alturaJanela/2 - 25;
	},


	// Metodo para identificar as colisoes
	colidiu: function(m){
		
		// Flag para deteccao de colisoes
		var colisaoEmY = false;
		var colisaoEmX = false;

		// Variaveis auxiliares
		var x0, xF, y0, yF;						// Coordenadas da nave
		var mx0, mxF, my0, myF;					// Coordenadas do meteorito

		// Coordenadas da nave
		x0 = this.x;							// Superior esquerdo (x)
		y0 = this.y;							// Superior esquerdo (y)
		xF = this.x + this.largura;				// Superior direiro (x)
		yF = this.y + this.altura				// Superior direiro (y)

		// Coordenadas do meteorito
		mx0 = m.x;								// Superior esquerdo (x)
		my0 = m.y;								// Superior esquerdo (y)
		mxF = m.x + m.largura;					// Superior direito (x)
		myF = m.y + m.altura;					// Superior direito (y)

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
	recorde: 0,
	novoRecorde: false,


	inic: function(){
		this.recorde = localStorage.getItem("recorde");
		if(this.recorde == null){
			this.recorde = "00:00:00";
		}
	},


	analisTemp: function(rec){
		if(rec>this.recorde){
			localStorage.setItem("recorde", rec);
			this.recorde = rec;
			this.novoRecorde = true;
		}

		else this.novoRecorde = false;	
	},


	desenha: function(){
		contextoRenderizacao.fillStyle = "blue";
		contextoRenderizacao.fillRect(this.x, this.y, larguraJanela, this.altura,);
		contextoRenderizacao.fillStyle = "#ffffff";
		contextoRenderizacao.font = "50px Oxanium";
		contextoRenderizacao.fillText(cron.mostrVis(), 10, 60);

	},
},



cron = {
	disp: 0,									// Flag que indica se o cronometro esta executando
	hors: 0,									// Contador de horas
	mins: 0,									// Contador de minutos
	segs: 0,									// Contador de segundos
	final: 0,


	// Metodo que formata a exibição de numeros menores do que 10
	formatVis: function(n){
		// Se o digito estiver entre 0 e 9, adiciona um '0' a esquerda
		if(String(n).length<2)
			return "0" + n;
		else
			return n;
	},


	// Metodo que exibe as informacoes do cronometro no formato (HH:MM:SS)
	mostrVis: function(){
		return this.formatVis(this.hors) +
		":" + this.formatVis(this.mins) +
		":" + this.formatVis(this.segs);
	},


	// Metodo para resetar o cronometro
	resetCron: function(){
		this.disp = 0;							// Resetando a flag de disparo
		this.hors = 0;							// Resetando as horas
		this.mins = 0;							// Resetando os minutos
		this.segs = 0;							// Resetando os segundos
	}
},



// Objeto que representa os meteoritos
arrMeteoritos = {
	meteoritos: [],								// Array onde fica os meteoritos
	paletaCores: ["#555555","#777777","#333333","#999999","#111111"],	// Cor que os meteoritos tem
	velocidadeMeteorito: 3,						// Velocidade dos meteoritos
	tempoChegaMeteorito: 0,						// Temporizador de meteoritos


	// Insere os meteoritos no jogo
	insere:	function(){
		// Inserindo um meteorito
		this.meteoritos.push({
			x:larguraJanela,					// Posicao horizontal do meteorito
			y:100 + Math.floor((alturaJanela - 150)*Math.random()),		// Posicao vertical do meteorito
			largura: 87,						// Largura do meteorito
			altura: 87,							// Altura do meteorito
			cor: this.paletaCores[Math.floor(5 * Math.random())],		// Cor do meteorito
		});
		this.tempoChegaMeteorito = 60 + Math.floor(60 * Math.random());
	},

	
	// Metodo para desenhar o meteorito
	desenha: function(){
		// Percorrendo o array de meteoritos
		for(var i=0, tam = this.meteoritos.length; i<tam; i++){
			met = this.meteoritos[i];
			contextoRenderizacao.fillStyle = met.cor;					// Recebendo a cor definida
			contextoRenderizacao.fillRect(met.x, met.y, met.largura, met.altura);	// Desenhando o meteorio
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
				tam--;							// Atualiza o tamanho do array
				i--;							// Atualiza o indice atual do array
			}
		}

		// O temporizador de meteoritos chegou a 0?
		if(this.tempoChegaMeteorito == 0){
			this.insere();						// Insere um meteorito
		}

		// O temporizador nao chegou a 0
		else
			this.tempoChegaMeteorito--;			// Decrementa o temporizador
	},


	// Metodo para resetar o array depois que o jogo terminar
	limpa: function(){
		this.meteoritos = [];					// Reseta o array de meteoritos
	}
						
};



// Metodo que roda o cronometro
function execCron(){
	cron.segs++;								// Incrementa 1 segundo

	// Incremementa os minutos se os segundos chegarem a 60
	if(cron.segs > 59){
		cron.segs = 0;
		cron.mins++;
	}

	// Incremementa as horas se os minutos chegarem a 60
	if(cron.mins > 59){
		cron.mins = 0;
		cron.hors++;
	}
}


// Funcao para inicializar as dimensoes de execucao do jogo
function inicializa(){
	var dimensao = [];							// Array que armazena as dimensoes do jogo
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
	else if(estadoJogo == estado.aIniciar && event.key == "Enter"){
		estadoJogo = estado.rodando;			// O estado do jogo é setado para RODANDo
		
	}

	// O jogo terminou e o usuario apertou a tecla ENTER?
	else if(estadoJogo == estado.terminou && event.key == "Enter"){
		estadoJogo = estado.aIniciar;			// O estado do jogo é setado pronto para iniciar nova partida
		arrMeteoritos.limpa();					// Reseta o array de meteoritos para a proxima partida
		
	}
		
}


// Metodo para executar o jogo
function roda(){
	atualiza();									// atualiza os caracteres do jogo
	desenha();									// Desenha os caracteres do jogo
	window.requestAnimationFrame(roda);			// Reexecuta a funcao roda indefinidamente
}


// Metodo para atualizar o jogo e executar o cronometro
function atualiza(){
	frames++;
	//fundo.desenha();

	// O jogo esta executando?
	if(estadoJogo == estado.rodando){
		fundo.atualiza();
		arrMeteoritos.atualiza();				// Atualiza o array de meteoritos

		// Se o cronometro nao estiver executando o aciona
		if(!cron.disp){
			cron.disp = setInterval(execCron, 1000);
		}
	}

	// O jogador perdeu?
	else if(estadoJogo == estado.terminou){
		
		// Se o cronometro ainda estiver executando, cancela o timer
		if(cron.disp){
			nave.reset();						// Resetando o estado da nave
			cron.final = cron.mostrVis();		// Recebendo o placar final
			areaPlacar.analisTemp(cron.final);	// Analisando a pontuacao(tempo) do player
			clearInterval(cron.disp);			// Parando a execucao do cronometro
			cron.resetCron();					// Resetando o cronometro para a proxima partida	
		}
	}
}


// Funcao para desenhar os componentes do jogo
function desenha(){
	//contextoRenderizacao.fillStyle = '#06004c';	// Definindo a cor de fundo do jogo
	//contextoRenderizacao.fillRect(0, 0, larguraJanela, alturaJanela);	// Desenhamdo o fundo do jogo (o espaço)
	//spriteEspaco.desenha(0,0);
	fundo.desenha();

	// O jogo esta pronto para iniciar?
	if(estadoJogo == estado.aIniciar){

		// Exibe uma tela verde de inicio de jogo
		//contextoRenderizacao.fillStyle = 'green';	// setando a cor	
		//contextoRenderizacao.fillRect(larguraJanela/2-50, alturaJanela/2-50, 100, 100);	// Desenhando o retangulo
		spriteInicio.desenha(larguraJanela/2 - larguraJanela/3, alturaJanela/2 - alturaJanela/3);
	}

	// O jogo esta executando?
	else if(estadoJogo == estado.rodando){
		nave.desenha();							// Desenha a nave
		arrMeteoritos.desenha();				// Desenha os meteoritos
		areaPlacar.desenha();					// Desenha a area que exibe o placar
	}
	
	// O jogo acabou?
	else if(estadoJogo == estado.terminou){

		spriteJogadorTempo.desenha(larguraJanela/7, alturaJanela/6);
		contextoRenderizacao.fillStyle = "#ffffff";						// Setando a cor do placar
		contextoRenderizacao.font = "50px Oxanium";						// Setando a fonte
		contextoRenderizacao.fillText(cron.final, larguraJanela/3, alturaJanela/3.16);	// Escrevendo o texto

		//contextoRenderizacao.fillStyle = 'green';						// Setando a cor
		//contextoRenderizacao.fillRect(0, alturaJanela/2-175, larguraJanela, 100 );	// Desenhando o retangulo
		
		contextoRenderizacao.fillStyle = "#ffffff";						// Setando a cor do placar
		contextoRenderizacao.font = "50px Oxanium";						// Setando a fonte
		if(areaPlacar.novoRecorde == true)
			spriteNovoRecorde.desenha(larguraJanela/7, alturaJanela/6);
		else{
			spriteMelhorTempo.desenha(larguraJanela/7, alturaJanela/2.6);
			mensagem = localStorage.getItem("recorde");
			contextoRenderizacao.fillText(mensagem, larguraJanela/3, alturaJanela/2 + alturaJanela/35);	// Escrevendo o texto
		}
		
		//Exibe a tela vermelha de fim de jogo
//		contextoRenderizacao.fillStyle = 'red';	// Setando a cor
//		contextoRenderizacao.fillRect(0, alturaJanela/2-50, larguraJanela, 100 );	// Desenhando o retangulo
		
		
	}

	
}


// Executa os metodos principais do jogo
function main(){
	areaDeJogo = document.getElementById("areaDeJogo");					// recebe o elemento associado ao id "areaDeJogo"
	areaDeJogo.width = larguraJanela;			// atribui a largura setada anteriormente
	areaDeJogo.height = alturaJanela;			// atribui a altura setada anteriormente
	areaDeJogo.style.border = "1px solid #000";	// Seta a borda do elemento
	contextoRenderizacao = areaDeJogo.getContext("2d");					// Contexto de renderização é 2D
	estadoJogo = estado.aIniciar;				// O jogo rece o status pronto para iniciar
	document.addEventListener("keydown", teclado);	// Associa a funcao teclado ao evento de pressionamento do teclado "keydown"
	areaPlacar.inic();
	img = new Image();
	img.src = "imagens/SpriteSheet.png";
	roda();										// Executa o jogo
}


// Funcao principal
main();