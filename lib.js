(function () {
    var PLAYER1 = 1;
    var PLAYER2 = 2;
    var NOBODY = 3;

    var DEPTH = 4;

    var DIRS = [
        [-1, -1],
        [0, -1],
        [1, -1],
        [-1, 0],
        [1, 0],
        [-1, 1],
        [0, 1],
        [1, 1]
    ];

    function has5inDirAndItIsTheFirst(pos, table, dir) {
        var current = table[pos];
        var posa = pos.split(',');
        var x = parseInt(posa[0]);
        var y = parseInt(posa[1]);
        if (table[(x - dir[0]) + ',' + (y - dir[1])] !== current) { //opposite dir
            for (var i = 1; i < 5; i++) {
                if (table[(x + dir[0] * i) + ',' + (y + dir[1] * i)] !== current) {
                    return false;
                }
            }
            return true;
        }
        return false;
    }

    function Game() {
        var state = new State();

        this.step = function (x, y) {
            state = new Step(state, x, y).execute();
        };

        this.stepComputer = function () {
            state = state.bestStep().execute();
        };

        this.getStateTable = function () {
            return state.table;
        };
    };

    function State() {
        this.table = {};
        this.next = PLAYER1;
    }

    State.prototype.add = function (x, y) {
        this.table[x + ',' + y] = this.next;
        if (this.next === PLAYER1) {
            this.next = PLAYER2;
        } else {
            this.next = PLAYER1;
        }
    };

    State.prototype.copy = function () {
        var result = new State(this.table['0,0']);
        result.next = this.next;
        for (var i in this.table) {
            result.table[i] = this.table[i];
        }
        return result;
    };

    State.prototype.getWinner = function () {
        for (var i in this.table) {
            for (var j = 0; j < DIRS.length; j++) {
                if (has5inDirAndItIsTheFirst(i, this.table, DIRS[j])) {
                    return this.table[i];
                }
            }
        }
        return NOBODY;
    };

    State.prototype.getWinnerRecursive = function (depth) {
        var winner = this.getWinner();
        if (winner !== NOBODY) {
            return winner;
        } else if (depth > 0) {
            var nextSteps = this.getNextSteps();

            var lastWinner = NOBODY;

            for (var j = 0; j < nextSteps.length; j++) {
                winner = nextSteps[j].execute().getWinnerRecursive(depth - 1);
                if (winner === this.next) { //van egy nyerő lépésem -> nyertem
                    return winner;
                }
                if (j === 0) {
                    lastWinner = winner;
                } else if (winner !== lastWinner) {
                    lastWinner = NOBODY;
                }
            }
            return lastWinner;
        }
        return NOBODY;
    };

    State.prototype.getNextSteps = function () {
        var stepsSet = {};
        var coord, x, y;

        for (coord in this.table) {
            coord = coord.split(',');
            x = parseInt(coord[0]);
            y = parseInt(coord[1]);
            for (var i = x - 1; i <= x + 1; i++) {
                for (var j = y - 1; j <= y + 1; j++) {
                    var key = i + ',' + j;
                    if (!this.table[key]) { //szabad hely
                        stepsSet[key] = true;
                    }
                }
            }
        }

        var steps = [];
        for (coord in stepsSet) {
            coord = coord.split(',');
            var x = parseInt(coord[0]);
            var y = parseInt(coord[1]);
            steps.push(new Step(this, x, y));
        }
        return steps;
    };

    State.prototype.bestStep = function () {
        var nextSteps = this.getNextSteps();
        var winning = [];
        var neutral = [];
        var losing = [];
        var target;
        for (var i = 0; i < nextSteps.length; i++) {
            var winner = nextSteps[i].execute().getWinnerRecursive(DEPTH);
            if (winner === this.next) {
                target = winning;
            } else if (winner === NOBODY) {
                target = neutral;
            } else {
                target = losing;
            }
            target.push(nextSteps[i]);
        }
        var best;
        if (winning.length) {
            best = winning;
            console.log('found winning strategy!');
        } else if (neutral.length) {
            best = neutral;
        } else {
            best = losing;
            console.log('only losing is possible :(');
        }
        return best[Math.floor(Math.random() * best.length)];
    };

    function Step(state, x, y) {
        this.state = state;
        this.x = x;
        this.y = y;
    }

    Step.prototype.execute = function () {
        var result = this.state.copy();
        result.add(this.x, this.y);
        return result;
    };

    window.Amoba = Game;
})();