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

		this.level.size.alignOf(first, 0.5, 0.5);

		// var pos = this.level.size.getPoint('center');
		// first.center(pos.x, pos.y);

		//var a1 = this.addCrossRoad(first, 'cross1');

		var a1 = this.addMaze(first);


		// this.addStream(a1.getOutsideDoor('north'), 's1');
		// this.addStream(a1.getOutsideDoor('west'), 's2');
		// this.addStream(a1.getOutsideDoor('east'), 's3');
		// this.addStream(a1.getOutsideDoor('south'), 's4');


		// var area = new Styx.levels.Area(this, id);
		// area.addRoom(new Styx.levels.Room(8,8).move(5,3));
		// area.addLine(area.rooms[0], [
		// 	'c1', 'c1', 'r1', 
		// 	'c1', 'c1', 'r1', 
		// 	'c1', 'c1', 'r1', 
		// 	'c1', 'c1', 'r1', 
		// 	'c1', 'c1', 'r1'], 'east');
		// this.area.addArea(area);		

		this.addSecrets();

		this.area.draw();

		//this.cleanUp();


		// var spawner = new Styx.levels.Spawner(this, this.level.size);
		// var br = a1.getBorderRooms();
		// for (let i in br) {
		// 	spawner.rect = br[i];
		// 	console.log(spawner.rect);
		// 	spawner.transform({'floor': 'blood_floor'});
		// }

		//this.addStairs();

/*
		var spawner = new Styx.levels.Spawner(this, this.level.size);
		spawner.setBindings('common_bindings');
		spawner.spawn('rats');

		spawner.setRect(first.x,first.y,15,10);
		spawner.spawn('forest');
*/		

		return this.level;
	}

	addCrossRoad(room, id)
	{
		var area = new Styx.levels.Area(this, id);

		var lines = [
			['r-5x5', 'r-5x5', 'r-5x5'],
			['r-5x5', 'm-9x9', 'r-5x5'],
			['r1', 'r1', 'r1'],
			['r1', 'c2', 'c2', 'r1', 'c2', 'r1'],
			['r-5x5', 'r-6x5', 'r-7x5', 'r6'],
			['r-5x5', 'r-5x5', 'r1', 'r-5x5']
		];

		area.addRoom(room);

		area.addLine(room, _.sample(lines), 'east');
		area.addLine(room, _.sample(lines), 'west');
		area.addLine(room, _.sample(lines), 'north');
		area.addLine(room, _.sample(lines), 'south');

		// area.addLine(room, ['r-5x5', 'r-5x5', 'r-5x5'], 'east');
		// area.addLine(room, ['r-5x5', 'r-5x5', 'r-5x5'], 'west');
		// area.addLine(room, ['r-5x5', 'r-5x5'], 'north');
		// area.addLine(room, ['r-5x5', 'r-5x5'], 'south');

		this.area.addArea(area);
		return area;
	}

	addStream(exit, id)
	{
		var area = new Styx.levels.Area(this, id);
		var room = area.newRoom('c1');
		area.addRoom(room, exit);
		area.addStream(room, ['c1', 'r-5x5', 'c1', 'r-7x5', 'c1', 'r5'], exit.side);

		this.area.addArea(area);
		return area;
	}

	addMaze(room)
	{
		this.level.size.alignOf(room, 0, 0.5);
		var area = new Styx.levels.Area(this, 'maze');
		area.addRoom(room);
		area.addLine(room, ['m-16x8','r-16x8','m-16x8'], 'east');
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