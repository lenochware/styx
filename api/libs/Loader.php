<?php

class Loader {

	protected $json;

	function removeComments($s)
	{
		return preg_replace('/\/\/.*/', '', $s);
	}

	//transform tag array to hashtable (more effective lookup)
	function getLookup(array $list)
	{
		$tags = [];
		foreach ($list as $id) {
			$tags[$id] = true;
		}

		return $tags;
	}

	function loadJsonFile($path)
	{
		if (!file_exists($path)) {
			throw new Exception("File not found: ".$path);
		}

		$s = $this->removeComments(file_get_contents($path));
		$this->json = json_decode($s, true);
		
		if (json_last_error() != JSON_ERROR_NONE) {
			throw new Exception(json_last_error_msg());
		}

		foreach ($this->json as $k => $obj) {
			if (!is_array($obj) or !$obj['extends']) continue;
			$this->extendObject($k, $obj['extends']);
		}

		foreach ($this->json as $k => $obj) {
			if (!is_array($obj)) continue;
			$this->json[$k]['id'] = $k;
			
			// if ($this->json[$k]['tags']) {
			// 	$this->json[$k]['tags_lookup'] = $this->getLookup($this->json[$k]['tags']);
			// }

		}

		return $this->json;
	}

	function extendObject($id, $parentId, $level = 1)
	{
		if ($this->json[$parentId]['extends'] and $level < 50) {
			$this->extendObject($parentId, $this->json[$parentId]['extends'], ++$level);
		}

		$this->json[$id] = $this->json[$id] + $this->json[$parentId];
	}

}

?>