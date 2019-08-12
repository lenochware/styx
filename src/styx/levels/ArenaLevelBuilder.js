var Styx = Styx || {};
Styx.levels = Styx.levels || {};

Styx.levels.ArenaLevelBuilder = class extends Styx.levels.LevelBuilder
{
	createLevel(id)
	{
		super.createLevel(id);
		
		this.level.clear('floor');

		var first = new Styx.levels.FixedRoom('room13x5');

		var c = this.level.size.getPoint('center');
		this.add(first.center(c.x, c.y), null);

		var maxRooms = this.level.getAttrib('max-rooms', 20);

		while(maxRooms--)
		{
			var nextRoom = this.chooseNextRoom();
			var added = this.addNextRoom(nextRoom);
		};

		//this.populate();

		this.drawAll();
		this.addStairs();

		return this.level;
	}

	addStairs()
	{
		var rooms = this.findRoom('room');

		var exits = this.level.getAttrib('exits');
		for (let exit of exits) {
			var pos = rooms.sample().value().getPoint('random');
			this.addExit(pos, exit);
		}
	}

	addNextRoom(nextRoom)
	{
		nextRoom.move(Styx.Random.int(this.level.size.width), Styx.Random.int(this.level.size.height));
		nextRoom.align(this.level.size);
		this.rooms.push(nextRoom);
	}

	chooseNextRoom(room)
	{
		return this.createRoom(null, {tag: 'room'});
	}

	drawXY(room, x, y, attrib, value)
	{
		this.level.setXY(x, y, attrib, value);
		//this.roomCells[y * this.level.size.width + x] = room;
	}

}