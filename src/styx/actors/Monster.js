var Styx = Styx || {};
Styx.actors = Styx.actors || {};

Styx.actors.Monster = class extends Styx.actors.Actor
{
	update()
	{
		while (this.time + this.tick < this.game.time) {
			this.walk(_.random(-1,1), _.random(-1,1));
		}
	}

	damage(attacker, dmg)
	{
		super.damage(attacker, dmg);
		
		if (this.health < this.maxHealth / 3) {
			this.condition('afraid', 10);
		}
	}
}