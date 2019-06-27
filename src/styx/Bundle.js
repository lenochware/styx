var Styx = Styx || {};

Styx.Bundle = class
{
	constructor(data = {})
	{
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

	get(key)
	{
		var value = this.data[key];

		if (this.isBundledObject(value)) {
			return this.getObject(key);
		}
		else if (_.isArray(value)) {
			return this.getArray(key);
		}
		else {
			return value;
		}
	}

	getBundle(key)
	{
		return new this.constructor(this.data[key]);
	}

	getObject(key)
	{
		var bundle = this.getBundle(key);

		var className = bundle.get('_className_');
		var args = bundle.get('_args_');

		if (!className.match(/^[a-zA-Z0-9_.]+$/)) {
			throw new Error('Invalid _className_');
		}

		var obj = args? eval(`new ${className}(...args)`) : eval(`new ${className}()`);
		obj.restoreFromBundle(bundle);

		return obj;
	}

	isBundlable(value)
	{
		return _.isObject(value) && (typeof value.storeInBundle == 'function');
 	}

	isBundledObject(value)
	{
		return (_.isObject(value) && value['_className_']);
 	}

 	getArray(key)
 	{
 		if (!this.isBundledObject(this.data[key][0])) {
 			return this.data[key];
 		}

 		var list = [];
 		let bundle = this.getBundle(key);

 		for(let i in bundle.data) { 			
 			list.push(bundle.getObject(i));
 		}

 		return list;
 	}

 	putArray(key, srcList)
 	{
 		if (!this.isBundlable(srcList[0])) {
 			this.data[key] = srcList;
 			return;
 		}

 		var list = [];

 		for(let obj of srcList) {
 			let bundle = new this.constructor();
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

		let bundle = new this.constructor();
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