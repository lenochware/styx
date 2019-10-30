var Styx = Styx || {};
Styx.levels = Styx.levels || {};

Styx.levels.RegularLevelBuilder = class extends Styx.levels.LevelBuilder
{
	createLevel(id)
	{
		super.createLevel(id);

		var baseTile = this.level.getAttrib('base-tile');

		if (baseTile) {
			this.level.clear(baseTile);
		}
		else if (this.level.is('arena')) {
			this.level.clear('floor');
		}
		else {
			this.level.clear('wall');
		}

		if (this.level.is('broken')) {
			for(let pos of this.level.size.coords()) {
				if (Styx.Random.bet(.03)) this.level.set(pos, 'id', 'floor');
			}
		}

		if (this.level.is('lot-of-corridors')) {
			this.params.corridor_ratio = 0.95;
		}
		else if (this.level.is('no-corridors')) {
			this.params.corridor_ratio = 0;			
		}

		if (this.level.is('big-rooms')) {
			this.params.big_rooms_ratio = 0.2;
		}

		if (this.level.is('huge-rooms')) {
			this.params.room_max_size = 35;
		}

		this.splitRect(this.level.size);
		this.addNeighbours();
		
		this.addRooms(this.rooms[0], 18);
		this.addSecrets(_.sample(this.connected), 3);
		this.addTags();
		this.addDependencies();

		// // X
		// this.addPath({x:1,y:1}, {x:70,y:25});
		// this.addPath({x:70,y:1}, {x:1,y:25});

		// // +
		// this.addPath({x:40,y:1}, {x:40,y:30});
		// this.addPath({x:1,y:15}, {x:80,y:15});

		// // O
		// this.addPath({x:1,y:1}, {x:78,y:1});
		// this.addPath({x:78,y:1}, {x:78,y:28});
		// this.addPath({x:78,y:28}, {x:1,y:28});
		// this.addPath({x:1,y:28}, {x:1,y:1});


		if (this.level.is('arena')) {
			this.addBorders();
		}

		this.addStairs();
		this.paint();
		this.debugClick();	

		return this.level;
	}

	addSecrets(start, n)
	{
		this.addRooms(start, n, r => r.addTag('secret'));
	}

	addBorders()
	{
		for (let room of this.connected) {
			room.clone().expand(1,1).fill('wall');
		}
	}

	addRooms(start, n, f = null)
	{
		var path = [];

		if (!start.isConnected()) {
			this.connected.push(start);
			if (f) f(start);
		}

		path.push(start);

		var next = _.sample(start.neighbours);

		main:
		for(let i = 0; i < n; i++) {

			var tried = 0;

			while(next.isConnected()) {
				start = _.sample(this.connected);
				next = _.sample(start.neighbours);
				if (++tried > 20) break main;
			}

			this.connect(start, next);
			path.push(next);
			if (f) f(next);
		}
	}

	addPath(pos1, pos2)
	{
		var start = this.findRoomAt(pos1.x, pos1.y);
		if (!start) return;

		if (!start.isConnected()) {
			this.connected.push(start);			
		}

		while (true) {
			var next = null;
			for (let nb of start.neighbours) {
				if (!next || next.distance(pos2) > nb.distance(pos2)) {
					next = nb;
				}
			}
			if (start.distance(pos2) <= next.distance(pos2)) return;

			this.connect(start, next);
			start = next;
		}
	}

	addStairs()
	{
		var rooms = this.findAll('room');

		var exits = this.level.getAttrib('exits');
		for (let exit of exits) {
			var room = _.sample(rooms);
			this.addExit(room, exit);
		}
	}

}