var canvas, contextoRenderizacao,				// Variaveis usadas no canvas e renderizacao
larguraJanela = inicializa()["largura"],		// Recebe a largura da janela do jogo
alturaJanela = inicializa()["altura"],			// Recebe a altura da janela do jogo
frames = 0,
estadoJogo,										// Armazena o estado atual do jogo
img,

estado = {										// ESTADOS DO JOGO
	aIniciar: 0,								// O jogo esta pronto para iniciar
	rodando: 1,									// O jogo esta executando
	terminou: 2									// O jogo terminou
},

fundo = {										// Objeto que representa o fundo do jogo
	x:0,										// Variavel que representa a posicao da imagem de fundo no eixo X

	desenha: function(){						// Metodo que desenha a imagem de fundo do jogo
		spriteEspaco.desenha(this.x,0);			// Desenha a imagem de fundo
		spriteEspaco.desenha(this.x + spriteEspaco.largura, 0);	// Desenha a imagem de fundo novamente (nocao de continuidade)
	},

	atualiza: function(){						// Metodo para percrorrer a imagem de fundo infinitamente
		if(this.x == -spriteEspaco.largura)
			this.x = 0;
			
		this.x = this.x-0.5;
	}
	
},

nave = {										// OBJETO QUE REPRESENTA A NAVE
	x: 50,										// Posicao horizontal da nave na area de jogo
	y: alturaJanela/2 - 25,						// Posicao vertical da nave na area do jogo
	altura: spriteNave.altura,					// Altura da nave
	largura: spriteNave.largura,				// Largura da nave
	velocidadeDesvio: 1,						// Velocidade da nave para os lados
	cor: "#009900",								// Cor da nave
	vidas:3,
	//colidindo: false,

	desenha: function(){						// METODO PARA DESENHAR A NAVE
		spriteNave.desenha(this.x, this.y);
	},
	

	atualiza: function(dir){					// Metodo para controlar e atualizar a nave
		switch(dir){
			case "ArrowUp":
				if(this.y <= areaPlacar.altura)
					this.y = areaPlacar.altura
				else
					this.y = this.y - this.velocidadeDesvio;
				break;
				
			case "ArrowDown":
				if(this.y + this.altura >= alturaJanela)
					this.y = alturaJanela - this.altura;
				else
					this.y = this.y + this.velocidadeDesvio;
				break;
				
			case "ArrowRight":
				if(this.x + this.largura >= larguraJanela - 50)
					this.x = larguraJanela - 50 - this.largura ;
				else
					this.x = this.x + this.velocidadeDesvio;
				break;
				
			case "ArrowLeft":
				if(this.x <= 50)
					this.x = 50;
				else
					this.x = this.x - this.velocidadeDesvio;
				break;
		}
	},

	reset: function(){							// METODO PARA RESETAR A POSICAO DA NAVE
		this.x = 50;
		this.y = alturaJanela/2 - 25;
		this.vidas = 3;
		this.velocidadeDesvio = 16;
	},

	colidiu: function(m){						// METODO PARA DETECTAR AS COLISOES
		var colisaoEmY = false;					// Flag para deteccao de colisoes no eixo y (cima/baixo)
		var colisaoEmX = false;					// Flag para deteccao de colisoes no eixo x (lados)

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

		if((xF > mx0 && xF < mxF) || (x0 > mx0 && x0 < mxF))	// Detectando se a nave e o meteorito se coincidiram no eixo y
			colisaoEmY = true;
		
		if((yF > my0 && yF < myF) || (y0 > my0 && y0 < myF))	// Detectando se a nave e o meteorito se coincidiram no eixo X
			colisaoEmX = true;

		return colisaoEmY * colisaoEmX;			// Retorna true se houve colisao
	}			
},

