var Styx = Styx || {};
Styx.levels = Styx.levels || {};

Styx.levels.RegularLevelBuilder = class extends Styx.levels.LevelBuilder
{
	createLevel(id)
	{
		super.createLevel(id);

		this.initParams();

		this.splitRect(this.level.size);
		this.addNeighbours();
	
		this.addPaths('o');

	  var connectedPercent = this.connected.length /  this.rooms.length;

		// this.addRooms(this.rooms[0], 18);
		// this.addSecrets(_.sample(this.connected), 3);

		this.addTags();
		this.addDependencies();

		if (this.level.is('arena')) {
			this.addBorders();
			this.connectArena();
		}

		this.addStairs();
		this.paint();
		this.debugClick();	

		return this.level;
	}

	initParams()
	{
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
	}

	addPaths(id)
	{
		var rect = this.level.size;
		var pts = [
				rect.getPoint('center'),
				rect.getPoint('corner-1'),
				rect.getPoint('corner-2'),
				rect.getPoint('corner-3'),
				rect.getPoint('corner-4'),
				rect.getPoint('center-1'),
				rect.getPoint('center-2'),
				rect.getPoint('center-3'),
				rect.getPoint('center-4')
		];

		//console.log(pts);

		if (id == 'x') {
			this.addPath(pts[1], pts[3]);
			this.addPath(pts[2], pts[4]);
		}
		else if (id == '+') {
			this.addPath(pts[5], pts[7]);
			this.addPath(pts[6], pts[8]);
		}
		else if (id == 'o') {
			this.addPath(pts[1], pts[2]);
			this.addPath(pts[2], pts[3]);
			this.addPath(pts[3], pts[4]);
			this.addPath(pts[4], pts[1]);
		}
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

	connectArena()
	{
		for (let room of this.connected) {
			for(let nb of room.neighbours) {				
				if (!nb.isConnected()) {
					if (Styx.Random.bet(.5)) {
						room.addDoor(nb, this.params.door_type);
					}
					break;
				}
			}
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
			var next = start.neighbours[0];
			for (let nb of start.neighbours) {
				if (nb.distance(pos2) < next.distance(pos2)) {
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