var Styx = Styx || {};
Styx.ui = Styx.ui || {};

/**
 * Canvas for rendering level view.
 */
Styx.ui.Canvas = class
{
	constructor(containerId)
	{
		var canvas = document.createElement('canvas');
		var container = $(containerId);
		canvas.width = container.width();
		canvas.height = container.height();
		canvas.id = containerId + '-canvas';
		this.ctx = canvas.getContext("2d");
		this.ctx.fillStyle = 'rgb(0,0,0)';
		this.ctx.textBaseline = "top";
		//this.ctx.scale(2, 2);
		$(containerId).append(canvas);
	}

	clear()
	{
		this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
		return this;
	}

	rect(x, y, w, h, color, fill = true)
	{
		this.ctx.fillStyle = color;
		this.ctx.strokeStyle = color;
		this.ctx.beginPath();
		this.ctx.rect(x, y, w, h);

		if (fill) this.ctx.fill();
		else this.ctx.stroke();

		return this;
	}

	setFont(font)
	{
		this.ctx.font = font;
	}

	text(x, y, color, s)
	{
		this.ctx.fillStyle = color;
		this.ctx.fillText(s, x, y); 
	}
}