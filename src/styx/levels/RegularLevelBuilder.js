var Styx = Styx || {};
Styx.levels = Styx.levels || {};

Styx.levels.RegularLevelBuilder = class extends Styx.levels.LevelBuilder
{
	createLevel(id)
	{
		super.createLevel(id);

		this.debugDraw = false;
		
		this.level.clear('wall');

		var first = new Styx.levels.Room(13,5);
		var pos = this.level.size.getPoint('center');
		first.center(pos.x, pos.y);

		var a1 = this.addCrossRoad(first, 'cross1');
		this.addStream(a1.getOutsideDoor('north'), 's1');
		this.addStream(a1.getOutsideDoor('west'), 's2');
		this.addStream(a1.getOutsideDoor('east'), 's3');
		this.addStream(a1.getOutsideDoor('south'), 's4');

		this.addSecrets();

		this.area.draw();

		this.cleanUp();

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
		var area = new Styx.levels.Area(this, id);

		area.addRoom(room);
		area.addLine(room, ['room-5x5', 'room-5x5', 'room-5x5'], 'east');
		area.addLine(room, ['room-5x5', 'room-5x5', 'room-5x5'], 'west');
		area.addLine(room, ['room-5x5', 'room-5x5'], 'north');
		area.addLine(room, ['room-5x5', 'room-5x5'], 'south');

		this.area.addArea(area);
		return area;
	}

	addStream(exit, id)
	{
		var area = new Styx.levels.Area(this, id);
		var room = area.newRoom('corridor');
		area.addRoom(room, exit);
		area.addStream(room, ['corridor', 'r1', 'corridor', 'r3', 'corridor', 'r5'], exit.side);

		this.area.addArea(area);
		return area;
	}

	addSecrets()
	{
		//var area = new Styx.levels.Area(this, 'secret');
		this.area.onAdd(r => r.addTag('secret'));

		this.area.addRandom(['r6', 'r6', 'r6'], false);

		this.area.onAdd(null);
		
		// this.area.addArea(area);
		// return area;
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