<?php

// Allow from any origin
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');    // cache for 1 day
}

// Access-Control headers are received during OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
        header("Access-Control-Allow-Methods: GET, PUT, POST, OPTIONS");

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

    exit(0);
}

require_once 'Slim/Slim.php';
require_once 'models/User.php';

$app = new Slim();
$user = new User();

$app->get('/users', function() use($user) {

  $user->getAll();

});

$app->get('/users/:id', function($id) use($user) {

  $user->getById($id);

});

$app->get('/users/:id/friends', function($id) use($user) {

  $user->getFriends($id);

});

$app->get('/users/:id/score', function($id) use($user) {

  $user->getScore($id);

});

$app->get('/users/:id/rewards', function($id) use($user) {

  $user->getRewards($id);

});

$app->get('/users/search/:name', function($name) use($user) {

  $user->getByName($name);

});

$app->delete('/users/:id', function($id) use($user) {

  $user->delete($id);

});

$app->post('/users', function() use($user, $app) {

  $request = $app->request();
  $body = $request->getBody();
  $vo = json_decode($body);
  $user->insert($vo);

});

$app->put('/users/:id', function($id) use($user, $app) {

  $request = $app->request();
  $body = $request->getBody();
  $vo = json_decode($body);
  $vo->facebook_user_id = $id;
  $user->update($vo);

});

$app->put('/users/:id/score', function($id) use($user, $app) {

  $request = $app->request();
  $body = $request->getBody();
  $vo = json_decode($body);
  $vo->facebook_user_id = $id;
  $user->updateScore($vo);

});

$app->put('/users/:id/friends', function($id) use($user, $app) {

  $request = $app->request();
  $body = $request->getBody();
  $vo = json_decode($body);
  $vo->facebook_user_id = $id;

  foreach ($vo->friends as $friend) {

    if (! $user->playerExists($friend->id)) {

      continue;

    }

    if (! $user->areFriends($id, $friend->id)) {

      $user->addFriend($id, $friend->id);
      $user->addFriend($friend->id, $id);
    }
  }

  //TO DO : Check if all db friends still are FB friends

});

$app->run();
