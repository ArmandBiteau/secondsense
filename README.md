# SecondSense - WebGL VR Game

Developed by [Armand Biteau](https://www.armandbiteau.com), [Jordi Bastide](https://www.jordi-bastide.com), and [Denis Tribouillois](https://fr.linkedin.com/pub/denis-tribouillois/b8/585/b39), 3 students of [IMAC](http://www.ingenieur-imac.fr/) engineering school

### Version
Beta 0.0.1

### Tech

* [Vue.js](http://vuejs.org/) - Light Javascript MVC
* [Three.js](http://threejs.org/) - WebGL framework
* [TweenMax/TimelineMax](https://greensock.com/gsap) - Animations library
* [Preload.js](http://www.createjs.com/preloadjs) - Assets loader
* [Gulp.js](http://gulpjs.com/) - Preprocess Scss/Jshint)
* [Browserify](http://browserify.org/) - Requiring js files
* [Express.js](http://expressjs.com/) - Node.js server
* [Socket.io](http://socket.io/) - Node.js real-time engine
* [Slim](http://www.slimframework.com/) - Php microframework for users api
* [Vagrant](https://www.vagrantup.com/) - Local server php/nodejs

### Installation

Before diving into the VR game, please install the latest version of [Vagrant](https://www.vagrantup.com/). And because we'll be using [VirtualBox](https://www.virtualbox.org) as our provider, please install that as well.

Please ensure [Node.js](https://nodejs.org/en) is installed on your laptop, then install Gulp globally :
```sh
$ npm i -g gulp
```

Now it's time to have some folks :
```sh
$ git clone https://github.com/ArmandBiteau/secondsense secondsense
$ cd secondsense

$ npm install

$ gulp
```

Open a new terminal view and run vagrant :
```sh
$ vagrant up
$ vagrant ssh
```

> User login should be "vagrant" without password

Now you're ready to start server. Simply run :
```sh
$ cd /vagrant/public
$ node server.js
```

Go to [secondsense.dev](http://secondsense.dev) and have fun !

### Todos

 - Write Tests
 - Add Code Comments
 - Play the game

License
----

MIT