areaPlacar = {									// OBJETO QUE REPRESENTA A AREA DE EXIBICAO DO PLACAR E AFINS
	x: 0,										// posicao X inicial do placar
	y: 0,										// posicao y inicial do placar
	largura: larguraJanela,						// largura do placar
	altura: 100,								// altura do placar
	recorde: 0,									// recorde atingido pelo jogador
	novoRecorde: false,							// flag que indica quando houve um novo recorde
	faseAtual: 0,
	

	inic: function(){							// Metodo para inicar/carregar as informacoes do recorde
		this.recorde = localStorage.getItem("recorde");

		if(this.recorde == null){
			this.recorde = "00:00:00";
		}

	},

	analisTemp: function(rec){					// Metodo para analisar o tempo do jogador
		if(rec>this.recorde){					// O jogador bateu o recorde?
			localStorage.setItem("recorde", rec);	// O recorde do jogador é carregado
			this.recorde = rec;
			this.novoRecorde = true;			// Flag para o novo recorde é acionado
		}

		else this.novoRecorde = false;			// Flag que indica novo recorde é desativado	

	},

	desenha: function(){						// Metodo que exibe o cronometro na tela
		contextoRenderizacao.fillStyle = "blue";	// Cor de fundo do cronometro
		contextoRenderizacao.fillRect(this.x, this.y, larguraJanela, this.altura,);
		contextoRenderizacao.fillStyle = "#ffffff";	// Cor da fonte do cronometro
		contextoRenderizacao.font = "40px Oxanium";	// Estilo da fonte do cronometro
		contextoRenderizacao.fillText(cron.mostrVis(), 10, 60);	// Exibindo o cronometro
		contextoRenderizacao.fillText("Nivel: "+Math.floor(areaPlacar.faseAtual/20), 200, 60);	// Exibindo o cronometro
		contextoRenderizacao.fillText("Vidas: "+nave.vidas, 400, 60);	// Exibindo o cronometro
	},
	
	reset: function(){
		this.faseAtual = 0;
	}
},

cron = {										// REPRESENTA O CRONOMETRO EXIBIDO NO PLACAR
	disp: 0,									// Flag que indica se o cronometro esta executando
	hors: 0,									// Contador de horas
	mins: 0,									// Contador de minutos
	segs: 0,									// Contador de segundos
	final: 0,									// Recebe o placar final obtido pelo jogador

	formatVis: function(n){						// METODO QUE FORMATA A EXIBICAO DE NUMEROS MENORES DO QUE 10

		if(String(n).length<2)					// Se o digito estiver entre 0 e 9, adiciona um '0' a esquerda
			return "0" + n;
		
		else
			return n;
	},

	mostrVis: function(){						// METODO QUE EXIBE AS INFORMACOES DO CRONOMETRO NO FORMATO (HH:MM:SS)
		return this.formatVis(this.hors) +
		":" + this.formatVis(this.mins) +
		":" + this.formatVis(this.segs);
	},

	resetCron: function(){						// Metodo para resetar o cronometro
		this.disp = 0;							// Resetando a flag de disparo
		this.hors = 0;							// Resetando as horas
		this.mins = 0;							// Resetando os minutos
		this.segs = 0;							// Resetando os segundos
	}
},

