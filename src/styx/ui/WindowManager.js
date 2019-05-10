var Styx = Styx || {};
Styx.ui = Styx.ui || {};

Styx.ui.WindowManager = class
{
	constructor()
	{
		this.game = game;
		this.messages = "";
	}

	render(id, options)
	{
		switch (id) {
			case 'status-bar': this._renderStatusBar(options); break;
			case 'side-bar': this._renderSideBar(options); break;
			case 'messages': this._renderMessages(options); break;
			default: throw `Unknown window type: ${id}`;
		}
	}

	execute(command) {}

	message(m, cssClass = "msg")
	{
		this.messages += "<span class=\"{1}\">{0}</span>".format(m.capitalize(), cssClass);
	}

	_renderStatusBar(options) {}

	_renderSideBar(options)
	{
		var p = this.game.get('player');
		$('#'+options.container).html(this.template('side-bar', {
			player: {name: p.params.name, health: p.health} 
		}));
	}

	template(id, data)
	{
		return _.template("hello <%= player.name %>")(data);
	}

	_renderMessages(options)
	{
		//this.messages.scrollTop = this.messages.scrollHeight;
		$('#'+options.container).html(this.messages);
	}
}