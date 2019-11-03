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

		// //o---o layout
		// this.addRooms(this.rooms[0], 10, null, true);
		// this.addRooms(this.findRoomAt(79, 20), 10, null, true);

		// this.addPath({x:0,y:0}, {x:79,y:20}, (r) => {
		// 	if (r.x > 20 && r.x < 50)	r.addTag('corridor');
		// });
	
		this.addPaths('+');

	  var filled = this.percentFilled();

	  // if (filled < 0.6) {
	  // 	var n = Math.floor((0.6 - filled) * this.rooms.length);
	  // 	var first = _.sample(this.connected);
	  // 	this.addRooms(first, n);
	  // }

	  // this.addSecrets();

		this.addArena(new Styx.levels.Room(this.level, 40,0,40,20));

		this.addTags();
		this.addDependencies();

		// if (this.level.is('arena')) {
		// 	this.addBorders(this.connected);
		// 	this.connectArena(this.connected);
		// }

		this.addStairs();
		this.paint();
		this.debugClick();	

		return this.level;
	}

	addArena(arena)
	{
		arena.fill('blood_floor');

		var intersect = [];
		var inside = [];
		var insideConnected = [];

		for (let r of this.rooms) {
			if (r.intersect(arena)) {
				if (r.inside(arena)) {
					inside.push(r); 
					if (r.isConnected()) insideConnected.push(r); 
				}
				else {
					intersect.push(r);
				}
			}
		}

		//clean up
		this.connected = _.difference(this.connected, insideConnected);

		//add rooms
		// for (let r of inside) {
		// 	if (Styx.Random.bet(.2)) {
		// 		intersect.push(r);
		// 		this.connected.push(r);
		// 	}
		// }

		//manage border rooms
		this.addBorders(intersect);
		this.connectArena(intersect);


		//console.log(intersect, inside);

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

	percentFilled()
	{
		return this.connected.length /  this.rooms.length;
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

	addSecrets()
	{
	  var n = _.random(0, 4);

	  if (!n) return;

	  var first = _.sample(this.connected);
		this.addRooms(first, n, r => r.addTag('secret'));
	}

	addBorders(rooms)
	{
		for (let room of rooms) {
			room.clone().expand(1,1).fill('wall');
		}
	}

	connectArena(rooms)
	{
		for (let room of rooms) {
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

	addRandom(n) {
		for(let i = 0; i < n; i++) {
			var room = null;
			for (let j = 0; j < 10; j++) {
				room = _.sample(this.rooms);
				if (!room.isConnected()) break;
			}
			if (!room) return;

			this.connected.push(room);
			for (let nb of room.neighbours) {
				if (nb.isConnected()) this.connect(room, nb);
			}
		}
	}

	addRooms(start, n, f = null, local = false)
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
				start = _.sample(local? path : this.connected);
				next = _.sample(start.neighbours);
				if (++tried > 20) break main;
			}

			this.connect(start, next);
			path.push(next);
			if (f) f(next);
		}
	}

	addPath(pos1, pos2, f = null)
	{
		var start = this.findRoomAt(pos1.x, pos1.y);
		if (!start) return;

		if (!start.isConnected()) {
			this.connected.push(start);
			if (f) f(start);
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
			if (f) f(next);				
			
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