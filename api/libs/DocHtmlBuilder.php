<?php 

class DocHtmlBuilder
{
	protected $classes;

	function  __construct($classes)
	{
		$this->classes = $classes;
	}


	function buildTOC()
	{
		$names = [];

		foreach ($this->classes as $c) {
			if ($c['parent']) continue;
			$names[] = $c['name'];
		}

		$html = $this->linkedList($names);
		return $html;
	}

	function classDetail($name)
	{
		$c = $this->classes[$name];
		$c['family'] = $this->linkedList($c['children']);
		$c['properties'] = $this->memberList($c['properties']);
		$c['methods'] = $this->memberList($c['methods']);
		$c['parent'] = $this->parentList($c);

		$html = $this->paramStr(
			"<a name='{name}'></a><h2>{name}</h2><pre>{comment}</pre>
			Parent: {parent}
			<h3>Properties</h3>
			{properties}
			<h3>Methods</h3>
			{methods}".($c['family']? "<h3>Family</h3>
						{family}" : ""),
			 $c);
		return $html;
	}

	function parentList($c)
	{
		 if (!$c['parent'])  return '<pre>none</pre>';

		 $parents = [];
		 while ($c['parent']) {
		 	$parents[] = $this->classLink($c['parent']);
		 	$c = $this->classes[$c['parent']];
		 }

		 return implode(' : ', $parents);
	}

	function linkedList($names)
	{
		if (!$names) return '';

		$html = '';

		foreach ($names as $name) {
			$html .= '<li>' . $this->classLink($name);
			$children = $this->classes[$name]['children'];
			if ($children) $html .= $this->linkedList($children);
		}

		return "<ul>$html</ul>";
	}

	function memberList($members)
	{
		if (!$members) return '<pre>undocumented / empty</pre>';

		$html = '';

		foreach ($members as $m) {
			$m['comment'] = str_replace("\t", "", $m['comment']);
			$html .= $this->paramStr("<pre>{comment}\n<b style='color:blue'>{name}</b></pre>", $m);
		}

		return $html;
	}



	function classLink($name)
	{
		return "<a href=\"#$name\">$name</a>";
	}

	function paramStr($str, $param, $keepEmpty = false)
	{
		preg_match_all("/{([a-z0-9_.]+)}/i", $str, $found);
		if (!$found[1]) return $str;
		if (!is_array($param[0])) $param = array($param);

		$n = count($param);
		$newstr = '';
		for ($i = 0; $i < $n; $i++) {
			$from = $to = null;
			foreach($found[1] as $key) {
				if ($keepEmpty and !isset($param[$i][$key])) continue;
				$from[] = '{'.$key.'}';
				$to[] = $param[$i][$key];
			}
			$newstr .= str_replace($from, $to, $str);
		}
		return $newstr;
	}	
}


 ?>