var Styx = Styx || {};
Styx.ui = Styx.ui || {};

/**
 * Styx UI manager - open/close windows, draw panels and messages.
 * Particular windows/panels are defined in its descendant WindowManager.
 */
Styx.ui.BaseWindowManager = class
{
	constructor()
	{
		this.game = game;
		this.messages = [];
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
		throw new Error('Not implemented.');
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

		var fmtMsg = "<span class=\"{1}\">{0}</span>".format(m.capitalize(), cssClass);

		var lastMessage = _.last(this.messages);

		if (lastMessage && fmtMsg == lastMessage.text) {
			lastMessage.num++;
			return;
		}

		this.messages.push({text: fmtMsg, num: 1});
		if (this.messages.length > 50) {
			this.messages.shift();
		}
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
}