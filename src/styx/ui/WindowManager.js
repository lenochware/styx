var Styx = Styx || {};
Styx.ui = Styx.ui || {};

Styx.ui.WindowManager = class
{
	constructor()
	{
		this.game = game;
		this.messages = [];
	}

	render(id, options)
	{
		var html = '';

		switch (id) {
			case 'status-bar': html = this._renderStatusBar(options); break;
			case 'side-bar': html = this._renderSideBar(options); break;
			case 'messages': html = this._renderMessages(options); break;
			default: throw `Unknown window type: ${id}`;
		}

		$('#'+options.container).html(html);
	}

	execute(command) {}


	_renderStatusBar(options) {}
	_renderSideBar(options) {}
	_renderMessages(options) {}
}