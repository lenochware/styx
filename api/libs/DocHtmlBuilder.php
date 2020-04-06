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
		$c['parent'] = $c['parent']? $this->classLink($c['parent']) : 'none';

		$html = $this->paramStr(
			"<a name='{name}'></a><h2>{name}</h2><pre>{comment}</pre>
			Parent: {parent}
			<h3>Properties</h3>
			{properties}
			<h3>Methods</h3>
			{methods}
			<h3>Family</h3>
			{family}",
			 $c);
		return $html;
	}

	function linkedList($names)
	{
		if (!$names) return '';

		$html = '';

		foreach ($names as $name) {
			$html .= $this->classLink($name);
			$children = $this->classes[$name]['children'];
			if ($children) $html .= $this->linkedList($children);
		}

		return "<ul>$html</ul>";
	}

	function memberList($members)
	{
		if (!$mwmbers) return '';

		$html = '';

		foreach ($members as $m) {
			$html .= $this->paramStr("<pre>{comment}\n<b style='color:green'>{name}</b></pre>", $m);
		}

		return $html;
	}



	function classLink($name)
	{
		return "<li><a href=\"#$name\">$name</a>";
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