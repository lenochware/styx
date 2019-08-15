var Styx = Styx || {};
Styx.levels = Styx.levels || {};

Styx.levels.RegularLevelBuilder = class extends Styx.levels.LevelBuilder
{
	createLevel(id)
	{
		super.createLevel(id);
		
		this.level.clear('wall');

		var layout = 4;

		var first = new Styx.levels.FixedRoom('room13x5');

		if (layout == 1) {
			var pos = this.level.size.getPoint('center-4');
			first.center(pos.x, pos.y).align(this.level.size);
			this.add(first);
			this.addRoomsLine(first, ['corridor', 'r1', 'corridor', 'r3', 'corridor', 'r5'], 'east');			
		}
		else if (layout == 2) {
			var pos = this.level.size.getPoint('center');
			first.center(pos.x, pos.y).align(this.level.size);
			this.add(first);
			this.addRoomsLine(first, ['r1', 'r1', 'r1'], 'east');
			this.addRoomsLine(first, ['r1', 'r1', 'r1'], 'west');
			this.addRoomsLine(first, ['r1', 'r1'], 'north');
			this.addRoomsLine(first, ['r1', 'r1'], 'south');
		}
		else if (layout == 3) {
			var pos = this.level.size.getPoint('center');
			first.center(pos.x, pos.y).align(this.level.size);
			this.add(first);
			var line = this.addRoomsLine(first, ['room13x5'], 'east');
			line = this.addRoomsLine(_.last(line), ['room13x5'], 'south');
			line = this.addRoomsLine(_.last(line), ['room13x5'], 'west');
			_.last(line).getDoorBySide('north').connect(first);
			//this.makeConnection(first.getDoorBySide('south'), next);
		}

		else if (layout == 4) {
			var pos = this.level.size.getPoint('center-4');
			first.center(pos.x, pos.y).align(this.level.size);
			this.add(first);
			var line = this.addRoomsLine(first, ['corridor', 'corridor', 'corridor', 'corridor', 'corridor'], 'east');
			
			this.addRoomsLine(line[1], ['small-pillar-room'], 'south');
			this.addRoomsLine(line[1], ['small-pillar-room'], 'north');

			this.addRoomsLine(line[3], ['small-pillar-room'], 'south');
			this.addRoomsLine(line[3], ['small-pillar-room'], 'north');
		}

		var colis = new Styx.levels.FixedRoom('r5');
		colis.move(20,11);
		this.add(colis);

		// var first = new Styx.levels.Room(13, 5);
		// var added = this.addToRandomPlace(first);
		// if (added) this.addRoomsStream(first);

		// var first = new Styx.levels.FixedRoom('room13x5');
		// var added = this.addToRandomPlace(first);
		// if (added) this.addRoomsStream(first);

		// this.addConnections();

		this.drawAll();
		//this.addStairs();

/*
		var spawner = new Styx.levels.Spawner(this, this.level.size);
		spawner.setBindings('common_bindings');
		spawner.spawn('rats');

		spawner.setArea(first.x,first.y,15,10);
		spawner.spawn('forest');
*/
		return this.level;
	}

	addRoomsLine(first, rooms, side)
	{
		var line = [];
		var exit = first.getDoorBySide(side);

		for(let id of rooms) {
			var room = this.createRoom(id);
			exit.alignRoom(room);
			this.add(room, exit);
			exit = room.getDoorBySide(side);
			line.push(room);
		}

		return line;
	}

	// addSecrets() {}
	// addBoss() {}
	// addGoals() {}
	// addBadPlace() {}

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
  }

}