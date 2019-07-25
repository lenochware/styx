var Styx = Styx || {};
Styx.levels = Styx.levels || {};

Styx.levels.RegularLevelBuilder = class extends Styx.levels.LevelBuilder
{
	createLevel(id)
	{
		super.createLevel(id);
		
		this.level.tiles = this.createTiles(this.level.size, 'wall');

		var first = new Styx.levels.Room(13, 5);
		var added = this.addToRandomPlace(first);
		if (added) this.addRoomsStream(first);

		var first = new Styx.levels.FixedRoom('room13x5');
		var added = this.addToRandomPlace(first);
		if (added) this.addRoomsStream(first);

		this.addConnections();

		// var first = new Styx.levels.FixedRoom('room13x5');
		// var added = this.addToRandomPlace(first);
		// if (added) this.addRoomsStream(first);

		//this.populate();

		this.drawAll();
		this.addStairs();

		var spawner = new Styx.levels.Spawner(this, this.level.size);
		spawner.spawn('rats');

		return this.level;
	}

	addSecrets() {}
	addBoss() {}
	addGoals() {}
	addBadPlace() {}

	addStairs()
	{
		var rooms = this.findRoom('room');

		var exits = this.level.getAttrib('exits');
		for (let exit of exits) {
			var pos = rooms.sample().value().getPoint('random');
			this.addExit(pos, exit);
		}
	}

	addRoomsStream(room)
	{
		var maxRooms = 40;

		while(maxRooms--)
		{
			var nextRoom = this.chooseNextRoom();
			var added = this.addNextRoom(room, nextRoom);
			if (added) { 

				if (Styx.Random.bet(.2)) {
					var sideRoom = this.createRoom(null, {tag: 'room'});
					this.addNextRoom(room, sideRoom);
				}

				room = nextRoom;
			}
		};
	}

	addConnections()
	{
		var found = 0;
		var doors = this.getFreeDoors();
		for (let door of doors) {
			var r = this.findNearRoom(door);
			if (r) {
				this.makeConnection(door, r);
				found++;
			}
		}

		console.log('freeent: ' + doors.length + ' found rms: ' + found);

	}

	chooseNextRoom()
	{
		if (Styx.Random.bet(.4)) {
			return this.createRoom('corridor');
		}
		else if (Styx.Random.bet(.1)) {
			return this.createRoom(null, {tag: 'corridor'});
		}
		else {
			return this.createRoom(null, {tag: 'room'});
		}
	}

  drawXY(room, x, y, attrib, value)
  {
      this.level.setXY(x, y, attrib, value);
      //this.roomCells[y * this.level.size.width + x] = room;
  }

}