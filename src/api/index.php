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
  $vo->id = $id;
  $user->update($vo);

});

$app->run();
