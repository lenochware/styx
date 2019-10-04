var Styx = Styx || {};
Styx.levels = Styx.levels || {};

Styx.levels.RegularLevelBuilder = class extends Styx.levels.LevelBuilder
{
	createLevel(id)
	{
		super.createLevel(id);

		this.level.clear('wall');
		this.splitRect(this.level.size);

		this.addNeighbours();
		
		//this.addRooms(20);
		this.addPath(this.rooms[0], {x:70,y:25});

		this.build();
		console.log(this.streams, this.rooms.length);
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

	// addLoops(stream, n)
	// {
	// 	for(let room of _.shuffle(stream)) {
	// 		if (n <= 0) return;

	// 		for (let next of room.neighbours) {
	// 			if (!next.isFree() && !room.isConnected(next)) {
	// 				room.addDoor(next);
	// 				n--;
	// 				break;
	// 			}
	// 		}
	// 	}
	// }

	addRooms(n)
	{

		var start = _.sample(this.rooms);
		var next = _.sample(start.neighbours);

		start.addTag('room');
		this.connected.push(start);

		for(let i = 0; i < n; i++) {

			while(next.isConnected()) {
				start = _.sample(this.connected);
				next = _.sample(start.neighbours);
			}

			//console.log(start, next);

			this.connect(start, next);
			this.populate(start);
		}
	}

	addPath(start, pos)
	{
		start.addTag('room');
		this.connected.push(start);

		while (true) {
			var next = null;
			for (let nb of start.neighbours) {
				if (!next || next.distance(pos) > nb.distance(pos)) {
					next = nb;
				}
			}
			if (start.distance(pos) <= next.distance(pos)) return;

			this.connect(start, next);
			this.populate(start);
			start = next;
		}
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