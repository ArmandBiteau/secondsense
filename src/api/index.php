<?php

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

$app->put('/users/:id/friends', function($id) use($user, $app) {

  $request = $app->request();
  $body = $request->getBody();
  $vo = json_decode($body);
  $vo->facebook_user_id = $id;

  foreach ($vo->friends as $friend) {

    // Test if player friend exists in db
    if (! $user->playerExists($friend->id)){
      continue;
    }

    // Test if they are friends in db
    if (! $user->areFriends($id, $friend->id)){

      // Then add relationship
      $user->addFriend($id, $friend->id);
    }
  }

  //TO DO : Check if all db friends still are FB friends

});

$app->run();
