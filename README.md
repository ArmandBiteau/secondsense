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

If it's not, install last version of [ChefDK](https://downloads.chef.io/chef-dk/mac/).

Open a new terminal view and run vagrant :
```sh
$ vagrant plugin install vagrant-berkshelf
$ vagrant up
$ vagrant ssh
```

> Normally there is no password

Unfortunatly I didn't share my database, that's why you'll need to create yours (into the ssh):
```sh
$ sudo apt-get install mysql-server
```
> Set "root" password for administrator

```sh
$ sudo apt-get install phpmyadmin
```
> Don't reconfigure automatically web server / db-config : YES / root:root

```sh
$ sudo ln -s /usr/share/phpmyadmin /vagrant/public
$ sudo php5enmod mcrypt
$ sudo service php5-fpm restart

$ exit
```

With that, our phpMyAdmin installation is now operational. To access the interface, go to your server's domain name or public IP address followed by /phpmyadmin, in your web browser:

```sh
http://secondsense.local/phpmyadmin
```

Create a "secondsense" database, with a "secondsense_users" table composed by :
* id - int autoincrement
* name - varchar 50
* score - int 10 default value 0

Now you're ready to start server. Simply run :
```sh
$ cd /vagrant/public
$ node server.js
```

Go to [secondsense.local](http://secondsense.local) and have fun !

### Todos

 - Write Tests
 - Add Code Comments
 - Play the game

License
----

MIT
