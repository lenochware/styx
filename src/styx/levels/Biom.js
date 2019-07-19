var Styx = Styx || {};
Styx.levels = Styx.levels || {};

Styx.levels.Biom = class
{
	constructor(level, rooms, id, size)
	{
		this.game = game;
		this.data = this.game.db.getObject('bioms', id);
		this.level = level;
		this.rooms = rooms;
		this.size = size;
	}

	addObjectGroup(group)
	{
		var count = Styx.Random.int(group.count[0], group.count[1]);

		while (count--) {
			var id = group.list[Styx.Random.chances(group.chances)];
			var pos = this.pickPosition(group.type, group.location);

			if (group.type == 'tiles') {
				this.level.set(pos, 'id', id);
			}
			else {
				var obj = this.createObject(group.type, id);
				this.addObject(obj, pos);				
			}
		}
	}

	findRoom(tag)
	{
		return _.chain(this.rooms).filter(obj => obj.is(tag));
	}

	addSpecialRooms(group)
	{
		var rooms = this.findRoom('room').sample(4).value();

		for (let i in group.list) {
			if (!Styx.Random.bet(group.chances[i])) continue;
			this.addSpecialRoom(this.data[group.list[i]]);
		}
	}

	addSpecialRoom(group)
	{

	}

	pickPosition(type, location)
	{
  	var pos = null;

  	for (let i = 0; i < 10; i++) {
  		pos = this.level.find('floor').sample().value();
  		if (!this.level.get(pos, type == 'actors'? 'actor' : 'item')) return pos;
  	}

  	throw new Error('Cannot find free pos.');
	}

	addObject(obj, pos)
	{
  	var type = obj.is('actor')? 'actor' : 'item';
		this.level.set(pos, type, obj);
	}

	createObject(type, id)
	{
		switch (type) {
			case 'actors': return new Styx.actors.Monster({id: id});
			case 'items': return new Styx.items.Item({id: id});
			default: throw `Unknown entity ${type}`;
		}
	}

	add()
	{
		this.addObjectGroup(this.data.tiles);
		this.addObjectGroup(this.data.items);
		this.addObjectGroup(this.data.monsters);
		this.addSpecialRooms(this.data.specialRooms);		
	}

}