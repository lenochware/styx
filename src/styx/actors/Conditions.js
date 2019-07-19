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

	removeAll()
	{
		this.members = {};
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

	message(m, cssClass = "msg-info", ...args)
	{
		if (!this.target.isNear()) return;
		this.game.message(m, cssClass, args);
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

	Invisible : class extends Styx.actors.Condition  {},

	Afraid : class extends Styx.actors.Condition 
	{
		onAdd()
		{
			this.message("{0} [is] afraid!", 'msg-hilite', this.target);
		}

		onRemove()
		{
			this.message("{0} recover his courage!", 'msg-info', this.target);
		}

	},

	Stunned : class extends Styx.actors.Condition 
	{
		onAdd()
		{
			this.message("{0} [is] stunned!", 'msg-hilite', this.target);
		}
	},

	Asleep : class extends Styx.actors.Condition
	{
		onRemove()
		{
			this.message("{0} wake[s] up!", 'msg-info', this.target);
		}
	},

	Poisoned : class extends Styx.actors.Condition
	{
		onAdd()
		{
			var cssClass = this.target.isPlayer()? 'msg-warning' : 'msg-info';
			this.message("{0} [is] poisoned!", cssClass, this.target);
		}

		onRemove()
		{
			this.message("{0} [is] no longer poisoned!", 'msg-hilite', this.target);
		}		

		update()
		{
			super.update();

			if (Styx.Random.bet(.3)) {
				this.target.damage(null, 'poison', 1);
			}
		}
	},

	Bleeding : class extends Styx.actors.Condition
	{
		onAdd()
		{
			var cssClass = this.target.isPlayer()? 'msg-warning' : 'msg-info';
			this.message("{0} [is] bleeding!", cssClass, this.target);
		}

		update()
		{
			super.update();

			if (Styx.Random.bet(.3)) {
				this.target.damage(null, 'bleeding', 1);

				var pos = this.target.pos;
				var level = this.target.level;

				if (level.get(pos, 'id') == 'floor') level.set(pos, 'id', 'blood_floor');
			}
		}
	}


}