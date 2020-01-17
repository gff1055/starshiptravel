var canvas, contextoRenderizacao,
larguraJanela = inicializa()["largura"],
alturaJanela = inicializa()["altura"],
frames = 0,
velocidadeDesvio = 8,

nave =	{
			x: 50,
			y: alturaJanela/2 - 25,
			altura: 50,
			largura: 50,
			cor: "#009900",

			desenha:	function()
						{
							contextoRenderizacao.fillStyle = this.cor;
							contextoRenderizacao.fillRect(this.x, this.y, this.altura, this.largura);
			}
},

arrMeteoritos = 	{
						meteoritos: [],

						paletaCores: ["#555555","#777777","#333333","#999999","#111111"],

						insere:	function()
								{
									this.meteoritos.push(	{
																x:200,
																y:100 + Math.floor((alturaJanela - 150)*Math.random()),
																largura: 50,
																altura: 50,
																cor: this.paletaCores[Math.floor(5 * Math.random())],
									})
									
						},

						desenha: function()
						{
							for(var i=0, tam = this.meteoritos.length; i<tam; i++)
							{
								contextoRenderizacao.fillStyle = this.meteoritos[i].cor;
								contextoRenderizacao.fillRect(
									this.meteoritos[i].x,
									this.meteoritos[i].y,
									this.meteoritos[i].largura,
									this.meteoritos[i].altura
								);

							}
						}
						
}

;

function inicializa()
{
	var dimensao = [];
	dimensao["largura"] = window.innerWidth;	// Pega a largura da janela do usuario
	dimensao["altura"] = window.innerHeight;	// Pega a altura da janela do usuario
	
	// Seta a area de execucao do jogo
	if(dimensao["largura"]>=600)
	{
		dimensao["largura"] = 600;
		dimensao["altura"] = 600;
	}

	return dimensao;
}

function teclado()
{
	if(event.key == "ArrowUp")
		nave.y = nave.y-velocidadeDesvio;
	
	else if (event.key == "ArrowDown")
		nave.y = nave.y+velocidadeDesvio;
}


// Metodo para executar o jogo
function roda()
{
	atualiza();	// atualiza os caracteres do jogo
	desenha();
	window.requestAnimationFrame(roda);
}

function atualiza()
{
	frames++;
}

function desenha()
{
	contextoRenderizacao.fillStyle = '#06004c';
	contextoRenderizacao.fillRect(0, 0, larguraJanela, alturaJanela);

	arrMeteoritos.desenha();
	nave.desenha();
}

// Executa os metodos principais do jogo
function main()
{
	areaDeJogo = document.getElementById("areaDeJogo");	// recebe o elemento canvas associado ao id "areaDeJogo"
	areaDeJogo.width = larguraJanela;	// atribui a largura setada anteriormente na canvas do jogo
	areaDeJogo.height = alturaJanela;	// atribui a altura setada anteriormente na canvas do jogo
	areaDeJogo.style.border = "1px solid #000";	// Seta a borda do elemento canvas
	contextoRenderizacao = areaDeJogo.getContext("2d");	// Contexto de renderização é 2D
	document.addEventListener("keydown", teclado);	// Associa a funcao teclado ao evento de pressionamento do teclado "keydown"
	
	roda();	// Executa o jogo
}

// Funcao principal
main();