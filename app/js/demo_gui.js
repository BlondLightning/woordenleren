
/*
 * a javascript object related to the page_main element
 */
var page_main = (function() {
    "use strict";
    var page = {};

    var ua = window.navigator.userAgent;
    if (ua.indexOf('MSIE ')>0 || ua.indexOf('Trident/') > 0 || ua.indexOf('Edge/') > 0)
        alert('Internet Explorer en Edge browser worden niet ondersteund');


    function onReady() {

        doc.find('.content').onclick = function(click) {

            if (click.target.dataset.spraak) {
                doc.forEachElement('div.x-button', function(button) {
                   button.classList.remove('playing');
                });
                click.target.classList.add('playing');
                player.play(click.target.dataset.spraak);
            }

            if (click.target.dataset.geluid) {
                doc.forEachElement('div.x-button', function(button) {
                    button.classList.remove('playing');
                });
                click.target.classList.add('playing');
                player.play(click.target.dataset.geluid);
            }
        };
    }

    doc.whenReady(onReady);

    return page;
}.call());


var app = (function(){
    var app = {};

    doc.whenReady(function(){

        doc.find('body').onclick = function(click) {
                if (click.target.dataset.action == "aboutpage") {
                    doc.find('#page_main').hide();
                    doc.find('#page_intro').show();
                }
        };

        doc.forEachElement('#page_intro div.content > div > div.x-button', function(button){
            button.onclick = function(event) {
                // als event.target een span is, is de parent daarvan de button
                var button = event.target.tagName == 'SPAN' ? event.target.parentElement : event.target;
                switch (button.dataset.action) {
                    case 'woorden-plaatjes': tekenWoordenMetPlaatjes(); break;
                    case 'woorden-spraak': tekenWoordenMetSpraak(); break;
                    case 'plaatjes-geluid': tekenPlaatjesMetGeluid(); break;
                    case 'plaatjes-woorden': tekenPlaatjesMetWoorden(); break;
                    case 'plaatjes-spraak': tekenPlaatjesMetSpraak(); break;
                }
                doc.find('#page_main').show();
                doc.find('#page_intro').hide();
            };
        });
    });

    var grid = (function(){
        var g = {};
        var cellBase = [
            [0,0], [0,1], [0,2], [0,3], [0,4],
            [1,0], [1,1], [1,2], [1,3], [1,4],
            [2,0], [2,1], [2,2], [2,3], [2,4],
            [3,0], [3,1], [3,2], [3,3], [3,4],
            [4,0], [4,1], [4,2], [4,3], [4,4]
        ];
        var cells = cellBase.slice();

        g.clear = function() {
            doc.find('div.grid').innerHTML = '';
            doc.find('div.grid').className = 'grid';
            cells = cellBase.slice();
        };

        g.ok = function() {
            doc.find('div.grid').className = 'grid done';
        };

        g.addButton = function(button) {
            if (cells.length == 0) return;
            var butPos = cells.splice(Math.floor(Math.random() * cells.length), 1)[0];
            button.style.left = (butPos[0] * 20) + '%';
            button.style.top = (butPos[1] * 20) + '%';
            doc.find('div.grid').appendChild(button);
        };

        return g;
    }.call());

    // zie https://developer.mozilla.org/en-US/docs/Web/Events/dragover
    var maakDropContainer = function(container) {

        container.addEventListener('dragover', function(event) {
            event.preventDefault();
        });

        container.addEventListener('dragenter', function(event) {
            event.target.classList.add('liang');
        });

        container.addEventListener('dragleave', function(event) {
            event.target.classList.remove('liang');
        });

        container.addEventListener('drop', function(event) {
            event.preventDefault();

            if (event.target.dataset.woord == event.dataTransfer.getData("text/plain")) {
                var button = doc.find('div.grid > div.x-button[data-woord="'+event.target.dataset.woord+'"]');
                if (button) {
                    button.parentNode.removeChild(button);
                    event.target.parentNode.replaceChild(button, event.target);
                    // spraak?
                    if (button.dataset.geluid)
                        player.play(button.dataset.geluid);
                    else if (button.dataset.spraak)
                        player.play(button.dataset.spraak);

                    // alle woorden zijn gedaan als er geen empty buttons meer zijn
                    if (!doc.find('div.empty')) {
                        grid.ok();
                    }
                }
            }
        });

    };

    // zie https://developer.mozilla.org/en-US/docs/Web/Events/dragover
    var maakDragItem = function(item) {
        item.draggable = true;

        item.addEventListener('dragstart', function(event) {
            console.log('dragstart', event.target);
            event.target.classList.add('dragging');
            event.dataTransfer.setData("text/plain", event.target.dataset.woord);
        }, false);

        item.addEventListener('dragend', function(event) {
            event.target.classList.remove('dragging');
            doc.forEachElement('div.buttons div.x-button', function(button){
                button.classList.remove('liang');
            });
        }, false);
    };

    var tekenPlaatjesMetWoorden = function() {
        // titel
        doc.find('span.title').innerHTML = 'Plaatjes met Woorden';

        // maak button div leeg
        var dummy = document.createDocumentFragment();
        doc.find('div.buttons').innerHTML = '';
        grid.clear();

        // maak buttons
        var randomDingen = main.selecteerSet(true, false, false);

        randomDingen.forEach( function(ding) {

            // button met plaatje
            var button = document.createElement('div');
            button.className = 'x-button';
            //button.innerHTML = ding.woord;
            // in dataset mogen we eigen variabelen zetten
            button.dataset.woord = ding.woord;
            button.style.backgroundImage = 'url("images/' + ding.plaatje + '.png")';
            button.style.backgroundColor = '#600';
            button.style.backgroundSize = '50%';
            dummy.appendChild(button);

            // lege button
            var leeg = document.createElement('div');
            leeg.className = 'empty x-button';
            leeg.dataset.woord = ding.woord;
            maakDropContainer(leeg);
            dummy.appendChild(leeg);

            // woord button
            var woord = document.createElement('div');
            woord.className = 'x-button';
            maakDragItem(woord);
            // in dataset mogen we eigen variabelen zetten
            woord.dataset.woord = ding.woord;
            woord.innerHTML = ding.woord;
            // voeg toe aan grid
            grid.addButton(woord);

        });

        doc.find('div.buttons').appendChild(dummy);
    };

    var tekenWoordenMetPlaatjes = function() {
        // titel
        doc.find('span.title').innerHTML = 'Woorden met Plaatjes';

        // maak button div leeg
        var dummy = document.createDocumentFragment();
        doc.find('div.buttons').innerHTML = '';
        grid.clear();

        // maak buttons
        var randomDingen = main.selecteerSet(true, false, false);

        randomDingen.forEach( function(ding) {

            // button met plaatje
            var button = document.createElement('div');
            button.className = 'x-button';
            //button.innerHTML = ding.woord;
            // in dataset mogen we eigen variabelen zetten
            button.dataset.woord = ding.woord;
            //button.style.backgroundImage = 'url("images/' + ding.plaatje + '.png")';
            button.style.backgroundColor = '#600';
            //button.style.backgroundSize = '50%';
            button.innerHTML = ding.woord;
            dummy.appendChild(button);

            // lege button
            var leeg = document.createElement('div');
            leeg.className = 'empty x-button';
            leeg.dataset.woord = ding.woord;
            maakDropContainer(leeg);
            dummy.appendChild(leeg);

            // woord button
            var woord = document.createElement('div');
            woord.className = 'x-button';
            maakDragItem(woord);
            // in dataset mogen we eigen variabelen zetten
            woord.dataset.woord = ding.woord;
            woord.style.backgroundImage = 'url("images/' + ding.plaatje + '.png")';
            woord.style.backgroundColor = '#600';
            woord.style.backgroundSize = '50%';

            // voeg toe aan grid
            grid.addButton(woord);

        });

        doc.find('div.buttons').appendChild(dummy);
    };

    var tekenPlaatjesMetSpraak = function() {
        // titel
        doc.find('span.title').innerHTML = 'Plaatjes met Spraak';

        // maak button div leeg
        var dummy = document.createDocumentFragment();
        doc.find('div.buttons').innerHTML = '';
        grid.clear();

        // maak buttons
        var randomDingen = main.selecteerSet(true, false, true);

        randomDingen.forEach( function(ding) {

          // button met plaatje
            var button = document.createElement('div');
            button.className = 'x-button';
            //button.innerHTML = ding.woord;
            // in dataset mogen we eigen variabelen zetten
            button.dataset.woord = ding.woord;
            button.style.backgroundImage = 'url("images/' + ding.plaatje + '.png")';
            button.style.backgroundColor = '#600';
            button.style.backgroundSize = '50%';
            dummy.appendChild(button);
          // lege button
            var leeg = document.createElement('div');
            leeg.className = 'empty x-button';
            leeg.dataset.woord = ding.woord;
            maakDropContainer(leeg);
            dummy.appendChild(leeg);

          // spraak button
            var spraak = document.createElement('div');
            spraak.className = 'x-button';
            maakDragItem(spraak);
            // in dataset mogen we eigen variabelen zetten
            spraak.dataset.woord = ding.woord;
            spraak.dataset.spraak = 'audio/Nl-' + ding.spraak + '.ogg';
            spraak.style.backgroundImage = 'url("images/speaker.png")';
            spraak.style.backgroundColor = '#600';
            spraak.style.backgroundSize = '50%';
          // voeg toe aan grid
            grid.addButton(spraak);

        });

        doc.find('div.buttons').appendChild(dummy);
    };

    var tekenWoordenMetSpraak = function() {
        // titel
        doc.find('span.title').innerHTML = 'Woorden met Spraak';

        // maak button div leeg
        var dummy = document.createDocumentFragment();
        doc.find('div.buttons').innerHTML = '';
        grid.clear();

        // maak buttons
        var randomDingen = main.selecteerSet(true, false, true);

        randomDingen.forEach( function(ding) {

            // button met woord
            var button = document.createElement('div');
            button.className = 'x-button';
            button.innerHTML = ding.woord;
            // in dataset mogen we eigen variabelen zetten
            button.dataset.woord = ding.woord;
            button.style.background = '#600';
            dummy.appendChild(button);
            // lege button
            var leeg = document.createElement('div');
            leeg.className = 'empty x-button';
            leeg.dataset.woord = ding.woord;
            maakDropContainer(leeg);
            dummy.appendChild(leeg);

            // spraak button
            var spraak = document.createElement('div');
            spraak.className = 'x-button';
            maakDragItem(spraak);
            // in dataset mogen we eigen variabelen zetten
            spraak.dataset.woord = ding.woord;
            spraak.dataset.spraak = 'audio/Nl-' + ding.spraak + '.ogg';
            spraak.style.backgroundImage = 'url("images/speaker.png")';
            spraak.style.backgroundColor = '#600';
            spraak.style.backgroundSize = '50%';
            // voeg toe aan grid
            grid.addButton(spraak);

        });

        doc.find('div.buttons').appendChild(dummy);
    };

    var tekenPlaatjesMetGeluid = function() {
        // titel
        doc.find('span.title').innerHTML = 'Plaatjes met Geluid';

        // maak button div leeg
        var dummy = document.createDocumentFragment();
        doc.find('div.buttons').innerHTML = '';
        grid.clear();

        // maak buttons
        var randomDingen = main.selecteerSet(true, true, false);

        randomDingen.forEach( function(ding) {

            // button met plaatje
            var button = document.createElement('div');
            button.className = 'x-button';
            //button.innerHTML = ding.woord;
            // in dataset mogen we eigen variabelen zetten
            button.dataset.woord = ding.woord;
            button.style.backgroundImage = 'url("images/' + ding.plaatje + '.png")';
            button.style.backgroundColor = '#600';
            button.style.backgroundSize = '50%';
            dummy.appendChild(button);
            // lege button
            var leeg = document.createElement('div');
            leeg.className = 'empty x-button';
            leeg.dataset.woord = ding.woord;
            maakDropContainer(leeg);
            dummy.appendChild(leeg);

            // geluid button
            var geluid = document.createElement('div');
            geluid.className = 'x-button';
            maakDragItem(geluid);
            // in dataset mogen we eigen variabelen zetten
            geluid.dataset.woord = ding.woord;
            geluid.dataset.geluid = 'audio/' + ding.geluid + '.ogg';
            geluid.style.backgroundImage = 'url("images/speaker.png")';
            geluid.style.backgroundColor = '#600';
            geluid.style.backgroundSize = '50%';
            // voeg toe aan grid
            grid.addButton(geluid);

        });

        doc.find('div.buttons').appendChild(dummy);
    };

    return app;
}.call());