arrMeteoritos = {								// Objeto que representa os meteoritos
	meteoritos: [],								// Array onde fica os meteoritos
	//paletaCores: ["#555555","#777777","#333333","#999999","#111111"],	// Cor que os meteoritos tem
	velocidadeMeteorito: 0,						// Velocidade dos meteoritos
	tempoChegaMeteorito: 0,						// Temporizador de meteoritos
	
	insere:	function(){							// Insere os meteoritos no jogo
		this.meteoritos.push({					// Insere um meteorito
			x:larguraJanela,					// Posicao horizontal do meteorito
			y:this.novoMeteorito(), //20 + Math.floor((alturaJanela)*(Math.random())),		// Posicao vertical do meteorito
			largura: 87,						// Largura do meteorito
			altura: 87,							// Altura do meteorito
			//cor:  this.paletaCores[Math.floor(5 * Math.random())],		// Cor do meteorito
			sprite: arrSpriteMeteoritos[Math.floor(arrSpriteMeteoritos.length * Math.random())],
			velocidade: (areaPlacar.faseAtual/10) + 1,//Math.floor(3 * Math.random()),
			jaColidiu: false,
		});
		 
		
		this.tempoChegaMeteorito = 1 + Math.floor(1 * Math.random());	// Recebendo o tempo de chegda do proximo meteorito
	
	},
	/*
	vacuo: function(m, ny){
		if(m - ny <= Math.abs(x*2) && )
	}*/
	
	novoMeteorito: function(){					// Metodo para gerar um meteorito aleatorio no jogo
		var brecha = false, novoY;
		while(!brecha){
			novoY = 100 + Math.floor((alturaJanela)*(Math.random()));
			console.log(novoY);
			if(this.meteoritos.length > 0){
				for(ind = 0; ind < this.meteoritos.length; ind++){
					if(
					Math.abs(this.meteoritos[ind].y - novoY) <= Math.abs(270)
					&& this.meteoritos[ind].y != alturaJanela+100){
						novoY = alturaJanela+100;
						brecha = true;
						break;
					}
				
					else
						brecha = true;
				}
			}
					
			else brecha = true;
		}
		
		return novoY;
	},
			
	desenha: function(){						// Metodo para desenhar o meteorito
		for(var i=0, tam = this.meteoritos.length; i<tam; i++){	// Percorrendo o array de meteoritos
			met = this.meteoritos[i];
			met.sprite.desenha(met.x, met.y);
		}
	},

	atualiza: function(){						// Metodo para atualizar a localizacao dos meteoritos
		for(var i = 0, tam = this.meteoritos.length; i < tam; i++){	// Percorrendo o array de meteoritos
			this.meteoritos[i].x = this.meteoritos[i].x - this.meteoritos[i].velocidade;	// Decrementa o x dos meteoritos (Deslocamento)
			
			if(nave.colidiu(this.meteoritos[i]) && !this.meteoritos[i].jaColidiu){	// A nave colidiu com o meteorito?
				if(nave.vidas>=1)
					nave.vidas--;
				
				else
					estadoJogo = estado.terminou;	// O jogador perdeu o jogo
				
				this.meteoritos[i].jaColidiu = true;
				
			}
		
			else if(this.meteoritos[i].x <= -this.meteoritos[i].largura){	// O meteorito chegou na outra extremidade do canvas?
				this.meteoritos.splice(i,1);	// Retira o meteorito do array
				tam--;							// Atualiza o tamanho do array
				i--;							// Atualiza o indice atual do array
			}
		}

		if(this.tempoChegaMeteorito == 0){		// O temporizador de meteoritos chegou a 0?
			this.insere();						// Insere um meteorito
		}

		else									// O temporizador nao chegou a 0
			this.tempoChegaMeteorito--;			// Decrementa o temporizador
		
	},

	limpa: function(){							// Metodo para resetar o array depois que o jogo terminar
		this.meteoritos = [];					// Reseta o array de meteoritos
	}
						
};

function execCron(){							// Metodo que roda o cronometro
	cron.segs++;								// Incrementa 1 segundo
	areaPlacar.faseAtual++;
	if(nave.velocidadeDesvio<87)
		nave.velocidadeDesvio = nave.velocidadeDesvio + (areaPlacar.faseAtual/20);
	
	if(areaPlacar.faseAtual%20 == 0)
		nave.vidas = nave.vidas + 1;

	if(cron.segs > 59){							// Incremementa os minutos se os segundos chegarem a 60
		cron.segs = 0;
		cron.mins++;
	}

	if(cron.mins > 59){							// Incremementa as horas se os minutos chegarem a 60
		cron.mins = 0;
		cron.hors++;
	}
}

