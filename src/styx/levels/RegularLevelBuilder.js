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
		this.build();
		console.log(this.streams);
	
/*
		var spawner = new Styx.levels.Spawner(this, this.level.size);
		spawner.setBindings('common_bindings');
		spawner.spawn('rats');

		spawner.setRect(first.x,first.y,15,10);
		spawner.spawn('forest');
*/		

		return this.level;
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


}