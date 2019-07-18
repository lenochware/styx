var Styx = Styx || {};
Styx.levels = Styx.levels || {};


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
	}

	populate() 
	{
		throw new Error('Not implemented.');		
	}

	chooseNextRoom()
	{
		throw new Error('Not implemented.');
	}

	findRoom(tag)
	{
		return _.chain(this.rooms).filter(obj => obj.is(tag));
	}


	add(room, exit)
	{
		if (exit) {
			exit.connect(room);
		}

		this.rooms.push(room);
		return room;
	}

	addToRandomPlace(room)
	{
		var tests = 10;
		while (tests--) {

			room.assign(
				Styx.Random.int(this.level.size.width - room.width), 
				Styx.Random.int(this.level.size.height - room.height)
			);

			if (!this.isOccupied(room)) {
				this.add(room, null);
				return true;
			}
		}
		
		return false;
	}

	addNextRoom(room, nextRoom)
	{
		for(let en of room.getFreeEntrances()) {

			if (!nextRoom.getEntranceBySide(en.oppositeSide())) continue;

			en.alignRoom(nextRoom);

			if (!nextRoom.inside(this.level.size)) continue;
			var occupied = this.isOccupied(nextRoom);

			if (!occupied) {
				this.add(nextRoom, en);
				return true;
			}

			// else {
			// 	var r = this.findNearRoom(en);
			// 	if (r) {
			// 		if (this.makeConnection(en, r)) return false;
			// 	}
			// }
		}

		return false;
	}

	addExit(pos, exit)
	{
		this.level.set(pos, 'id', exit.tile);
		this.level.exits[pos.x + ',' + pos.y] = {id: exit.id, pos: pos};
	}

	makeConnection(en, room)
	{
		var en2 = room.getEntranceBySide(en.oppositeSide());
		if (!en2 || en2.connected) return;
		var con = new Styx.levels.Connector(en, en2);

		if (con.isValid()) {
			//console.log(en.getPos(),en2.getPos(), en2);
			this.add(con, en);
			return true;
		}

		return false;
	}

	isOccupied(newRoom)
	{
		for(let room of this.rooms)
		{
			if (newRoom.intersect(room)) return room;
		}

		return false;
	}

	findNearRoom(en)
	{
		var ray = en.getRay(8);
		var rooms = this.findIntersecting(ray);
		if (rooms.length == 0) return null;

		var en2, test;

		for (let r of rooms) {
			test = r.getEntranceBySide(en.oppositeSide());
			if (!test || test.connected) continue;

			if (!en2 || (test.distance(en) < en2.distance(en))) {
				en2 = test;
			}
		}

		return en2? en2.room : null;
	}

	getFreeEntrances()
	{
		var list = [];
		for(let room of this.rooms) {
			list.push(room.getFreeEntrances());
		}

		return _.flatten(list);
	}

	findIntersecting(testRoom)
	{
		var list = [];

		for(let room of this.rooms)
		{
			if (testRoom.intersect(room)) list.push(room);
		}

		return list;
	}

	createTiles(size, tileId)
	{
		var tiles = [];

		for (var i = 0; i < size.width * size.height; i++) {
			tiles[i] = new Styx.levels.Tile(i % size.width, Math.floor(i / size.width), tileId);
		}

		return tiles;
	}

	getBiom(id)
	{
		return this.game.db.getObject('bioms', id);
	}

	addBiom(id)
	{
		var biom = this.getBiom(id);

		this.addObjectGroup(biom.tiles);
		this.addObjectGroup(biom.items);
		this.addObjectGroup(biom.monsters);
	}

	addObjectGroup(group)
	{
		var count = Styx.Random.int(group.count[0], group.count[1]);

		while (count--) {
			var id = group.list[Styx.Random.chances(group.chances)];
			var pos = this.pickPosition(group.type, group.location);

			if (group.type == 'tiles') {
				this.level.set(pos, 'id', id);
			}
			else {
				var obj = this.createObject(group.type, id);
				this.addObject(obj, pos);				
			}
		}
	}

	pickPosition(type, location)
	{
  	var pos = null;

  	for (let i = 0; i < 10; i++) {
  		pos = this.level.find('floor').pickOne().value();
  		if (!this.level.get(pos, type == 'actors'? 'actor' : 'item')) return pos;
  	}

  	throw new Error('Cannot find free pos.');
	}

	addObject(obj, pos)
	{
  	var type = obj.is('actor')? 'actor' : 'item';
		this.level.set(pos, type, obj);
	}

	createObject(type, id)
	{
		switch (type) {
			case 'actors': return new Styx.actors.Monster({id: id});
			case 'items': return new Styx.items.Item({id: id});
			default: throw `Unknown entity ${type}`;
		}
	}

	drawXY(room, x, y, attrib, value)
	{
		throw new Error('Not implemented.');
	}

	drawAll()
	{
		for(let room of this.rooms) {
			room.draw(this.drawXY.bind(this));
		}
	}

}