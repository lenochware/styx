<?php 

class DocParser
{
	const DOCBLOCK = "~/\*\*(.*?)\*/~s";

	protected $classes = [];
	protected $str = "";
	protected $name = "";

	function parse($fileName)
	{
		$this->str = file_get_contents($fileName);

		preg_match_all(self::DOCBLOCK, $this->str, $matches, PREG_OFFSET_CAPTURE);

		foreach ($matches[0] as $i => $found) 
		{
			$comment = $found[0];
			$line = $this->getNextLine($found);
			$c = $this->getClass($line);
			
			if ($c) {
				$classRecord = [
					'name' => $c->name,
					'comment' => $comment,
					'fileName' => $fileName,
					'properties' => [],
					'methods' => [],
					'children' => [],
					'parent' => $c->parent
				];

				if ($this->classes[$c->name]) {
					$this->classes[$c->name] = array_merge($classRecord, $this->classes[$c->name]);

				}
				else {
					$this->classes[$c->name] = $classRecord;
				}
				

				if ($c->parent) {
					$this->classes[$c->parent]['children'][] = $c->name;
				}

				$cur = $c;
				continue;
			}

			$p = $this->getProperty($line);
			if ($p) {
				$p['comment'] = $comment;
				$this->classes[$cur->name]['properties'][] = $p;
				continue;
			}

			$m = $this->getMethod($line);
			if ($m) {
				$m['comment'] = $comment;
				$this->classes[$cur->name]['methods'][] = $m;
				continue;
			}

			throw new Exception('Unknown comment object.');

		}
	}

	function getData()
	{
		return $this->classes;
	}

	protected function getNextLine($found)
	{
		$pos = $found[1];
		$eol = strpos($this->str, "\n", $pos + strlen($found[0]));
		$next = strpos($this->str, "\n", $eol + 1);

		return trim(substr($this->str, $eol + 1, $next - $eol - 1));
	}

	protected function getClass($line)
	{
		if (!strpos($line, " = class")) return false;
		preg_match("/([a-z\.]+)\s*=\s*class(\s+extends\s+([a-z\.]+))?/i", $line, $matches);

		$c = new \stdClass;
		$c->name = $matches[1];
		$c->parent = $matches[3];

		return $c;
	}

	protected function getProperty($line)
	{
		if (strpos(trim($line), "this.") === false) return false;
		return [
			'name' => $line
		];
	}


	protected function getMethod($line)
	{
		if (!preg_match("/[a-z0-9_]+\s*\(.*\)/i", $line, $matches)) return false;
		return [
			'name' => $line
		];
	}
}

 ?>