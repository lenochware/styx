var Styx = Styx || {};
Styx.levels = Styx.levels || {};

Styx.levels.RegularLevelBuilder = class extends Styx.levels.LevelBuilder
{
	createLevel(id)
	{
		super.createLevel(id);
		
		this.level.clear('wall');

		this.areas = [];

		var first = new Styx.levels.FixedRoom('room13x5');
		var pos = this.level.size.getPoint('center');
		first.center(pos.x, pos.y);

		var a1 = this.addCrossRoad(first, 'cross1');
		this.addStream(a1.getOutsideDoor('north'), 's1');
		this.addStream(a1.getOutsideDoor('west'), 's2');
		this.addStream(a1.getOutsideDoor('east'), 's3');
		this.addStream(a1.getOutsideDoor('south'), 's4');

		for (let a of this.areas) {
			a.draw(this.level);
		}

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
		this.areas.push(area);

		area.addRoom(room);
		area.addLine(room, ['r1', 'r1', 'r1'], 'east');
		area.addLine(room, ['r1', 'r1', 'r1'], 'west');
		area.addLine(room, ['r1', 'r1'], 'north');
		area.addLine(room, ['r1', 'r1'], 'south');
		return area;
	}

	addStream(exit, id)
	{
		var area = new Styx.levels.Area(id);
		this.areas.push(area);
		var room = area.newRoom('corridor');
		area.addRoom(room, exit);
		area.addStream(room, ['corridor', 'r1', 'corridor', 'r3', 'corridor', 'r5']);

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