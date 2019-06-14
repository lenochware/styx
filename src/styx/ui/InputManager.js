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
				'ArrowLeft': {command: 'move', dir: [-1,0]},
				'ArrowRight': {command: 'move', dir: [1,0]},
				'ArrowUp': {command: 'move', dir: [0,-1]},
				'ArrowDown': {command: 'move', dir: [0,1]},
				'4': {command: 'move', dir: [-1,0]},
				'6': {command: 'move', dir: [1,0]},
				'8': {command: 'move', dir: [0,-1]},
				'2': {command: 'move', dir: [0,1]},
				'7': {command: 'move', dir: [-1,-1]},
				'9': {command: 'move', dir: [1,-1]},
				'1': {command: 'move', dir: [-1,1]},
				'3': {command: 'move', dir: [1,1]},
				'g': {command: 'get'},
				's': {command: 'search'},
				'i': {command: 'inventory'},
				'r': {command: 'rest'}
			},
			inventory: {
			},
			'item-window': {
			}
		};
	}

	on(eventName, callback)
	{
		document.addEventListener('keydown', callback);		
	}

	init()
	{
		this.initTileInfo();
		this.initCommands();
		input.on('keypress', (e) => {
			var command = this.getCommand(event);
			var level = this.game.player.level;
			this.handle(command);
			if (level) level.update();
			this.wm.render();				
		});
	}


	initTileInfo()
	{
		$("#level-map").on("click", "span", (e) => {
			var level = this.wm.getPanel('level-map').level;
			var pos = $(e.target).data("pos").split(",");
			this.wm.showTileInfo(level, Number(pos[0]), Number(pos[1]));
		});

		$("body").on("click", ".tile-info", (e) => {
			var pos = $(e.target).data("pos").split(",");
			this.wm.openTileWindow({
				"pos": {x:Number(pos[0]),y:Number(pos[1])}
			});
		});
	}	


	initCommands()
	{
		$("body").on("click", ".command", (e) => {
			var key = $(e.target).data("key");
			var cmd = this.getCommand({key: key});
			this.handle(cmd);
			this.game.player.level.update();
			this.wm.render();
		});
	}

	getCommand(event)
	{
		var window = this.wm.getActiveWindow();
		var category = window? window.id : 'player';

		if (window && event.key == 'Escape') {
			return {command: 'close-window', category: 'window'};
		}

		if (category == 'inventory' && /^[a-z0-9]+$/.test(event.key)) {
			return {command: 'examine', category: 'inventory', key: event.key };
		}

		if (category == 'item-window') {
			return window.content.commands[event.key] || {command: event.key, category: 'undefined' };
		}

		var cmd = this.keyBinddings[category][event.key];

		if (!cmd) return {command: event.key, category: 'undefined' };
		cmd.category = category;
		return cmd;
	}

	handle(command)
	{
		switch (command.category)
		{
			case 'player': this.handlePlayerCmd(command); break;
			case 'inventory': this.handleInventoryCmd(command); break;
			case 'item-window': this.handleItemCmd(command); break;
			case 'window': 
				if (command.command == 'close-window') {
					this.wm.closeWindow();
				}
			break;
			case 'undefined': console.warn(`Undefined command '${command.command}'`); break;
		}
	}

	handlePlayerCmd(command)
	{
		var p = this.game.player;

		if (p.isDestroyed()) return;

		switch(command.command) {
			case 'move': p.move(command.dir[0], command.dir[1]); break;
			case 'get': p.get(); break;
			case 'inventory': this.wm.openInventory(); break;
			case 'search': p.search(); break;
			case 'rest': p.rest(); break;
			// case 'attack': break;
			default: throw `Invalid command '${command.command}'.`;
		}
	}

	handleInventoryCmd(command)
	{
		switch(command.command) {
			case 'examine':
				var p = this.game.player;
				var item = p.inventory.get(command.key);
				if (item) {
					this.wm.openItemWindow({item: item, key: command.key});
				}
			break;
			default: throw `Invalid command '${command.command}'.`;
		}
	}

	handleItemCmd(command)
	{
		var p = this.game.player;

		switch(command.command) {
			case 'drop':
				p.drop(command.key);
				this.wm.closeAll();
			break;
			case 'wear':
				p.wear(command.key);
				this.wm.closeWindow();
			break;
			case 'unwear':
				p.unwear(command.key);
				this.wm.closeWindow();
			break;
			case 'eat':
				p.eat(command.key);
				this.wm.closeWindow();
			break;

			default: throw `Invalid command '${command.command}'.`;
		}
	}
}