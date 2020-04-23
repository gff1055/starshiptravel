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
spriteNave = new Sprite(1300, 300, 86, 86),


spriteInicio = new Sprite(1000, 700, 397, 347),
spriteNovoRecorde = new Sprite(500, 700, 441, 95);
spriteMelhorTempo = new Sprite(0, 900, 441, 95);
spriteJogadorTempo = new Sprite(0, 690, 441, 95);

arrSpriteMeteoritos = [
	new Sprite(1300, 0, 87, 87),
	new Sprite(1300, 100, 87, 87),
	new Sprite(1300, 200, 87, 87)

];

