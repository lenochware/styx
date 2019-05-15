var Styx = Styx || {};
Styx.ui = Styx.ui || {};

Styx.ui.InputManager = class
{
	constructor()
	{
		this.game = game;
		this.activeWindow = this.game.get('window-manager').activeWindow;
	}

	on(eventName, callback)
	{
		document.addEventListener('keydown', callback);		
	}

	getCommand(event)
	{
		switch (event.key)
		{
			case 'ArrowLeft': return {command: 'walk', dir: [-1,0], category: 'player' };
			case 'ArrowRight': return {command: 'walk', dir: [1,0], category: 'player' };
			case 'ArrowUp': return {command: 'walk', dir: [0,-1], category: 'player' };
			case 'ArrowDown': return {command: 'walk', dir: [0,1], category: 'player' };
			
			case '4': return {command: 'walk', dir: [-1,0], category: 'player' };
			case '6': return {command: 'walk', dir: [1,0], category: 'player' };
			case '8': return {command: 'walk', dir: [0,-1], category: 'player' };
			case '2': return {command: 'walk', dir: [0,1], category: 'player' };
			case '7': return {command: 'walk', dir: [-1,-1], category: 'player' };
			case '9': return {command: 'walk', dir: [1,-1], category: 'player' };
			case '1': return {command: 'walk', dir: [-1,1], category: 'player' };
			case '3': return {command: 'walk', dir: [1,1], category: 'player' };

			case 'i': return {command: 'open', category: 'inventory' };
			case 'Escape': return {command: 'close-window', category: 'inventory' };

			case 'g': return {command: 'get', category: 'player' };
			case 's': return {command: 'search', category: 'player' };
		}

		return {command: null, category: 'noop' };
	}

	handle(command)
	{
		switch (command.category)
		{
			case 'player': this.handlePlayerCmd(command); break;
			case 'inventory': this.handleInventoryCmd(command); break;
			default: throw `Unknown command category.`;
		}
	}


	handlePlayerCmd(command)
	{
		var p = this.game.get('player');

		if (p.isDestroyed()) return;

		switch(command.command) {
			case 'walk': p.walk(command.dir[0], command.dir[1]); break;
			case 'get': p.get(); break;
			case 'search':break;
			// case 'attack': break;
			default: throw `Invalid command '${command.command}'.`;
		}
	}

	handleInventoryCmd(command)
	{
		var wm = this.game.get('window-manager');

		switch(command.command) {
			case 'close-window':
				wm.closeWindow();
			break;			
			case 'open':
				wm.render('inventory');
			break;				
			default: throw `Invalid command '${command.command}'.`;
		}
	}

}