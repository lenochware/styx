var Styx = Styx || {};
Styx.levels = Styx.levels || {};

/**
 * Base class for any level builder.
 * Method createLevel() will create and return Level object by its definition in world/.../levels.js.
 */
Styx.levels.LevelBuilder = class
{
	constructor()
	{
		this.game = game;
		this.level = null;
		this.rooms = [];
	}

	createLevel(id)
	{
		this.level = new Styx.levels.Level(id);

		if (this.level.is('small')) {
			this.level.size.assign(0 , 0, 40, 15);
		}
		else if (this.level.is('large')) {
			this.level.size.assign(0 , 0, 198, 66);			
		}

		return this.level;
	}

	splitRect(r)
	{
		var min = Math.min(r.width, r.height);
		var max = Math.max(r.width, r.height);

		if (min < 5 || max < 8 || (Styx.Random.bet(.03) && max < 16)) {
			var room = new Styx.levels.Room(r.x, r.y, r.width - 1, r.height - 1);
			this.rooms.push(room);
			return;
		}

		//console.log(r.width, r.height);

		if (r.height * 1.5 < r.width) {

			var rs = r.splitX(Styx.Random.int(4, r.width - 4));
		}
		else {
			var rs = r.splitY(Styx.Random.int(4, r.height - 4));
		}

		this.splitRect(rs[0]);
		this.splitRect(rs[1]);
	}

	addNeighbours()
	{
		for (let i=0; i < this.rooms.length-1; i++) {
			for (let j=i+1; j < this.rooms.length; j++) {
				this.rooms[i].addNeighbour( this.rooms[j] );
			}
		}
	}


	addExit(pos, exit)
	{
		this.level.set(pos, 'id', exit.tile);
		this.level.exits[pos.x + ',' + pos.y] = {id: exit.id, pos: pos};
	}
}