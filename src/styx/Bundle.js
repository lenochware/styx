var Styx = Styx || {};

Styx.Bundle = class
{
	constructor(data = {})
	{
		this.CLASS_NAME = '_className_';
		this.data = data;
	}

	put(key, value)
	{
		if (this.isBundlable(value)) {
			this.putBundle(key, value);
		}
		else if (_.isArray(value)) {
			this.putArray(key, value);
		}
		else {
			this.data[key] = value;
		}
	}

	get(key) {
		return this.data[key];
	}

	getBundle(key) {
		return new Bundle(this.data[key]);
	}

	getInstance()
	{
		var className = this.get(this.CLASS_NAME);
		var obj = new window[className]();
		return obj;
	}

	isBundlable(value)
	{
		return _.isObject(value) && (typeof value.storeInBundle == 'function');
 	}

 	putArray(key, srcList)
 	{
 		if (!this.isBundlable(srcList[0])) {
 			this.data[key] = srcList;
 			return;
 		}

 		var list = [];

 		for(let obj of srcList) {
 			bundle = new Bundle();
 			bundle.put(this.CLASS_NAME, obj.constructor.name);
 			obj.storeInBundle(bundle);
 			list.push(bundle.data);
 		}

 		this.data[key] = list;
 	}

	putBundle(key, obj)
	{
		if (!this.isBundlable(obj)) {
			throw new Error('Object is not serializable.');
		}

		bundle = new Bundle();
		bundle.put(this.CLASS_NAME, obj.constructor.name);
		obj.storeInBundle(bundle);
		this.data[key] = bundle.data;
	}

	setData(jsonString)
	{
		this.data = JSON.parse(jsonString);
	}

	getData()
	{
		return JSON.stringify(this.data);
	}

}