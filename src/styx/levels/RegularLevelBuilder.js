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
		this.addStream('first', this.rooms[0]);
		this.addSecrets('zzz', 10);
		this.build();
		console.log(this.streams);
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

	addSecrets(id, n)
	{
		var secrets = [];

		for (let i = 0; i < n; i++) {
			var room = _.sample(_.sample(this.streams));
			var nb = room.freeNeighbours();
			if (nb.length == 0) continue;
			var next = nb[0];
			
			room.addDoor(next);
			next.addTag('secret');
			next.addTag('room');
			next.streamId = id;
			secrets.push(next);
		}

		this.streams.push(secrets);
	}

	// addRoomTo(room)
	// {
	// 	var nb = room.freeNeighbours();
	// 	if (nb.length == 0) return null;
	// 	var next = nb[0];
	// 	room.addDoor(next);
	// 	return next;
	// }

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