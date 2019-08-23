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
		this.areas = [];
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

	findRoom(tag)
	{
		return _.chain(this.rooms).filter(obj => obj.is(tag));
	}

	addExit(pos, exit)
	{
		this.level.set(pos, 'id', exit.tile);
		this.level.exits[pos.x + ',' + pos.y] = {id: exit.id, pos: pos};
	}

	cleanUp()
	{
		for(let tile of this.level.tiles) {
			if (tile.id != 'door') continue;
			
			for (let pos of tile.surroundings()) {
				if (this.level.get(pos, 'id') == 'door') {
					this.level.set(pos, 'id', 'floor');
				}
			}

			//TODO: Point.left(pos), Point.surroundings(pos)

			var left  = {x: tile.pos.x - 1, y: tile.pos.y};
			var right = {x: tile.pos.x - 1, y: tile.pos.y};
			var up = {x: tile.pos.x, y: tile.pos.y - 1};
			var dn = {x: tile.pos.x, y: tile.pos.y + 1};

			if (this.level.get(left, 'tile').is('blocking') && this.level.get(right, 'tile').is('blocking')) continue;
			if (this.level.get(up, 'tile').is('blocking') && this.level.get(dn, 'tile').is('blocking')) continue;
			this.level.set(tile.pos, 'id', 'floor');
		}
	}

	// makeConnection(door, room)
	// {
	// 	var door2 = room.getDoorBySide(door.oppositeSide());
	// 	if (!door2 || door2.connected) return;
	// 	var con = new Styx.levels.Connector(door, door2);

	// 	if (con.isValid()) {
	// 		this.add(con, door);
	// 		return true;
	// 	}

	// 	return false;
	// }

	// findNearRoom(door)
	// {
	// 	var ray = door.getRay(8);
	// 	var rooms = this.findIntersecting(ray);
	// 	if (rooms.length == 0) return null;

	// 	var door2, test;

	// 	for (let r of rooms) {
	// 		test = r.getDoorBySide(door.oppositeSide());
	// 		if (!test || test.connected) continue;

	// 		if (!door2 || (test.distance(door) < door2.distance(door))) {
	// 			door2 = test;
	// 		}
	// 	}

	// 	return door2? door2.room : null;
	// }

	// getFreeDoors()
	// {
	// 	var list = [];
	// 	for(let room of this.rooms) {
	// 		list.push(room.getFreeDoors());
	// 	}

	// 	return _.flatten(list);
	// }

	// getFloorSize(rect)
	// {
	// 	var list = this.findIntersecting(rect);
	// 	var num = 0;

	// 	for (let room of list) {
	// 		num += (room.width - 1) * (room.height - 1);
	// 	}

	// 	return num;
	// }

	// isOccupied(newRoom)
	// {
	// 	for(let room of this.rooms)
	// 	{
	// 		if (newRoom.intersect(room)) return room;
	// 	}

	// 	return false;
	// }


	// findIntersecting(testRoom)
	// {
	// 	var list = [];

	// 	for(let room of this.rooms)
	// 	{
	// 		if (testRoom.intersect(room)) list.push(room);
	// 	}

	// 	return list;
	// }

}