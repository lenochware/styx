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
		this.mouse = null;
		this.tileSelected = null;

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
				'e': {command: 'dbase'},
				'+': {command: 'zoom', factor: 0.1},
				'-': {command: 'zoom', factor: -0.1},
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
		this.initKeyboard();
		this.initMouse();
	}

	initMouse()
	{
		this.mouse = {
			x: 0, y: 0, 
			buttons: 0, 
			deltaY: 0, 
			clickX: 0, clickY: 0, 
			offsetX: 0, offsetY: 0, 
			hold: 0,
			release: 0
		};

		const board = $('#level-map');

		board.on('mousedown', e => this.getMouseButtons(e));
		board.on('mouseup', e => this.mouseUp(e));
		board.on('mousemove', e => this.getMousePos(e));

		$(window).bind('wheel', e => this.getWheel(e));		

		$("body").on("click", ".command", e => this.commandClick(e));
		$("body").on("click", ".tile-info", e => this.tileWindow(e));

		board.on("dblclick", e => this.tileWindow(e));
		board.on('click', e => this.tileClick(e));
	}

	commandClick(e)
	{
		var data = $(e.target).data();
		if (_.isEmpty(data)) return;
		var cmd = this.getCommand(data);
		this.handle(cmd);
		this.game.player.level.update();
		this.wm.render();		
	}

	tileWindow(e)
	{
		var panel = this.wm.getPanel('level-map');
		var pos = this.tileSelected;
		
		this.wm.openTileWindow({
			level: panel.level,
			pos: {x: pos.x + panel.view.x, y: pos.y + panel.view.y}
		});
	}

	tileClick(e)
	{
		var panel = this.wm.getPanel('level-map');

		const m = this.mouse;
		if (m.offsetX || m.offsetY) {
			panel.canvas.offset.x += m.offsetX;
			panel.canvas.offset.y += m.offsetY;
		}

		var pos = panel.canvas.tilePos(e.offsetX, e.offsetY);
		this.wm.showTileInfo(pos.x + panel.view.x, pos.y + panel.view.y);
		this.markTile(panel, pos);
		this.tileSelected = pos;
	}

	getMouseButtons(e)
	{
		this.mouse.buttons = e.buttons;
		this.mouse.clickX = this.mouse.x;
		this.mouse.clickY = this.mouse.y;
		this.mouse.hold = e.buttons;
	}

	mouseUp(e)
	{
		this.mouse.hold = 0;
		this.mouse.release = 1;
	}

	getWheel(e)
	{
		this.mouse.deltaY = e.originalEvent.deltaY;
	}

	getMousePos(e)
	{
		// let scaleX = this.canvas.width() / this.canvas.screenWidth();
		// let scaleY = this.canvas.height() / this.canvas.screenHeight();
		let m = this.mouse;
		
		m.x = Math.floor(e.offsetX /* * scaleX */);
		m.y = Math.floor(e.offsetY /* * scaleY */);

		if (m.hold) {
			m.offsetX = m.x - m.clickX;
			m.offsetY = m.y - m.clickY;
		}
		else {
			m.offsetX = m.offsetY = 0;
		}
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
			
			if (command.command == 'move-view') 
			{
				e.preventDefault();
				return;
			}

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

		if (key) {
			var isCharKey = this.isCharKey(event);

			if(!isCharKey) {
				if (event.shiftKey) key = 'Shift+' + key;
			}	
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

		if (category == 'dbase') {
			return {command: 'spawn', category: 'dbase', id: event.id };
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
			case 'dbase': this.handleDbaseCmd(command); break;
			case 'window': 
				if (command.command == 'close-window') {
					this.wm.closeWindow();
				}
			break;
			case 'undefined': 
			default:
				console.warn(`Undefined command '${command.command}' (${command.category})`); 
			break;
		}
	}

	handleMainCmd(command)
	{
		switch(command.command) {
			case 'game-menu': this.wm.openGameMenu(); break;
			case 'move-view': this.wm.moveView(command.dir); break;
			case 'dbase': this.wm.openDungeonBase(); break;
			case 'zoom': this.wm.zoom(command.factor); break;
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

	handleDbaseCmd(command)
	{
		const level = this.game.level;
		const panel = this.wm.getPanel('level-map');
		const pos = {x: this.tileSelected.x + panel.view.x, y: this.tileSelected.y + panel.view.y};
		level.spawn(pos, command.id);
		console.log(`Spawned ${command.id} at (${pos.x},${pos.y}).`);
		this.wm.closeWindow();
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