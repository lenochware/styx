var Styx = Styx || {};

Styx.DungeonBase = class
{
	constructor()
	{
		this.data = {};
	}

	getAttrib(category, id, attrib)
	{
		try {
			return this.data[category][id][attrib];
		}
		catch(err) {
			console.warn(category+'.'+id+'.'+attrib+' not found.');
			return null;
		}
	}

	load(path)
	{
		var that = this;
		return $.getJSON('loader.php?path=' + path, function(data) {
			that.data = data;
		})
		.done(function() {
	    console.log( "load success" );
	  })
	  .fail(function() {
	    console.error( "load error" );
	  });
	}
}