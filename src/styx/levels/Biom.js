var Styx = Styx || {};
Styx.levels = Styx.levels || {};

Styx.levels.Biom = class
{
	constructor(id)
	{
		this.game = game;
		this.id = id;
		this.level = null;
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

	addSpecialRooms(group)
	{


	}

	pickPosition(type, location)
	{
  	var pos = null;

  	for (let i = 0; i < 10; i++) {
  		pos = this.level.find('floor').pickOne().value();
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

	add(level)
	{
		this.level = level;
		var biom = this.game.db.getObject('bioms', this.id);

		this.addObjectGroup(biom.tiles);
		this.addObjectGroup(biom.items);
		this.addObjectGroup(biom.monsters);
		this.addSpecialRooms(biom.specialRooms);		
	}

}