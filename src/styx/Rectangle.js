var Styx = Styx || {};

Styx.Rectangle = class
{
	constructor(x, y, w, h, params = {})
	{
		this.params = params;
		this.assign(x, y, w, h);
	}

	storeInBundle(bundle) {
		bundle.put('_className_', 'Styx.Rectangle');
		bundle.put('_args_', [this.x, this.y, this.width, this.height, this.params]);
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

	align(rect)
	{
		var dx, dy;

		dx = this.x + this.width - (rect.x + rect.width);
		dy = this.y + this.height - (rect.y + rect.height);
		this.move((dx>0)? -dx : 0, (dy>0)? -dy : 0);

		dx = rect.x - this.x;
		dy = rect.y - this.y;
		this.move((dx>0)? dx : 0, (dy>0)? dy : 0);

		return this;
	}

	clone()
	{
		return new this.constructor(this.x, this.y, this.width, this.height, this.params);
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
				this.x + Styx.Random.int(this.width - 2) + 1, 
				this.y + Styx.Random.int(this.height - 2) + 1
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

	pointInside(x, y)
	{
		return (x >= this.x && y >= this.y && x < this.x + this.width && y < this.y + this.height);
	}

	isEmpty()
	{
		return (this.width == 0 || this.height == 0);
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

		return new Styx.Rectangle(x1, y1, x2 - x1, y2 - y1);
	}	
}