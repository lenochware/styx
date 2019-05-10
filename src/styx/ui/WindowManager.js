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

	message(m, cssClass)
	{
		this.messages += `<span class="${cssClass}">${m}</span>`;
	}

	_renderStatusBar(options) {}
	_renderSideBar(options) {}

	_renderMessages(options)
	{
		//this.messages.scrollTop = this.messages.scrollHeight;
		$('#'+options.container).html(this.messages);
	}
}