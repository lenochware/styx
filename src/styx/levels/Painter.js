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

		if (room.is('corridor')) 
		{
			room.fill('wall');
			for (let i = 0; i < room.doors.length - 1; i++) {
				this.drawCorridor(room, room.doors[i], room.doors[i+1]);
			}
		}
		else {
			room.fill('floor');
		}

		for(let tag of room.params.tags) {
			this.paintFeature(room, tag);
		}

		this.paintDoors(room);
		room.addTag('painted');
	}

	paintDoors(room)
	{
		var secret = room.is('secret');

		if (!secret) {
			if (room.is('doors-open')) {
				for (let door of _.sample(room.doors, _.random(1, room.doors.length))) {
					door.id = Styx.Random.bet(.5)? 'open_door' : 'floor';
				}
			}

			if (room.is('passage')) {
				_.sample(room.doors).id = 'passage';
			}
		}

		for (let door of room.doors) {

			if (door.room.is('painted') && !door.room.is('corridor')) continue;

			if (room.is('corridor')) {
				this.level.set(door.pos, 'id', 'floor');
				continue;
			}

			var tile = this.level.get(door.pos, 'tile');

			if (secret) {
				tile.params.secret = door.id;
				tile.id = 'wall';
				continue;
			}
			
			if (door.id == 'passage') {
				var p = room.getPortal(door.room);
				for (let pos of p.coords()) {
					this.level.set(pos, 'id', 'floor');
				}
			}
			else {
				tile.id = door.id;
			}
		}		
	}

	paintFeature(room, tag)
	{
		var params = this.params[tag];
		if (!params) return;
		if (!_.isArray(params)) params = [params];

		for(let par of params) {
			switch (par.painter) {
				case 'random': this.paintRandom(room, par); break;
				case 'fill': this.paintFill(room, par); break;
				case 'mfill': this.paintMultiFill(room, par); break;
				case 'simplex': this.paintSimplex(room, par); break;
				case 'maze': this.paintMaze(room, par); break;
				case 'pattern': this.paintPattern(room, par); break;
				default:	console.warn('Painter not found.');
			}
		}
	}

	paintRandom(room, params)
	{
		var coords = this.getCoords(room, params);
		var maxcount = params.maxcount? _.random(1, params.maxcount) : 1;

		for (let i = 0; i < maxcount; i++) {
			var id = this.getId(params.id);
			this.spawn(_.sample(coords), id);			
		}
	}

	paintFill(room, params)
	{
		var coords = this.getCoords(room, params);
		var id = this.getId(params.id);

		for (let pos of coords) {
			this.spawn(pos, id);
		}
	}

	paintMultiFill(room, params)
	{
		var coords = this.getCoords(room, params);

		for (let pos of coords) {
			var id = this.getId(params.id);
			this.spawn(pos, id);
		}
	}

	paintPattern(room, params)
	{
		var pat = params.pattern; 
		var px = pat[0].length;
		var py = pat.length;
		//var id = this.getId(params.id);

		for (let y = 0;  y < room.height; y++) {
			for (let x = 0;  x < room.width; x++) {
				this.spawn({x: room.x + x, y: room.y + y}, pat[y%py][x%px]);
			}
		}
	}

	paintMaze(room, params)
	{
		//console.log('maze', room);
		var maze = new ROT.Map.IceyMaze(room.width, room.height, 1);
		maze.create((x,y,i) => {
			if (i) return;
			this.spawn({x: room.x + x, y: room.y + y}, params.id);
		});
	}

	paintSimplex(rect, params)
	{
		var noise = new ROT.Noise.Simplex();
		var coords = rect.coords();
		var size = params.size || [18,10];
		for (let pos of coords) {
			var val = noise.get(pos.x/size[0], pos.y/size[1]);
			var id = params.id[this.getWeightedIndex(params.weights, val)];
			
			if (params.where && !this.level.get(pos, 'tile').is(params.where)) {
				continue;
			}

			this.spawn(pos, id);
		}

	}

	getWeightedIndex(list, val)
	{
		for(let i = 0; i < list.length; i++) {
			if (list[i] > val) return i;
		}

		return list.length;
	}

	spawn(pos, id)
	{
		if (id == 'none') return;
		this.level.spawn(pos, id);
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
	}	

}