<?php 

require 'vendor/autoload.php';
require 'libs/RestApi.php';
require 'controllers/BaseController.php';

$restApi = new RestApi();

$routes = function($r) {
    $r->addRoute('POST', 'login', 'login');
    $r->addRoute('GET', 'worlds', 'worlds/index');
    $r->addRoute('GET', 'worlds/{name}', 'worlds/show');
    //$r->addRoute('GET', 'test/{id:\d+}[/{title}]', 'test/test');
    // // {id} must be a number (\d+)
    // $r->addRoute('GET', 'user/{id:\d+}', 'get_user_handler');
    // // The /{title} suffix is optional
    // $r->addRoute('GET', 'articles/{id:\d+}[/{title}]', 'get_article_handler');
};

$restApi->addRoutes($routes);
$restApi->run();

?>