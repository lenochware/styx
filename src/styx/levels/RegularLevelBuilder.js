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

		// $("body").on("click", (e) => {
		// 	var p = $(e.target).data().pos.split(',');
		// 	var pos = {x:Number(p[0]),y:Number(p[1])}
		// 	var room = null;
		// 	for (room of this.rooms) {
		// 		if (room.isInsidePoint(pos.x, pos.y)) break;
		// 	}

		// 	console.log('room', room, 'nbs');

		// 	$('[data-pos="'+$(e.target).data().pos+'"]').css('color', 'green');

		// 	for (let r of room.neighbours) {
		// 		var pos = r.getPoint('center');
		// 		$('[data-pos="'+pos.x+','+pos.y+'"]').css('color', 'red');
		// 		console.log(r);
		// 	}

		// });
		
		//console.log(this.rooms);

		for(let room of this.rooms) {
			room.fill('floor');
		}

		this.buildPath(this.rooms[0]);


		for(let room of this.rooms) {
			if (room.doors.length == 0) room.fill('null');
		}
	
/*
		var spawner = new Styx.levels.Spawner(this, this.level.size);
		spawner.setBindings('common_bindings');
		spawner.spawn('rats');

		spawner.setRect(first.x,first.y,15,10);
		spawner.spawn('forest');
*/		

		return this.level;
	}


	buildPath(room)
	{
		var next = null;

		while (true) {
			for (next of _.sample(room.neighbours, 3)) {
				if (next.doors.length == 0) break;
			}

			if (next.doors.length > 0) break;

			var p = room.getPortal(next).getPoint('random');
			this.level.set(p, 'id', 'door');
			room.addDoor(next, p);

			//corridor
			if (Styx.Random.bet(.5) && room.doors.length > 1) {
				this.drawCorridor(room, room.doors[0], room.doors[1]);
			}

			room = next;			
		}
	}

	drawCorridor(room, d1, d2)
	{
		room.fill('wall');
		room.addTag('corridor');

		//class Point?
		var p1 = {x: d1.pos.x - d1.dir.x, y: d1.pos.y - d1.dir.y };
		var p2 = {x: d2.pos.x - d2.dir.x, y: d2.pos.y - d2.dir.y };

		var borders = room.getBorderPoints();
		borders = borders.concat(borders);
		if (Styx.Random.bet(.5)) {
			borders = borders.reverse();
		}


		var tile = 'wall';

		for (let pos of borders)
		{
			this.level.set(pos, 'id', tile);

			if ((pos.x != p1.x || pos.y != p1.y) 
				&& (pos.x != p2.x || pos.y != p2.y)) {
					continue;
				}

			if (tile == 'wall') {
				tile = 'floor';
				this.level.set(pos, 'id', tile);
			}
			else {
				break;
			}
		}

		//no doors between corridors
		var x = room.doors[0];
		if (x && x.room.is('corridor')) {
			this.level.set(x.pos, 'id', 'floor');
		}
	}

	addSecrets()
	{
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

}