var Styx = Styx || {};
Styx.levels = Styx.levels || {};

Styx.levels.RegularLevelBuilder = class extends Styx.levels.LevelBuilder
{
	createLevel(id)
	{
		super.createLevel(id);

		if (this.level.is('arena')) {
			this.level.clear('floor');
		}
		else {
			this.level.clear('wall');			
		}

		// //broken level
		// for(let pos of this.level.size.coords()) {
		// 	if (Styx.Random.bet(.03)) this.level.set(pos, 'id', 'floor');
		// }

		this.splitRect(this.level.size);

		this.addNeighbours();
		
		this.addRooms(this.rooms[0], 18);
		this.addSecrets(_.sample(this.connected), 3);

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
		this.build();
		this.debugClick();
	
/*
		var spawner = new Styx.levels.Spawner(this, this.level.size);
		spawner.setBindings('common_bindings');
		spawner.spawn('rats');

		spawner.setRect(first.x,first.y,15,10);
		spawner.spawn('forest');
*/		

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
			start.addTag('room');
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

		for (let r of path) {
			this.populate(r);
		}
	}

	addPath(pos1, pos2)
	{
		var start = this.findRoomAt(pos1.x, pos1.y);
		if (!start) return;

		if (!start.isConnected()) {
			start.addTag('room');
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
			this.populate(start);
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

	debugClick()
	{
		$("body").on("click", (e) => {
			var p = $(e.target).data().pos.split(',');
			var pos = {x:Number(p[0]),y:Number(p[1])}
			var room = null;
			for (room of this.rooms) {
				if (room.isInsidePoint(pos.x, pos.y)) break;
			}

			console.log(room);

			// $('[data-pos="'+$(e.target).data().pos+'"]').css('color', 'green');

			// for (let r of room.neighbours) {
			// 	var pos = r.getPoint('center');
			// 	$('[data-pos="'+pos.x+','+pos.y+'"]').css('color', 'red');
			// 	console.log(r);
			// }

		});
	}


}