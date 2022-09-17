var Styx = Styx || {};
Styx.ui = Styx.ui || {};

/**
 * Get and handle mouse and kayboard commands.
 * It translates user action into command object with getCommand() and dispatch command in handle() methods.
 */
Styx.ui.InputManager = class
{
	constructor()
	{
		this.game = game;
		this.wm = this.game.get('window-manager');
		this.paused = false;

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
				'u': {command: 'use-list'},
				'r': {command: 'rest'},
				'.': {command: 'run'}
			},
			main: {
				'Escape': {command: 'game-menu'},
				'Shift+ArrowLeft': {command: 'move-view', dir: [-1,0]},
				'Shift+ArrowRight': {command: 'move-view', dir: [1,0]},
				'Shift+ArrowUp': {command: 'move-view', dir: [0,-1]},
				'Shift+ArrowDown': {command: 'move-view', dir: [0,1]},
			},
			inventory: {
			},
			'item-window': {
			},
			'game-menu': {
				'n': {command: 'new-game'},
				'l': {command: 'load-game'},
				's': {command: 'save-game'},
				'h': {command: 'help'},
				't': {command: 'settings'}
			}
		};
	}

	init()
	{
		this.initMouse();
		this.initKeyboard();
	}

	initMouse()
	{
		$("body").on("click", ".command", (e) => {
			var data = $(e.target).data();
			if (_.isEmpty(data)) return;
			var cmd = this.getCommand(data);
			this.handle(cmd);
			this.game.player.level.update();
			this.wm.render();
		});

		$("body").on("click", ".tile-info", (e) => {
			var level = this.wm.getPanel('level-map').level;
			var spos = $(e.target).data("pos");
			this.wm.openTileWindow({
				level: level,
				pos: this.strToPos(spos)
			});
		});

		$("#level-map").on("dblclick", (e) => {
			var panel = this.wm.getPanel('level-map');
			var pos = panel.canvas.tilePos(e.offsetX, e.offsetY);
			
			this.wm.openTileWindow({
				level: panel.level,
				pos: {x: pos.x + panel.view.x, y: pos.y + panel.view.y}
			});
		});

		$('#level-map').on('click',
			e => {
				var panel = this.wm.getPanel('level-map');
				var pos = panel.canvas.tilePos(e.offsetX, e.offsetY);
				this.wm.showTileInfo(pos.x + panel.view.x, pos.y + panel.view.y);
				this.markTile(panel, pos);
			}			
		);
	}

	markTile(panel, pos)
	{
		  //refresh
			this.wm._renderLevel(panel);

			panel.canvas.rect(
				pos.x * panel.canvas.tileWidth, 
				pos.y * panel.canvas.tileHeight, 
				panel.canvas.tileWidth, 
				panel.canvas.tileHeight, 'red', false
			);		
	}

	initKeyboard()
	{
		$("body").on('keydown', (e) => {

			if (e.target.type == 'text' || e.target.type == 'textarea') return;
			if (['Shift', 'Alt', 'Control'].includes(e.key)) return;

			this.game.trigger('game-loop');
			var command = this.getCommand(e);
			var level = this.game.player.level;
			this.handle(command);
			if (level) level.update();
			
			if (command.command == 'move-view') return;

			this.wm.render();

			//allow develop-tools
			if (['F12', 'F5'].includes(e.key)) return;
			else e.preventDefault();
			
		});
	}

	isCharKey(event)
	{
		return event.key.toString().length == 1;
	}

	strToPos(str)
	{
		var p = str.split(",");
		return {x:Number(p[0]),y:Number(p[1])};
	}

	getCommand(event)
	{
		var activeWindow = this.wm.getActiveWindow();
		var category = '';

		var key = event.key;
		var isCharKey = this.isCharKey(event);

		if(!isCharKey) {
			if (event.shiftKey) key = 'Shift+' + key;
		}

		if (activeWindow) {
			if(key == 'Escape') {
				return {command: 'close-window', category: 'window'};
			}
			else {
				category = activeWindow.id;
			}
		}
		else {
			category = this.keyBinddings['main'][key]? 'main' : 'player';
		}

		if (category == 'inventory' && isCharKey) {
			return {command: 'examine', category: 'inventory', key: key };
		}

		if (category == 'use-list' && isCharKey) {
			return {command: 'use', category: 'use-list', key: key };
		}

		if (category == 'item-window') {
			var item = activeWindow.content.item;
			var cmds = new Styx.ui.Commands(item);
			var cmd = cmds.getCommand(key);
			if (cmd) {
				cmd.category = category;
				cmd.key = this.game.player.inventory.getKey(item);
				return cmd;
			}
		}

		var cmd = this.keyBinddings[category]? this.keyBinddings[category][key] : null;

		if (!cmd) return {command: key, category: 'undefined' };

		cmd.category = category;
		
		if (event.pos) {
			cmd.pos = this.strToPos(event.pos);
		}

		return cmd;
	}

	handle(command)
	{
		if (this.paused) return false;

		switch (command.category)
		{
			case 'main': this.handleMainCmd(command); break;
			case 'game-menu': this.handleGameMenuCmd(command); break;
			case 'player': this.handlePlayerCmd(command); break;
			case 'inventory': this.handleInventoryCmd(command); break;
			case 'use-list': this.handleUseListCmd(command); break;
			case 'item-window': this.handleItemCmd(command); break;
			case 'window': 
				if (command.command == 'close-window') {
					this.wm.closeWindow();
				}
			break;
			case 'undefined': console.warn(`Undefined command '${command.command}'`); break;
		}
	}

	handleMainCmd(command)
	{
		switch(command.command) {
			case 'game-menu': this.wm.openGameMenu(); break;
			case 'move-view': this.wm.moveView(command.dir); break;
		}
	}

	handleGameMenuCmd(command)
	{
		switch(command.command) {
			case 'new-game': this.wm.openNewGame(); break;
			case 'save-game': 
				this.game.saveLevel('test');
				this.wm.closeWindow();
				this.game.message("Game saved.");
			break;
			case 'load-game':
				if (!confirm("Load saved game?")) return;
				this.game.loadLevel('test');
				this.wm.closeWindow();
				this.game.message("Game loaded.");
			break;

			case 'help': console.log('Help.'); break;
			case 'settings': console.log('Settings.'); break;
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
			case 'use-list': this.wm.openUseList(); break;
			case 'search': p.search(); break;
			case 'rest': p.rest(); break;
			case 'run': p.run(command.pos); break;
			// case 'attack': break;
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
		}
	}

	handleUseListCmd(command)
	{
		var p = this.game.player;
		var item = p.inventory.get(command.key);
		if (!item) return;

		var cmds = new Styx.ui.Commands(item);
		var cmd = cmds.getDefaultCommand();
		cmd.key = command.key;
		this.handleItemCmd(cmd);
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
			case 'drink':
				p.drink(command.key);
				this.wm.closeWindow();
			break;

		}
	}
}