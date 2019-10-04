var Styx = Styx || {};

Styx.Rectangle = class
{
	constructor(x, y, w, h)
	{
		this.assign(x, y, w, h);
	}

	storeInBundle(bundle) {
		bundle.put('_className_', 'Styx.Rectangle');
		bundle.put('_args_', [this.x, this.y, this.width, this.height]);
	}

	restoreFromBundle(bundle) {
	}	

	coords()
	{
		var pos = [];
		var start = this._pos(this.x, this.y);
		var size = this._pos(this.width, this.height);

		for(var y = 0; y < size.y; y++) {
			for(var x = 0; x < size.x; x++) {
				pos.push({x:x + start.x, y:y + start.y});
			}
		}
		return pos;
	}

	getBorderPoints()
	{
		var pos = [];
		var b = this.getPoint('corner-3');

		for (let i = 0; i < this.width; i++) {
			pos.push({x:this.x + i, y:this.y});
		}

		for (let i = 1; i < this.height; i++) {
			pos.push({x:b.x, y:this.y + i});
		}

		for (let i = 1; i < this.width; i++) {
			pos.push({x:b.x - i, y:b.y});
		}

		for (let i = 1; i < this.height; i++) {
			pos.push({x:this.x, y:b.y - i});
		}

		return pos;
	}

	static from(rect)
	{
		return new this(rect.x, rect.y, rect.width, rect.height);
	}

	assign(x, y, w = null, h = null)
	{
		if (x !== null) this.x = x;
		if (y !== null) this.y = y;
		if (w !== null) this.width = (w > 0)? w : 0;
		if (h !== null) this.height = (h > 0)? h : 0;
		
		return this;
	}

	move(x, y, jed = 'abs')
	{
		if (jed == 'rel')
		{
			this.assign(this.x + this.width * x, this.y + this.height * y);
		}
		else if(jed == 'abs') {
			this.assign(this.x + x, this.y + y);
		}

		return this;
	}

	resize(x, y, jed)
	{
		if (jed == 'rel')
		{
			this.assign(null, null, this.width * x, this.height * y);
		}
		else if(jed == 'abs') {
			this.assign(null, null, this.width + x, this.height + y);
		}

		return this;
	}

	expand(x, y)
	{
		this.assign(this.x - x, this.y - y, this.width + 2*x, this.height + 2*y);
		return this;		
	}

	center(x, y)
	{
		var pos = this.getPoint('center');
		return this.move(x - pos.x, y - pos.y);
	}

	/**
	 * Align this rectangle inside bounding rectangle.
	 */
	align(boundRect)
	{
		var dx, dy;

		dx = this.x + this.width - (boundRect.x + boundRect.width);
		dy = this.y + this.height - (boundRect.y + boundRect.height);
		this.move((dx>0)? -dx : 0, (dy>0)? -dy : 0);

		dx = boundRect.x - this.x;
		dy = boundRect.y - this.y;
		this.move((dx>0)? dx : 0, (dy>0)? dy : 0);

		return this;
	}

	/**
	 * Align rect on relative position (dx,dy) in this rectangle.
	 */
	alignOf(rect, dx, dy)
	{
		rect.assign(dx * this.width, dy * this.height);
		rect.align(this);
	}

	clone()
	{
		return new this.constructor(this.x, this.y, this.width, this.height);
	}

  _pos(x, y)
  {
    return {x: Math.floor(x), y: Math.floor(y)};
  }

	getPoint(name)
	{
		switch(name) {
			case 'corner-1': return this._pos(this.x, this.y);
			case 'corner-2': return this._pos(this.x + this.width - 1, this.y);
			case 'corner-3': return this._pos(this.x + this.width - 1, this.y + this.height - 1);
			case 'corner-4': return this._pos(this.x, this.y + this.height - 1);

			case 'border-1': return this._pos(this.x - 1, this.y - 1);
			case 'border-2': return this._pos(this.x + this.width, this.y - 1);
			case 'border-3': return this._pos(this.x + this.width, this.y + this.height);
			case 'border-4': return this._pos(this.x - 1, this.y + this.height);


			case 'center': return this._pos(this.x + this.width / 2, this.y + this.height / 2);

			// case 'center-1': return this._pos(this.x + this.width / 2, this.y - 1);
			// case 'center-2': return this._pos(this.x + this.width, this.y + this.height / 2);
			// case 'center-3': return this._pos(this.x + this.width / 2, this.y + this.height);
			// case 'center-4': return this._pos(this.x - 1, this.y + this.height / 2);

			case 'center-1': return this._pos(this.x + this.width / 2, this.y);
			case 'center-2': return this._pos(this.x + this.width - 1, this.y + this.height / 2);
			case 'center-3': return this._pos(this.x + this.width / 2, this.y + this.height - 1);
			case 'center-4': return this._pos(this.x, this.y + this.height / 2);


			case 'random': return this._pos(
				this.x + Styx.Random.int(this.width - 1), 
				this.y + Styx.Random.int(this.height - 1)
			);

			default: console.warn('Unknown point name.');
		}
	}

	equals(rect)
	{
		return (rect.x == this.x && rect.y == this.y && rect.width == this.width && rect.height == this.height);
	}

	inside(rect)
	{
		return this.equals(this.getIntersection(rect));
	}

	isInsidePoint(x, y)
	{
		return (x >= this.x && y >= this.y && x < this.x + this.width && y < this.y + this.height);
	}

	isBorderPoint(x, y)
	{
		return (x == this.x || y == this.y || x == this.x + this.width - 1 || y == this.y + this.height - 1);
	}

	isEmpty()
	{
		return (this.width == 0 || this.height == 0);
	}

	distance(pos)
	{
		var c = this.getPoint('center');
		return Math.hypot(c.x - pos.x, c.y - pos.y);
	}

	intersect(rect)
	{
		return !this.getIntersection(rect).isEmpty();
	}

	getIntersection(rect)
	{
		var x1 = Math.max(this.x, rect.x);
		var y1 = Math.max(this.y, rect.y);
		var x2 = Math.min(this.x + this.width, rect.x + rect.width);
		var y2 = Math.min(this.y + this.height, rect.y + rect.height);

		return new this.constructor(x1, y1, x2 - x1, y2 - y1);
	}

	split(nx, ny)
	{
		var list = [];
		var w = Math.round(this.width / nx);
		var h = Math.round(this.height / ny);

		var first = new this.constructor(this.x, this.y, w, h);

		for(let y = 0; y < ny; y++) {
			for(let x = 0; x < nx; x++) {
				var sub = first.clone().move(x, y, 'rel');

				if (x == nx - 1) sub.resize(this.width - nx * w, 0, 'abs');
				if (y == ny - 1) sub.resize(0, this.height - ny * h, 'abs');

				list.push(sub);
			}
		}

		return list;
	}

	splitX(sx, jed = 'abs')
	{
		if (jed == 'rel') {
			sx = Math.round(this.width * sx);
		}

		var list = [];
		list.push(new this.constructor(this.x, this.y, sx, this.height));
		list.push(new this.constructor(this.x + sx, this.y, this.width - sx, this.height));
		return list;
	}

	splitY(sy, jed = 'abs')
	{
		if (jed == 'rel') {
			sy = Math.round(this.width * sy);
		}

		var list = [];
		list.push(new this.constructor(this.x, this.y, this.width, sy));
		list.push(new this.constructor(this.x, this.y + sy, this.width, this.height - sy));
		return list;
	}
}