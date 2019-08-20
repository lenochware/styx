var Styx = Styx || {};
Styx.levels = Styx.levels || {};

Styx.levels.RegularLevelBuilder = class extends Styx.levels.LevelBuilder
{
	createLevel(id)
	{
		super.createLevel(id);
		
		this.level.clear('wall');

		var first = new Styx.levels.FixedRoom('room13x5');
		var pos = this.level.size.getPoint('center');
		first.center(pos.x, pos.y);

		var areas = [];

		areas.push(this.addCrossRoad(first, 'cross1'));


		this.rooms.push(...areas[0].rooms);
		areas[0].draw(this.level);

		// var d = area.getOutsideDoor('south');
		// console.log(d);
		// this.level.set(d.getPos(), 'id', 'high_grass');


		// if (layout == 1) {
		// 	var pos = this.level.size.getPoint('center-4');
		// 	first.center(pos.x, pos.y).align(this.level.size);
		// 	area.addRoom(first);
		// 	area.addLine(first, ['corridor', 'r1', 'corridor', 'r3', 'corridor', 'r5'], 'east');
		// }
		// else if (layout == 2) {
		// 	var pos = this.level.size.getPoint('center');
		// 	first.center(pos.x, pos.y).align(this.level.size);
		// 	area.addRoom(first);
		// 	area.addLine(first, ['r1', 'r1', 'r1'], 'east');
		// 	area.addLine(first, ['r1', 'r1', 'r1'], 'west');
		// 	area.addLine(first, ['r1', 'r1'], 'north');
		// 	area.addLine(first, ['r1', 'r1'], 'south');
		// }
		// else if (layout == 3) {
		// 	var pos = this.level.size.getPoint('center');
		// 	first.center(pos.x, pos.y).align(this.level.size);
		// 	area.addRoom(first);
		// 	area.addLine(first, ['room13x5'], 'east');
		// 	area.addLine(_.last(area.rooms), ['room13x5'], 'south');
		// 	area.addLine(_.last(area.rooms), ['room13x5'], 'west');
		// 	_.last(area.rooms).getDoorBySide('north').connect(first);
			
		// 	//this.makeConnection(first.getDoorBySide('south'), next);
		// }

		// else if (layout == 4) {
		// 	var pos = this.level.size.getPoint('center-4');
		// 	first.center(pos.x, pos.y).align(this.level.size);
		// 	area.addRoom(first);
		// 	area.addLine(first, ['corridor', 'corridor', 'corridor', 'corridor', 'corridor'], 'east');
			
		// 	area.addLine(area.rooms[1], ['small-pillar-room'], 'south');
		// 	area.addLine(area.rooms[1], ['small-pillar-room'], 'north');

		// 	area.addLine(area.rooms[3], ['small-pillar-room'], 'south');
		// 	area.addLine(area.rooms[3], ['small-pillar-room'], 'north');

		// 	area.addRandom(['r2', 'r2', 'r2']);
		// }
		// else if (layout == 5) {
		// 	var pos = this.level.size.getPoint('center');
		// 	first.center(pos.x, pos.y).align(this.level.size);

		// 	area.addRoom(first);
		// 	area.addStream(first, ['corridor', 'r1', 'corridor', 'r3', 'corridor', 'r5']);
		// 	//area.addStream(first, ['corridor', 'corridor', 'corridor', 'corridor', 'corridor', 'corridor','corridor', 'corridor', 'corridor']);
		// }


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

	addCrossRoad(room, id)
	{
		var area = new Styx.levels.Area(id);
		area.addRoom(room);
		area.addLine(room, ['r1', 'r1', 'r1'], 'east');
		area.addLine(room, ['r1', 'r1', 'r1'], 'west');
		area.addLine(room, ['r1', 'r1'], 'north');
		area.addLine(room, ['r1', 'r1'], 'south');
		return area;
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