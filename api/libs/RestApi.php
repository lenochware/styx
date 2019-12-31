<?php 

/**
 * Provadi zpracovani rest rout, vstup a vystup json, rest chybove hlasky s http status kodem a token autorizaci.
 * - addRoutes($routes) - Pridani vsech rout rest-api. viz https://packagist.org/packages/nikic/fast-route
 * - getRouteInfo() - Po zavolani api vrati informaci o volane route: [status, handler, parametry]
 * - outputJson(), inputJson() - Odesle a prijme json data z response/request
 * - login() - prihlaseni - vrati docasne platny token, ktery se pak musi posilat s kazdym pozadavkem
 * - validateToken() - validuje a prodlouzi platnost tokenu
 *   Token lze predavat jako _GET['api_key'] parametr, nebo v hlavicce "Authorization: api_key=12345"
 */
class RestApi {
	
	public $dispatcher;
	public $uri;
	public $httpMethod;
	public $route;
	protected $app;

	function __construct()
	{
		$this->httpMethod = $_SERVER['REQUEST_METHOD'];
		$this->uri = $_SERVER['REQUEST_URI'];
		$this->authorizeRequest();
	}

	public function addRoutes($function)
	{
		$this->dispatcher = FastRoute\simpleDispatcher($function);
	}

	function run()
	{
		$this->route = $this->getRouteInfo();

		if ($this->route->path == 'login') {
			$this->processLoginRequest();
		}

		list($ctlName, $methodName) = explode('/', $this->route->path);
		
		if (!file_exists('controllers/'.$ctlName.'.php')) {
			throw new Exception("File not found.");
		}

		try {
			require 'controllers/'.$ctlName.'.php';
			$className = ucfirst($ctlName);
			$ctl = new $className($this);
			$args = $this->getArgs($ctl, $methodName, $this->route->params);
			call_user_func_array(array($ctl, $methodName), $args);			
		}
		catch(Exception $e) {
			$this->error(500, $e->getMessage());
		}
	}

	function getArgs($object, $actionMethod, array $params)
	{
		$args = array();
		$rm = new \ReflectionMethod($object, $actionMethod);
		foreach($rm->getParameters() as $param)  {
			$param_value = $params[$param->name];
			if (!strlen($param_value) and !$param->isOptional()) {
				throw new Exception('Required parameter missing.');
			}

			$args[] = isset($param_value)? $param_value : $param->getDefaultValue();
		}

		return $args;
	}

	public function getRouteInfo()
	{
		$uri = rawurldecode($_GET['r']);
		$routeInfo = $this->dispatcher->dispatch($this->httpMethod, $uri);
		$status = $routeInfo[0];

		if ($status == FastRoute\Dispatcher::NOT_FOUND) {
			$this->error(404, 'Not found.');
		}

		if ($status == FastRoute\Dispatcher::METHOD_NOT_ALLOWED) {
			$this->error(405, 'Method Not Allowed.');
		}

		return new RestRoute($routeInfo);
	}


	public function outputJson(array $data)
	{
	  header('Content-Type: application/json; charset=utf-8');
	  die(json_encode($data, JSON_UNESCAPED_UNICODE/*|JSON_PRETTY_PRINT*/));
	}

	public function inputJson()
	{
		$rawBody = file_get_contents('php://input');
		return json_decode($rawBody, true);
	}

	public function error($httpStatus, $message)
	{
		if (function_exists('http_response_code')) {
			http_response_code($httpStatus);
		}

		$data = [
			'type' => 'error',
			'status' => $httpStatus,
			'message' => $message,
		];


		$this->outputJson($data);
	}

	protected function getTokenFromRequest()
	{
		if ($_GET['auth_token']) return $_GET['auth_token'];

		$headers = array_change_key_case(getallheaders(), CASE_LOWER);
		$data = [];
		parse_str($headers['authorization'], $data);
		return $data['token'];
	}

	/**
	 * Is token (api_key) valid?
	 */
	protected function findValidToken($token)
	{
		return false;

		// $found = $this->app->db->select('auth_tokens', "token='{0}' and valid_until>NOW()", $token);

		// if ($found) {
		// 	$this->app->db->update('auth_tokens', "valid_until= NOW() + INTERVAL 2 HOUR", "token='{0}'", $token);
		// }

		// return $found;
	}

	public function authorizeRequest()
	{
		$key = $this->getTokenFromRequest();
		return false;
		// if (!$key) {
		// 	$this->app->auth->logout(); //fix session user
		// 	return;
		// }

		// $token = $this->findValidToken($key);

		// if (!$token) {
		// 	$this->error(403, 'Access forbidden.');
		// }

		// $user = $this->app->auth->getUser($token['username']);
		// $this->app->auth->setLoggedUser($user);
	}



	/**
	 * Check userName and password in AUTH_USERS table. If it is valid, return auth_token.
	 */
	public function login($userName, $password)
	{
		return false;
		// $user = $this->app->auth->getUser($userName);
		// if (!$user or !$user->passwordVerify($password)) return false;

		// $token = randomstr(20);
		
		// $data = [
		// 	'username' => $userName,
		// 	'token' => $token,
		// 	//'valid_until' => date("Y-m-d H:i:s", strtotime("+2 hour")), //na developu je cas 2 hodiny pozadu?
		// ];

		// //delete expired
		// $this->app->db->delete('auth_tokens', "valid_until<NOW()");

		// $this->app->db->insert('auth_tokens', $data);
		// $this->app->db->update('auth_tokens', "valid_until=NOW() + INTERVAL 2 HOUR", "token='{0}'", $token);
		// $this->app->db->update('AUTH_USERS', "LAST_LOGIN=NOW()", pri($user->values['ID']));

		// return $token;
	}

	/**
	 * Get login request and return auth_token or error.
	 */
	public function processLoginRequest()
	{
		$data = $this->inputJson();
		$token = $this->login($data['username'], $data['password']);
		if (!$token) $this->error(401, 'Authorization failed.');
		$this->outputJson(['type' => 'auth_token', 'token' => $token]);		
	}
}

class RestRoute
{
	public $status;
	public $path;
	public $params;

	function __construct(array $info)
	{
		$this->status = $info[0];
		$this->path = $info[1];
		$this->params = $info[2];

	}
}

 ?>