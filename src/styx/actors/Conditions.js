var Styx = Styx || {};
Styx.actors = Styx.actors || {};

Styx.actors.ConditionGroup = class
{
	constructor(target)
	{
		this.members = {};
		this.target = target;
	}

	add(className, duration, points = 0)
	{
		var ClassObj = Styx.actors.conditions[className];

		if (!ClassObj) {
			console.warn(className + ' does not exists!');
			return false;
		}

		var m = new ClassObj(this, className, duration, points);
		this.members[className] = m;
		m.onAdd();
	}

	remove(className)
	{
		var m = this.members[className];
		if (!m) {
			console.warn(className + ' does not exists!');
			return false;
		}

		m.onRemove();
		delete this.members[className];
		return true;
	}

	is(className)
	{
		return _.has(this.members, className);
	}

	update()
	{
		_.each(this.members, m => m.update());
	}

	list()
	{
		return _.map(this.members, m => m.name());
	}

}

Styx.actors.Condition = class
{
	constructor(group, id, duration, points)
	{
		this.game = game;
		this.group = group;
		this.target = group.target;
		this.id = id;
		this.duration = duration;
		this.points = points;
	}

	name()
	{
		return this.id;
	}

	onAdd() {}
	onRemove() {}

	update()
	{
		this.duration--;
		if (this.duration <= 0) this.group.remove(this.id);
	}

}

Styx.actors.conditions = {

	Afraid : class extends Styx.actors.Condition 
	{

	},

	Asleep : class extends Styx.actors.Condition
	{
		onRemove()
		{
			game.message("{0} wake up!", 'msg-info', this.target);
		}
	}

}