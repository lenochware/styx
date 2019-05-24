var Styx = Styx || {};
Styx.ui = Styx.ui || {};

Styx.ui.WindowManager = class
{
	constructor()
	{
		this.game = game;
		this.messages = "";
		this.lastMessage = "";
		this.templates = this.game.data["templates"];
		this.windows = [];
		this.initTileInfo();
	}

	render(id, options)
	{
		switch (id) {
			case 'statusbar': this._renderStatusBar(options); break;
			case 'sidebar': this._renderSideBar(options); break;
			case 'messages': this._renderMessages(options); break;
			case 'inventory': this._renderInventory(options); break;
			case 'item-window': this._renderItemWindow(options); break;
			case 'tile-window': this._renderTileWindow(options); break;
			default: throw `Unknown window type: ${id}`;
		}
	}

	showTileInfo(level, x, y)
	{
		var obj = level.getXY(x, y, 'tile').getVisible();
		this.quickMessage(
			'You see <span class="link tile-info" data-pos="{1}">{0}</span>.', 
			obj.shortDesc(), x + ',' + y
		);
	}

	initTileInfo()
	{
		var level = this.game.get("player").level;

		$("#level-map").on("click", "span", (e) => {
			var pos = $(e.target).data("pos").split(",");
			this.showTileInfo(level, Number(pos[0]), Number(pos[1]));
		});

		$("body").on("click", ".tile-info", (e) => {
			var pos = $(e.target).data("pos").split(",");
			this.render("tile-window", {
				"pos": {x:Number(pos[0]),y:Number(pos[1])}
			});
		});
	}

	quickMessage(m, ...args)
	{
		if (args) {
			m = m.format(args);
		}

		$("#quick-message").html(m);
	}

	warMessage(dmg)
	{
  	var r = dmg.actor.getAttrib('render');

		var d = document.createElement('div');
		$(d).addClass("animated fadeOut delay-1s ui-red")
		.html(`<span class="ui-${r.color}">${r.char}</span> ${dmg.type}`)
		.delay(2000)
		.queue(function() {
		  $(this).remove();
		})
		.appendTo('#war-messages');
  }

	message(m, cssClass = "msg-info", args)
	{
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

		this.messages += "<span class=\"{1}\">{0}</span>".format(m.capitalize(), cssClass);
	}

	_renderInventory()
	{
		var p = this.game.get('player');

		this.openWindow('inventory', 600, 400, {
			template: 'inventory',
			player: p,
		});
	}

	_renderItemWindow(options)
	{
		var commands = {};

		commands['d'] = {command: 'drop', key: options.key, label: "[d]rop", category: "item-window"};
		if (/^[0-9]+$/.test(options.key)) {
			commands['t'] = {command: 'unwear', key: options.key, label: "[t]ake off", category: "item-window"};
		}
		else if (options.item.is('wearable')) {
			commands['w'] = {command: 'wear', key: options.key, label: "[w]ear", category: "item-window"};
		}
		else if (options.item.is('food')) {
			commands['e'] = {command: 'eat', key: options.key, label: "[e]at", category: "item-window"};
		}

		this.openWindow('item-window', 400, 200, {
			template: 'item-window',			
			item: options.item,
			commands: commands
		});
	}

	_renderTileWindow(options)
	{
		var commands = {};

		var obj = level.get(options.pos, 'tile').getVisible();

		this.openWindow('item-window', 400, 200, {
			template: 'item-window',			
			item: obj,
			commands: commands
		});
	}

	_renderSideBar(options)
	{
		var p = this.game.get('player');
		$('#'+options.container).html(this.template('sidebar', {
			player: p
		}));
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
		//this.messages.scrollTop = this.messages.scrollHeight;
		$('#'+options.container).html(this.messages);
	}
}