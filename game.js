(function () {
    var amoba= new Amoba();


    function tablaRajzol(stateTable) {
        var s = '';

        for (var i = 0; i < 20; i++) {
            s += '<tr>';
            for (var j = 0; j < 20; j++) {
                var state = stateTable[i + ',' + j];
                if (!state) {
                    state = '&nbsp;';
                } else if (state === 1) {
                    state = 'X';
                } else {
                    state = 'O';
                }
                s += '<td i="' + i + '" j="' + j + '">' + state + '</td>';
            }
            s += '</tr>';
        }

        document.getElementById('table').innerHTML = s;
    }

    document.getElementById('table').onclick = function (e) {
        if (e.target.tagName === 'TD') {
            var i = e.target.getAttribute('i');
            var j = e.target.getAttribute('j');

            amoba.step(i, j);
            amoba.stepComputer();

            tablaRajzol(amoba.getStateTable());
        }
    };

    tablaRajzol({});
})();