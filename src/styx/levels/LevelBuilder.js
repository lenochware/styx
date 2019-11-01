var Styx = Styx || {};
Styx.levels = Styx.levels || {};

/**
 * Base class for any level builder.
 * Method createLevel() will create and return Level object by its definition in world/.../levels.js.
 */
Styx.levels.LevelBuilder = class
{
	constructor()
	{
		this.game = game;
		this.level = null;
		this.rooms = [];
		this.connected = [];
		this.dependencies = null;

		this.params = {
			room_max_size: 15,
			big_rooms_ratio: 0.03,
			corridor_ratio: 0.5,
			door_type: 'door'
		}
	}

	createLevel(id)
	{
		this.level = new Styx.levels.Level(id);

		if (this.level.is('small')) {
			this.level.size.assign(0 , 0, 40, 15);
		}
		else if (this.level.is('large')) {
			this.level.size.assign(0 , 0, 198, 66);			
		}

		return this.level;
	}

	splitRect(r)
	{
		var min = Math.min(r.width, r.height);
		var max = Math.max(r.width, r.height);

		if ((min < 5 || max < 8 || Styx.Random.bet(this.params.big_rooms_ratio)) && max <= this.params.room_max_size) {
			var room = new Styx.levels.Room(this.level, r.x, r.y, r.width - 1, r.height - 1);
			this.rooms.push(room);
			return;
		}

		//console.log(r.width, r.height);

		if (r.height * 1.5 < r.width) {

			var rs = r.splitX(Styx.Random.int(4, r.width - 4));
		}
		else {
			var rs = r.splitY(Styx.Random.int(4, r.height - 4));
		}

		this.splitRect(rs[0]);
		this.splitRect(rs[1]);
	}

	addNeighbours()
	{
		for (let i=0; i < this.rooms.length-1; i++) {
			for (let j=i+1; j < this.rooms.length; j++) {
				this.rooms[i].addNeighbour( this.rooms[j] );
			}
		}
	}

	addExit(room, exit)
	{
		room.addTag('exit');
		var pos = room.getPoint('random');
		this.level.exits[pos.x + ',' + pos.y] = {id: exit.id, pos: pos, tile: exit.tile};
	}

	connect(room, next)
	{
		if (!next.isConnected()) {
			this.connected.push(next);
		}

		if (!room.isConnectedWith(next)) {
			room.addDoor(next, this.params.door_type);
		}
	}

	addTags()
	{
		for (let room of this.connected) {
			if (Styx.Random.bet(this.params.corridor_ratio) && room.doors.length > 1) {
				room.addTag('corridor');
			}
			else {
				room.addTag('room');
			}

			if (room.doors.length == 1) room.addTag('dead-end');
			if (room.doors.length > 2) room.addTag('crossroad');

			if (room.size() <= 20) room.addTag('small');
			else if (room.size() < 50) room.addTag('large');
			else room.addTag('huge');
		}
	}

	addDependencies()
	{
		for (let i =0; i < 3 /*generations*/; i++) {
			for (let room of this.connected) {
				var tags = room.params.new_tags || room.params.tags;
				var deps = this.computeDeps(tags);
				
				room.params.new_tags = this.computeTags(deps);
				room.params.tags = _.union(room.params.tags, room.params.new_tags);

				//console.log(deps, room.params.tags);
			}
			//console.log('---');
		}

	}

	computeDeps(tags) {
		var aku = {};

		if (!this.dependencies) {
			this.dependencies = this.level.getAttrib('dependencies');
		}

		for (let tag of tags) {
			var deps = this.dependencies[tag];
			if (!deps) continue;
			for (let k in deps) {
				aku[k] = (aku[k] == null)? deps[k] : aku[k] + deps[k];
			}
		}

		return aku;
	}

	computeTags(deps)
	{
		var tags = [];
		
		for (let k in deps) {
			if (deps[k] <= 0) continue;
			if (Math.random() < deps[k]) tags.push(k); //aku > 1? multiplier
		}

		return tags;
	}

	paint()
	{
		let painter = new Styx.levels.Painter(this);

		for (let room of this.connected) {
			painter.paint(room);
		}

		for (let exit of _.values(this.level.exits)) {
			this.level.set(exit.pos, 'id', exit.tile);
		}

		//painter.paintFeature(this.level.size, "forest");
	}

	findRoomAt(x,y)
	{
		for (let room of this.rooms) {
			if (x >= room.x && y >= room.y && x <= room.x + room.width && y <= room.y + room.height) {
				return room;
			};
		}
		return null;
	}

	findAll(tag)
	{
		var found = [];

		for (let room of this.connected) {
			if (room.is(tag)) found.push(room);
		}

		return found;
	}

	getRandomId(category, tag, lvl)
	{
		var list = this.game.db.find(category, tag).value();
		var chances = _.map(list, obj => obj.lvl? 1 / (Math.pow(obj.lvl - lvl, 2) + 1) : 1);
		var obj = Styx.Random.pick(list, chances);
		return obj.id;
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