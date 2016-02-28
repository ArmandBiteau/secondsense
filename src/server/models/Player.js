'use strict';

class Player {

	constructor(id, name, score, picture) {

		this.id = id;

		this.name = name;

		this.score = score;

		this.picture = picture;

		this.x = 0;

		this.y = 0;

		this.z = 0;

		this.gems = 0;

	}

	addGem() {

		this.gems++;

	}

}

export default Player;
