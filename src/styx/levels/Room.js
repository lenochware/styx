var Styx = Styx || {};
Styx.levels = Styx.levels || {};

Styx.levels.Room = class extends Styx.Rectangle
{
	constructor(level, x, y, width, height)
	{
		super(x, y, width, height);
		this.game = game;
		this.level = level;
		this.params = {tags: []};
		this.neighbours = [];
		this.doors = [];
		this.streamId = null;
		this.name = null;
	}

	id()
	{
		return "Room_".concat(this.x, '_', this.y);
	}

	getAttrib(attrib, defaultValue = null)
	{
		if (this.params[attrib] !== undefined) return this.params[attrib];
		if (!this.name) return null;
		var value = this.game.db.getAttrib('rooms', this.name, attrib);
		return (value !== undefined)? value : defaultValue;
	}

	setAttrib(attrib, value)
	{
		this.params[attrib] = value;
	}

	addTag(tag)
	{
		if (this.params['tags'].includes(tag)) return;
		this.params['tags'].push(tag);
	}

	removeTag(tag)
	{
		if (!this.params['tags']) return;
		this.params['tags'] = _.without(this.params['tags'], tag);
	}

	is(tag)
	{
    return (this.name == tag || this.getAttrib("tags").includes(tag));
	}

	addNeighbour(r)
	{
		var portal = this.getPortal(r);
		if (!portal) return;		
		this.neighbours.push(r);
		r.neighbours.push(this);
	}

	isFree()
	{
		return (this.streamId == null);
	}

	freeNeighbours()
	{
		var rooms = [];

		for (let r of this.neighbours) {
			if (r.isFree()) rooms.push(r);
		}

		return rooms;
	}

	addDoor(next)
	{
		var p = this.getPortal(next).getPoint('random');
		this.addDoorPos(next, p);
	}

	addDoorPos(r, p)
	{
		var dir = {x: 0, y: 0};

		if (p.x < this.x) dir.x = -1;
		if (p.x >= this.x + this.width) dir.x = 1;
		if (p.y < this.y) dir.y = -1;
		if (p.y >= this.y + this.height) dir.y = 1;

		this.doors.push({room: r, pos: p, dir: dir});
		r.doors.push({room: this, pos: p, dir: {x: dir.x * -1, y: dir.y * -1}});
	}

	getPortal(rect)
	{
		var x1 = Math.max(this.x, rect.x);
		var y1 = Math.max(this.y, rect.y);
		var x2 = Math.min(this.x + this.width, rect.x + rect.width);
		var y2 = Math.min(this.y + this.height, rect.y + rect.height);

		var dx = (this.x < rect.x)? rect.x - (this.x + this.width) : this.x - (rect.x + rect.width);
		var dy = (this.y < rect.y)? rect.y - (this.y + this.height) : this.y - (rect.y + rect.height);

		if (dx > 0 && dy > 0) return null;

		if ((dx < 0 && dy == 1) || (dy < 0 && dx == 1))
		{
			if (x1 < x2 && y1 < y2) {
				return new Styx.Rectangle(x1, y1, x2 - x1, y2 - y1);
			}
			else if (x2 < x1 && y2 < y1) {
				return new Styx.Rectangle(x2, y2, x1 - x2, y1 - y2);
			}
			else if (x1 < x2 && y2 < y1) {
				return new Styx.Rectangle(x1, y2, x2 - x1, y1 - y2);
			}
			else if (x1 > x2 && y1 < y2) {
				return new Styx.Rectangle(x2, y1, x1 - x2, y2 - y1);
			}

		}

		return null;
	}

	fill(id)
	{
		for (var y = 0; y < this.height; y++) {
			for (var x = 0; x < this.width; x++) {
				this.level.setXY(this.x + x, this.y + y , 'id', id);
			}
		}	
	}
}