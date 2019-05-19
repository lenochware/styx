var Styx = Styx || {};

Styx.Rectangle = class
{
	constructor(x, y, width, height)
	{
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}

	coords()
	{
		var pos = [];
		for(var y = 0; y < this.height; y++) {
			for(var x = 0; x < this.width; x++) {
				pos.push({x:x + this.x, y:y + this.y});
			}
		}
		return pos;
	}
}