var Styx = Styx || {};
Styx.levels = Styx.levels || {};

Styx.levels.ArenaLevelBuilder = class extends Styx.levels.LevelBuilder
{
	constructor()
	{
		super();
		this.roomBuilder = new Styx.levels.RoomBuilder();
	}

	createLevel()
	{
		//game.dbgBuild = this;

		this.level.map = this.fillMap(this.level.size, 'floor');

		var first = new Styx.levels.Room('room13x5');

		var c = this.level.size.getPoint('center');
		this.add(first.center(c.x, c.y), null);

		var maxRooms = 20;

		while(maxRooms--)
		{
			var nextRoom = this.chooseNextRoom();
			var added = this.addNextRoom(nextRoom);
		};

		//this.populate();

		this.drawAll();

		return this.level;
	}

	addNextRoom(nextRoom)
	{
		var rndInt = this.game.random.int;
		nextRoom.move(rndInt(this.level.size.width), rndInt(this.level.size.height));
		nextRoom.align(this.level.size);
		this.rooms.push(nextRoom);
	}

	chooseNextRoom(room)
	{
		return this.roomBuilder.make(null, {tag: 'room'});
	}

	drawXY(room, x, y, attrib, value)
	{
		this.level.setXY(x, y, attrib, value);
		//this.roomCells[y * this.level.size.width + x] = room;
	}

}