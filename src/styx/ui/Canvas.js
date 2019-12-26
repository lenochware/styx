var Styx = Styx || {};
Styx.ui = Styx.ui || {};

/**
 * Canvas for rendering level view.
 */
Styx.ui.Canvas = class
{
	constructor(id, width, height)
	{
		var canvas = document.createElement('canvas');
		canvas.width = width;
		canvas.height = height;
		canvas.id = 'dungeon-view-canvas';
		this.ctx = canvas.getContext("2d");
		this.ctx.fillStyle = 'rgb(0,0,0)';
		$(id).append(canvas);
	}

	on(events, f)
	{
		$('#dungeon-view-canvas').on(events, f);
	}

	clear()
	{
		this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
		return this;
	}

	rect(x, y, w, h, color, fill = true)
	{
		this.ctx.fillStyle = color;
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