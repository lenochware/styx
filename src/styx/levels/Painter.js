var Styx = Styx || {};
Styx.levels = Styx.levels || {};

/**
 * Draw room tiles.
 * It is used by LevelBuilder.
 */
Styx.levels.Painter = class
{

	constructor(builder)
	{
		this.builder = builder;
		this.level = this.builder.level;
		this.params = this.level.getAttrib('paint');
	}

	paint(room)
	{
		var secret = room.is('secret');

		for (let door of room.doors) {
			if (door.id == 'gate') {
				var p = room.getPortal(door.room);
				for (let pos of p.coords()) {
					this.level.set(pos, 'id', 'floor');
				}
			}
			else {
				var tile = this.level.get(door.pos, 'tile');
				if (secret) {
					tile.params.secret = door.id;
					tile.id = 'wall';
				}
				else {
					tile.id = door.id;
				}
			}
		}

		if (room.is('corridor')) 
		{
			room.fill('wall');
			for (let i = 0; i < room.doors.length - 1; i++) {
				this.drawCorridor(room, room.doors[i], room.doors[i+1]);
			}
		}
		else {
			//room.fill(room.is('secret')? 'water': 'floor');
			room.fill('floor');
		}
	}

	drawCorridor(room, d1, d2)
	{
		var tile = 'floor';

		//class Point?
		var p1 = {x: d1.pos.x - d1.dir.x, y: d1.pos.y - d1.dir.y };
		var p2 = {x: d2.pos.x - d2.dir.x, y: d2.pos.y - d2.dir.y };

		var borders = room.getBorderPoints();
		borders = borders.concat(borders);
		if (Styx.Random.bet(.5)) {
			borders = borders.reverse();
		}


		var draw = false;

		for (let pos of borders)
		{
			if (draw) this.level.set(pos, 'id', tile);

			if ((pos.x != p1.x || pos.y != p1.y) 
				&& (pos.x != p2.x || pos.y != p2.y)) {
					continue;
				}

			if (!draw) {
				draw = true;
				this.level.set(pos, 'id', tile);
			}
			else {
				break;
			}
		}

		//no doors between corridors
		var x = room.doors[0];
		if (x && x.room.is('corridor')) {
			this.level.set(x.pos, 'id', 'floor');
		}
	}	

}