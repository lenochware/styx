var Styx = Styx || {};
Styx.levels = Styx.levels || {};

Styx.levels.RegularLevelBuilder = class extends Styx.levels.LevelBuilder
{
	createLevel(id)
	{
		super.createLevel(id);

		this.level.clear('wall');

		// //broken level
		// for(let pos of this.level.size.coords()) {
		// 	if (Styx.Random.bet(.03)) this.level.set(pos, 'id', 'floor');
		// }

		this.splitRect(this.level.size);

		this.addNeighbours();
		
		this.addRooms(20);

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

	addPath(pos1, pos2)
	{
		var start = this.findRoom(pos1.x, pos1.y);
		if (!start) return;

		if (!start.isConnected()) {
			start.addTag('room');
			this.connected.push(start);			
		}

		console.log(pos1, pos2);

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