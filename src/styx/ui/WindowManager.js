var Styx = Styx || {};
Styx.ui = Styx.ui || {};

/**
 * Draw game screen with wm.render() method.
 * It contains methods for rendering of sidebar, inventory, menu, item or tile window 
 * and other ui components.
 * Appearance is defined with templates in game/templates directory.
 */
Styx.ui.WindowManager = class extends Styx.ui.BaseWindowManager
{
	render()
	{
		this.game.trigger('render');

		for (let id in this.panels) {
			var panel = this.panels[id];
			switch (id) {
				case 'statusbar': this._renderStatusBar(panel); break;
				case 'sidebar': this._renderSideBar(panel); break;
				case 'messages': this._renderMessages(panel); break;
				case 'level-map': this._renderLevel(panel); break;
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

		var cmdRun = { command: 'run', label: "Run", key: "." };

		$("#object-info").html(
			this.template('object-info', 
				{
					item: obj,
					conditions: obj.is('actor')? obj.getConditions() : [],
					commands: [cmdRun]
				}
			)
		);

		$("#quick-message").html("You see {0}.".format(obj));
	}

	showObjectInfo(obj)
	{
		$("#object-info").html(
			this.template('object-info', 
				{
					item: obj,
					conditions: obj.is('actor')? obj.getConditions() : [],
					commands: []
				}
			)
		);

		//TODO: 	<%= player.target.name() %>: <%= _templ.meter("meter-health", player.target.health, player.target.maxHealth) %>
	}

	openInventory()
	{
		this.openWindow('inventory', 600, 400, {
			template: 'inventory',
			player: this.game.player
		});
	}

	openUseList()
	{
		this.openWindow('use-list', 600, 400, {
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

	openItemWindow(options)
	{
		var cmds = new Styx.ui.Commands(options.item);

		this.openWindow('item-window', 400, 200, {
			template: 'item-window',			
			item: options.item,
			commands: cmds.list
		});
	}

	openTileWindow(options)
	{
		var obj = options.level.get(options.pos, 'tile').getVisible();

		this.openWindow('tile-window', 400, 200, {
			template: 'tile-window',			
			item: obj,
			conditions: obj.is('actor')? obj.getConditions() : [],
			commands: []
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

	_renderLevel(panel)
	{
		this.game.get('renderer').render(panel.level, panel.container, {view: panel.view});
	}

	_renderMessages(options)
	{
		var html = '';
		var msgs = this.messages.slice(-5);

		for(let m of msgs) {
			html += m.text;
			if (m.num > 1) {
				html += ' (x' + m.num + ')';
			}
			html += '<br>';
		}

		$('#'+options.container).html(html);
	}

	moveView(dir)
	{
		var levelMap = this.getPanel('level-map');
		levelMap.view.move(dir[0] *.8, dir[1] *.8, 'rel');
		levelMap.view.align(levelMap.level.size);
		this._renderLevel(levelMap);
	}
}