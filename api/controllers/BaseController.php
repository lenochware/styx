<?php 	

require 'libs/Loader.php';

class BaseController
{
	protected $restApi;
	protected $loader;

	function __construct($restApi)
	{
		$this->restApi = $restApi;
		$this->loader = new Loader;
	}

}

 ?>