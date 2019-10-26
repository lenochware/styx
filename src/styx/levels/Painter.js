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

		for(let tag of room.params.tags) {
			this.paintFeature(room, tag);
		}
	}

	paintFeature(room, tag)
	{
		var params = this.params[tag];
		if (!params) return;
		if (!_.isArray(params)) params = [params];

		for(let par of params) {
			if (par.painter == 'random') {
				this.paintRandom(room, par);
			}
			else {
				console.warn('Painter not found.');
			}			
		}
	}

	paintRandom(room, params)
	{
		var coords = this.getCoords(room, params);
		var id = this.getId(params.id);
		this.level.spawn(_.sample(coords), id);
	}

	//corridory?
	getCoords(room, params)
	{
		if (params.pos == 'center') return [room.getPoint('center')];
		if (params.pos == 'walls') return room.getWalls(); //- vynechat dvere;
		if (params.pos == 'side') return room.getBorderN(_.random(1,4));

		//if (params.pos == 'top,top-wall?') return room.getInner(1);
		// if (params.pos == 'doorstep') return room.getBorder(0);
		// if (params.pos == 'door') return room.getBorder(0);

		if (params.pos == 'corners') {
			return [
				room.getPoint('corner-1'),
				room.getPoint('corner-2'),
				room.getPoint('corner-3'),
				room.getPoint('corner-4')
			];
		}


		return this.level.find(params.where || 'floor', room);
	}

	getId(spec)
	{
		var id = _.isArray(spec)? _.sample(spec) : spec;
		
		if (id.startsWith('#')) {
			var oid = id.substr(1).split('.');
			return this.builder.getRandomId(oid[0], oid[1], 1);
		}

		return id;
	}

	drawCorridor(room, d1, d2)
	{
		var tile = 'floor';

		//class Point?
		var p1 = {x: d1.pos.x - d1.dir.x, y: d1.pos.y - d1.dir.y };
		var p2 = {x: d2.pos.x - d2.dir.x, y: d2.pos.y - d2.dir.y };

		var borders = room.getBorders();
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