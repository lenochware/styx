var Styx = Styx || {};
Styx.levels = Styx.levels || {};

/**
 * Create various shapes in level layout using canvas painting.
 * It is used by LevelBuilder.
 */
Styx.levels.Painter = class
{

	constructor(width, height)
	{
		var canvas = document.createElement('canvas');
		canvas.width = width;
		canvas.height = height;
		this.ctx = canvas.getContext("2d");
		this.ctx.fillStyle = 'rgb(0,0,0)';
	}

	clear()
	{
		this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
		return this;
	}

	setBlending(id)
	{
		this.ctx.globalCompositeOperation = id;
		return this;
	}

	setLine(width, dash = [1, 1])
	{
		this.ctx.lineWidth = width;
		this.ctx.setLineDash(dash);
		return this;
	}

	ellipse(x, y, rx, ry, fill = true)
	{
		this.ctx.beginPath();
		this.ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI*2);
		this.ctx.closePath();

		if (fill) this.ctx.fill();
		else this.ctx.stroke();

		return this;
	}

	polygon(points, fill = true)
	{
		this.ctx.beginPath();
		this.ctx.moveTo(points[0].x, points[0].y);
		for(let i = 1; i < points.length; i++) {
			this.ctx.lineTo(points[i].x, points[i].y);
		}

		this.ctx.closePath();

		if (fill) this.ctx.fill();
		else this.ctx.stroke();

		return this;
	}

	polyline(points)
	{
		this.ctx.beginPath();
		this.ctx.moveTo(points[0].x, points[0].y);
		for(let i = 1; i < points.length; i++) {
			this.ctx.lineTo(points[i].x, points[i].y);
		}

		this.ctx.stroke();

		return this;
	}

	spline(points, fill = false, closed = false)
	{
		this.ctx.moveTo(points[0].x, points[0].y);

		for (var i = 1; i < points.length - 2; i ++)
		{
				var xc = (points[i].x + points[i + 1].x) / 2;
				var yc = (points[i].y + points[i + 1].y) / 2;
				this.ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
		}
		// curve through the last two points
		this.ctx.quadraticCurveTo(points[i].x, points[i].y, points[i+1].x,points[i+1].y);

		if (closed) this.ctx.closePath();

		if (fill) this.ctx.fill();
		else this.ctx.stroke();

		return this;
	}

	points(pointsList)
	{
		for (let pos of pointsList) {
			this.ctx.fillRect(pos.x, pos.y, 1, 1);
		}
	}

	rect(x, y, w, h, fill = true)
	{
		this.ctx.beginPath();
		this.ctx.rect(x, y, w, h);

		if (fill) this.ctx.fill();
		else this.ctx.stroke();

		return this;
	}

	grid(x, y, w, h, dx, dy, offset = 0)
	{
		var list = [];

		for(let i = 0; i < h; i += dy) {
			for(let j = 0; j < w; j += dx) {
				list.push({x: x+j + ((i%(2*dy) == 0)? offset: 0), y: y+i});
			}
		}

		this.points(list);
	}

	getPixels(w = null, h = null)
	{
		if (!w) {
			w = this.ctx.canvas.width;
			h = this.ctx.canvas.height;
		}

		return this.ctx.getImageData(0, 0, w, h).data;
	}

	getAlpha(x, y, w, h)
	{
		var alpha = [];

		var data = this.ctx.getImageData(x, y, w, h).data;
		for(let i = 3; i < data.length; i+=4)
		{
			alpha.push(data[i]);
		}

		return alpha;
	}

}