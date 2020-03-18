function Sprite(x, y, largura, altura){
	this.x = x;
	this.y = y;
	this.largura = largura;
	this.altura = altura;


	this.desenha = function(xCanvas, yCanvas){
		contextoRenderizacao.drawImage(
			img,
			this.x, this.y,
			this.largura, this.altura,
			xCanvas, yCanvas,
			this.largura, this.altura);
		
	}
}

var spriteEspaco = new Sprite(0, 0, 1200, 600),
spriteNave = new Sprite(1300, 300, 86, 86);

//espaco = new Sprite(0, 0, 1200, 600);

