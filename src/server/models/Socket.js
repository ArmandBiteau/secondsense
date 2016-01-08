var io = require('socket.io');

import Server from './Server';

class Socket{

    constructor() {

        return io.listen(Server);

    }

}

export default (new Socket());
