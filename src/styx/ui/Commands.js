var Styx = Styx || {};
Styx.ui = Styx.ui || {};

/**
 * Get list of commands (actions) which player can do with any item.
 */
Styx.ui.Commands = class
{
	constructor(item)
	{
		this.game = game;
		this.item = item;
		this.list = this.getList();
	}

	getCommand(hotkey)
	{
		return _.find(this.list, obj => obj.hotkey == hotkey);
	}

	getDefaultCommand()
	{
		return _.last(this.list);
	}

	getList()
	{
		var list = [];
		var inv = this.game.player.inventory;
		var ikey = inv.getKey(this.item);
		if (!ikey) return [];

		list.push({command: 'drop', label: '(D)rop', hotkey: 'd'});
		
		if (this.item.is('wearable')) {
			if (inv.isWearing(this.item)) {
				list.push({command: 'unwear', label: '(T)ake off', hotkey: 't'});
			}
			else {
				list.push({command: 'wear', label: '(W)ear', hotkey: 'w'});
			}
		}

		if (this.item.is('food')) {
			list.push({command: 'eat', label: '(E)at', hotkey: 'e'});
		}

		if (this.item.is('drink')) {
			list.push({command: 'drink', label: '(Q)uaff', hotkey: 'q'});
		}

		return list;
	}


	getLinks() {}
}