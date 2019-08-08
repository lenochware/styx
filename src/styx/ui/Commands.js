var Styx = Styx || {};
Styx.ui = Styx.ui || {};

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

	getList()
	{
		var list = [];
		var inv = this.game.player.inventory;
		var ikey = inv.getKey(this.item);
		if (!ikey) return [];

		list.push({command: 'drop', label: '(D)rop', hotkey: 'd'});
		
		if (inv.isWearing(this.item)) {
			list.push({command: 'unwear', label: '(T)ake off', hotkey: 't'});
		}
		else {
			list.push({command: 'wear', label: '(W)ear', hotkey: 'w'});
		}

		if (this.item.is('food')) {
			list.push({command: 'eat', label: '(E)at', hotkey: 'e'});
		}

		return list;
	}


	getLinks() {}
}