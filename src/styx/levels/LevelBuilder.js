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
		this.streams = [];

		this.params = {
			room_max_size: 15,
			big_rooms_ratio: 0.03,
			corridor_ratio: 0.5,
			door_type: 'door'
		}
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

		if (min < 5 || max < 8 || (Styx.Random.bet(this.params.big_rooms_ratio) && max <= this.params.room_max_size)) {
			var room = new Styx.levels.Room(this.level, r.x, r.y, r.width - 1, r.height - 1);
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

	//maximalni/minimalni delka, protinani sebe sama, jinych cest, preferovany smer?...
	findPath(room)
	{
		var next = null;
		var rooms = new Set([room]);

		while (true) {
			var nb = _.shuffle(room.neighbours);
			for (next of nb) {
				if (next.isFree() && !rooms.has(next)) break;
			}

			if (!next.isFree() || rooms.has(next)) break;

			room = next;
			rooms.add(room);
		}

		return Array.from(rooms);
	}

	// addStream(id, start)
	// {
	// 	if (start.isFree()) {
	// 		return this._addStream(id, start);
	// 	}
	// 	else {
	// 		var nb = start.freeNeighbours();
	// 		if (nb.length == 0) return null;
	// 		var next = _.sample(nb);
			
	// 		start.addDoor(next);
	// 		return this._addStream(id, next);			
	// 	}
	// }

	addStream(id, start)
	{
		var rooms = this.findPath(start);

		for(let i = 0; i < rooms.length; i++) {
			var room = rooms[i];

			room.streamId = id;
			if (rooms[i+1]) room.addDoor(rooms[i+1], this.params.door_type);

			//corridor
			if (Styx.Random.bet(this.params.corridor_ratio) && room.doors.length > 1) {
				room.addTag('corridor');
			}
			else {
				room.addTag('room');
			}
		}

		this.streams.push(rooms);
		return rooms;
	}

	buildRoom(room)
	{
		for (let door of room.doors) {
			if (door.id == 'gate') {
				var p = room.getPortal(door.room);
				for (let pos of p.coords()) {
					this.level.set(pos, 'id', 'floor');
				}
			}
			else {
				this.level.set(door.pos, 'id', door.id);
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
			room.fill(room.is('secret')? 'water': 'floor');
		}

	}

	build()
	{
		for (let stream of this.streams) {
			for (let room of stream) {
				this.buildRoom(room);
			}
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