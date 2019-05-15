var Styx = Styx || {};
Styx.ui = Styx.ui || {};

Styx.ui.InputManager = class
{
	constructor()
	{
		this.game = game;
		this.wm = this.game.get('window-manager');

		this.keyBinddings = {
			player: {
				'ArrowLeft': {command: 'walk', dir: [-1,0]},
				'ArrowRight': {command: 'walk', dir: [1,0]},
				'ArrowUp': {command: 'walk', dir: [0,-1]},
				'ArrowDown': {command: 'walk', dir: [0,1]},
				'4': {command: 'walk', dir: [-1,0]},
				'6': {command: 'walk', dir: [1,0]},
				'8': {command: 'walk', dir: [0,-1]},
				'2': {command: 'walk', dir: [0,1]},
				'7': {command: 'walk', dir: [-1,-1]},
				'9': {command: 'walk', dir: [1,-1]},
				'1': {command: 'walk', dir: [-1,1]},
				'3': {command: 'walk', dir: [1,1]},
				'g': {command: 'get'},
				's': {command: 'search'},
				'i': {command: 'inventory'}
			},
			inventory: {
				'Escape': {command: 'close-window'}
			}
		};
	}

	on(eventName, callback)
	{
		document.addEventListener('keydown', callback);		
	}

	getCommand(event)
	{
		var category = this.wm.activeWindow || 'player';
		var cmd = this.keyBinddings[category][event.key];
		if (!cmd) return {command: null, category: 'noop' };
		cmd.category = category;
		return cmd;
	}

	handle(command)
	{
		switch (command.category)
		{
			case 'player': this.handlePlayerCmd(command); break;
			case 'inventory': this.handleInventoryCmd(command); break;
			default: throw `Unknown command.`;
		}
	}

	handlePlayerCmd(command)
	{
		var p = this.game.get('player');

		if (p.isDestroyed()) return;

		switch(command.command) {
			case 'walk': p.walk(command.dir[0], command.dir[1]); break;
			case 'get': p.get(); break;
			case 'inventory': this.wm.render('inventory'); break;
			case 'search':break;
			// case 'attack': break;
			default: throw `Invalid command '${command.command}'.`;
		}
	}

	handleInventoryCmd(command)
	{
		switch(command.command) {
			case 'close-window':
				this.wm.closeWindow();
			break;			
			default: throw `Invalid command '${command.command}'.`;
		}
	}

}