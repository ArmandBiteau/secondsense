'use strict';

class Player {

	constructor(id, name, score, picture) {

		this.id = id;

		this.name = name;

		this.score = score;

		this.color = this.getRandomColor();

		this.picture = picture;

		this.x = 0;

		this.y = 0;

		this.z = 0;

		this.gems = 0;

	}

	addGem() {

		this.gems++;

	}

	getRandomColor() {

	    return '#'+Math.floor(Math.random()*16777215).toString(16);

	}

}

export default Player;
