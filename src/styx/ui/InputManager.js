var Styx = Styx || {};
Styx.ui = Styx.ui || {};

Styx.ui.InputManager = class
{
	on(eventName, callback)
	{
		document.addEventListener('keydown', callback);		
	}

	getCommand(event)
	{
		switch (event.key)
		{
			case 'ArrowLeft': return {command: 'walk', dir: [-1,0], category: 'player-command' };
			case 'ArrowRight': return {command: 'walk', dir: [1,0], category: 'player-command' };
			case 'ArrowUp': return {command: 'walk', dir: [0,-1], category: 'player-command' };
			case 'ArrowDown': return {command: 'walk', dir: [0,1], category: 'player-command' };
			
			case '4': return {command: 'walk', dir: [-1,0], category: 'player-command' };
			case '6': return {command: 'walk', dir: [1,0], category: 'player-command' };
			case '8': return {command: 'walk', dir: [0,-1], category: 'player-command' };
			case '2': return {command: 'walk', dir: [0,1], category: 'player-command' };
			case '7': return {command: 'walk', dir: [-1,-1], category: 'player-command' };
			case '9': return {command: 'walk', dir: [1,-1], category: 'player-command' };
			case '1': return {command: 'walk', dir: [-1,1], category: 'player-command' };
			case '3': return {command: 'walk', dir: [1,1], category: 'player-command' };

			case 'i': return {command: 'inventory', category: 'wm-command' };
			case 'Escape': return {command: 'close-window', category: 'wm-command' };

			case 'g': return {command: 'get', category: 'player-command' };
			case 's':
				return {command: 'search', category: 'player-command' };
				break;
		}

		return {command: null, category: 'noop' };
	}

}