function inicializa(){							// Funcao para inicializar as dimensoes de execucao do jogo
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

function teclado(){								// Funcao que recebe os comandos do teclado e os envia para o jogo
	if(estadoJogo == estado.rodando){			// Condicional no caso da tecla "seta para cima" ser pressionada
		nave.atualiza(event.key);
	}
	
	else if(estadoJogo == estado.aIniciar && event.key == "Enter"){	// O jogo esta pronto para iniciar e o usuario apertou a tecla ENTER?
		estadoJogo = estado.rodando;			// O estado do jogo é setado para RODANDo
		
	}

	else if(estadoJogo == estado.terminou && event.key == "Enter"){	// O jogo terminou e o usuario apertou a tecla ENTER?
		estadoJogo = estado.aIniciar;			// O estado do jogo é setado pronto para iniciar nova partida
		arrMeteoritos.limpa();					// Reseta o array de meteoritos para a proxima partida
		
	}
		
}

function roda(){								// Metodo para executar o jogo
	atualiza();									// atualiza os caracteres do jogo
	desenha();									// Desenha os caracteres do jogo
	window.requestAnimationFrame(roda);			// Reexecuta a funcao roda indefinidamente
}

function atualiza(){							// Metodo para atualizar o jogo e executar o cronometro
	frames++;
	
	if(estadoJogo == estado.rodando){			// O jogo esta executando?
		fundo.atualiza();
		arrMeteoritos.atualiza();				// Atualiza o array de meteoritos
		//nave.atualiza();

		if(!cron.disp){							// Se o cronometro nao estiver executando o aciona
			cron.disp = setInterval(execCron, 1000);
		}
		
	}

	else if(estadoJogo == estado.terminou){		// O jogador perdeu?
		if(cron.disp){							// Se o cronometro ainda estiver executando, cancela o timer
			nave.reset();						// Resetando o estado da nave
			cron.final = cron.mostrVis();		// Recebendo o placar final
			areaPlacar.analisTemp(cron.final);	// Analisando a pontuacao(tempo) do player
			clearInterval(cron.disp);			// Parando a execucao do cronometro
			cron.resetCron();					// Resetando o cronometro para a proxima partida	
			areaPlacar.reset();
		}
		
	}
}

function desenha(){								// Funcao para desenhar os componentes do jogo
	fundo.desenha();

	if(estadoJogo == estado.aIniciar){			// O jogo esta pronto para iniciar?
		spriteInicio.desenha(larguraJanela/2 - larguraJanela/3, alturaJanela/2 - alturaJanela/3);
	}

	else if(estadoJogo == estado.rodando){		// O jogo esta executando?
		nave.desenha();							// Desenha a nave
		arrMeteoritos.desenha();				// Desenha os meteoritos
		areaPlacar.desenha();					// Desenha a area que exibe o placar
	}
	
	else if(estadoJogo == estado.terminou){		// O jogo acabou?
		spriteJogadorTempo.desenha(larguraJanela/7, alturaJanela/6);
		contextoRenderizacao.fillStyle = "#ffffff";						// Setando a cor do placar
		contextoRenderizacao.font = "50px Oxanium";						// Setando a fonte
		contextoRenderizacao.fillText(cron.final, larguraJanela/3, alturaJanela/3.16);	// Escrevendo o texto
		contextoRenderizacao.fillStyle = "#ffffff";						// Setando a cor do placar
		contextoRenderizacao.font = "50px Oxanium";						// Setando a fonte

		if(areaPlacar.novoRecorde == true)		// Hounve um novo recorde?
			spriteNovoRecorde.desenha(larguraJanela/7, alturaJanela/2.6);	// Desenha a sprint de recorde

		else{									// Nao houve um novo recorde?
			spriteMelhorTempo.desenha(larguraJanela/7, alturaJanela/2.6);	// Desenha o placar obtido
			mensagem = localStorage.getItem("recorde");						// Recebe o recorde batido antes
			contextoRenderizacao.fillText(mensagem, larguraJanela/3, alturaJanela/2 + alturaJanela/35);	// Escrevendo o texto
		}
		
	}
	
}

function main(){								// Executa os metodos principais do jogo
	areaDeJogo = document.getElementById("areaDeJogo");					// recebe o elemento associado ao id "areaDeJogo"
	areaDeJogo.width = larguraJanela;			// atribui a largura setada anteriormente
	areaDeJogo.height = alturaJanela;			// atribui a altura setada anteriormente
	areaDeJogo.style.border = "1px solid #000";	// Seta a borda do elemento
	contextoRenderizacao = areaDeJogo.getContext("2d");					// Contexto de renderização é 2D
	estadoJogo = estado.aIniciar;				// O jogo rece o status pronto para iniciar
	document.addEventListener("keydown", teclado);	// Associa a funcao teclado ao evento de pressionamento do teclado "keydown"
	
	areaPlacar.inic();							// Inicializa a area de placar
	img = new Image();							//Cria uma nova imagem
	img.src = "imagens/SpriteSheet.png";		// Carregando a imagem de sprite
	roda();										// Executa o jogo
}

main();											// Funcao principal
