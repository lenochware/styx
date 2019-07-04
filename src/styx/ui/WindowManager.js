var Styx = Styx || {};
Styx.ui = Styx.ui || {};

Styx.ui.WindowManager = class
{
	constructor()
	{
		this.game = game;
		this.messages = [];
		this.lastMessage = "";
		this.txtInfo = "";
		this.templates = this.game.data["templates"];
		this.windows = [];
		this.panels = {};
		this.texts = this.game.db.getCategory('texts');
	}

	setPanel(panel) {
		this.panels[panel.id] = panel;
	}

	getPanel(id)
	{
		return this.panels[id];
	}

	render()
	{
		this.game.trigger('render');

		for (let id in this.panels) {
			var panel = this.panels[id];
			switch (id) {
				case 'statusbar': this._renderStatusBar(panel); break;
				case 'sidebar': this._renderSideBar(panel); break;
				case 'messages': this._renderMessages(panel); break;
				case 'level-map': 
					this.game.get('renderer').render(panel.level, panel.container, {view: panel.view});
				break;	
				default: throw `Unknown panel: ${id}`;
			}
		}


		if (this.txtInfo) {
			$("#quick-message").html(this.txtInfo);
			this.txtInfo = "";
		}
		else {
			$("#quick-message").html('');			
		}
	}

	showTileInfo(x, y)
	{
		var level = this.getPanel('level-map').level;
		var obj = level.isVisible(x, y)? level.getXY(x, y, 'tile').getVisible() : level.getXY(x, y, 'tile');
		this.showObjectInfo(obj);
		$("#quick-message").html("You see {0}.".format(obj));
	}

	showObjectInfo(obj)
	{
		$("#object-info").html('<span class="link tile-info" data-pos="{1}">{0}</span>'.format(
			[obj.shortDesc(), obj.pos.x + ',' + obj.pos.y])
		);

		//TODO: 	<%= player.target.name() %>: <%= _templ.meter("meter-health", player.target.health, player.target.maxHealth) %>
	}

	info(m, args)
	{
		if (args) {
			m = m.format(args);
		}

		this.txtInfo = m;
	}	

	message(m, cssClass = "msg-info", args)
	{
		if (this.texts[m]) {
			m = this.texts[m];
		}

		if (args) {
			m = m.format(args);
		}

		if (m.substring(0,3) == "you") {
			m= m.replace("[is]", "are")
				.replace("[s]", "");
		}
		else {
			m = m.replace("[is]", "is")
				.replace("[s]", "s");
		}

		if (m == this.lastMessage) return;
		this.lastMessage = m;

		var fmtMsg = "<span class=\"{1}\">{0}</span>".format(m.capitalize(), cssClass);

		this.messages.push(fmtMsg);
		if (this.messages.length > 50) {
			this.messages.shift();
		}
	}

	openInventory()
	{
		this.openWindow('inventory', 600, 400, {
			template: 'inventory',
			player: this.game.player
		});
	}

	openGameMenu()
	{
		this.openWindow('game-menu', 600, 400, {
			template: 'game-menu',
			player: this.game.player
		});
	}

	_addCmd(cmds, id, key, label, cmd)
	{
		cmds[key] = _.extend({command: id, label: `<span class="command" data-key="${key}">${label}</span>`}, cmd);
	}

	openItemWindow(options)
	{
		var cmds = {};
		var cmd = {category: "item-window", key: options.key};

		this._addCmd(cmds, 'drop', 'd', '<kbd>D</kbd>rop', cmd);

		if (/^[0-9]+$/.test(options.key)) {
			this._addCmd(cmds, 'unwear', 't', '<kbd>T</kbd>ake off', cmd);
		}
		else if (options.item.is('wearable')) {
			this._addCmd(cmds, 'wear', 'w', '<kbd>W</kbd>ear', cmd);
		}
		else if (options.item.is('food')) {
			this._addCmd(cmds, 'eat', 'e', '<kbd>E</kbd>at', cmd);
		}

		this.openWindow('item-window', 400, 200, {
			template: 'item-window',			
			item: options.item,
			commands: cmds
		});
	}

	openTileWindow(options)
	{
		var commands = {};

		var obj = options.level.get(options.pos, 'tile').getVisible();

		this.openWindow('tile-window', 400, 200, {
			template: 'tile-window',			
			item: obj,
			conditions: obj.is('actor')? obj.getConditions() : [],
			commands: commands
		});
	}

	_renderSideBar(options)
	{
		var p = this.game.player;

		$('#'+options.container).html(this.template('sidebar', {
			player: p
		}));

		if (p.target) this.showObjectInfo(p.target);
	}

	template(id, data)
	{
		if (!this.templates[id]) {
			throw new Error(`Template '${id}' not found.`);
		}

		data["_templ"] = this.game.get('helpers');

		return _.template(this.templates[id])(data);
	}

	getActiveWindow()
	{
		if (this.windows.length == 0) return null;
		return this.windows[this.windows.length-1];
	}

	openWindow(id, width, height, content)
	{
		var win = new Styx.ui.Window(id, width, height, content);
		win.draw();
	}

	closeWindow()
	{
		var win = this.getActiveWindow();
		if (!win) return false;
		win.close();
		win = this.getActiveWindow();
		if (win) win.redraw();
	}

	closeAll()
	{
		while(this.windows.length) {
			this.closeWindow();			
		}
	}

	_renderMessages(options)
	{
		$('#'+options.container).html(this.messages.slice(-5).join('<br>'));
	}
}