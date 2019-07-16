var Styx = Styx || {};
Styx.levels = Styx.levels || {};

Styx.levels.RegularLevelBuilder = class extends Styx.levels.LevelBuilder
{
	constructor()
	{
		super();
		//this.roomCells = [];
		this.roomBuilder = new Styx.levels.RoomBuilder();
	}

	createLevel()
	{
		this.level.tiles = this.createTiles(this.level.size, 'wall');

		var first = new Styx.levels.Room('room13x5');
		var added = this.addToRandomPlace(first);
		if (added) this.addRoomsStream(first);

		var first = new Styx.levels.Room('room13x5');
		var added = this.addToRandomPlace(first);
		if (added) this.addRoomsStream(first);

		this.addConnections();

		// var first = new Styx.levels.Room('room13x5');
		// var added = this.addToRandomPlace(first);
		// if (added) this.addRoomsStream(first);

		//this.populate();

		this.drawAll();
		this.addStairs();

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
			var pos = rooms.pickOne().value().getPoint('random');
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
					var sideRoom = this.roomBuilder.make(null, {tag: 'room'});
					this.addNextRoom(room, sideRoom);
				}

				room = nextRoom;
			}
		};
	}

	addConnections()
	{
		var found = 0;
		var entrances = this.getFreeEntrances();
		for (let en of entrances) {
			var r = this.findNearRoom(en);
			if (r) {
				this.makeConnection(en, r);
				found++;
			}
		}

		console.log('freeent: ' + entrances.length + ' found rms: ' + found);

	}

	chooseNextRoom()
	{
		if (Styx.Random.bet(.4)) {
			return this.roomBuilder.make('corridor');
		}
		else if (Styx.Random.bet(.1)) {
			return this.roomBuilder.make(null, {tag: 'corridor'});
		}
		else {
			return this.roomBuilder.make(null, {tag: 'room'});
		}
	}

  drawXY(room, x, y, attrib, value)
  {
      this.level.setXY(x, y, attrib, value);
      //this.roomCells[y * this.level.size.width + x] = room;
  }

}