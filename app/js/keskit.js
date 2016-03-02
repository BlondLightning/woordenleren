
/**
 * DOM helper
 */
var doc = (function() {
    var me = {};
    var cbReadies = [];

    me.whenReady = function(cbReady){
        cbReadies.push(cbReady);
    };

    me.find = function(query) {
        var element = document.querySelector(query);

        if (!element)
            console.log('doc.find cannot find element ' + query);
        else {
            // add show and hide methods
            element.show = function () { element.classList.add('show') };
            element.hide = function () { element.classList.remove('show') };
        }

        return element;
    };

    me.forEachElement = function(query, cbFunc) {
        var elements = document.querySelectorAll(query);
        [].forEach.call(elements, cbFunc);
    };

    document.addEventListener("DOMContentLoaded", function () {
        cbReadies.forEach(function(cbReady) {
            cbReady();
        });
    });

    return me;
}.call(this));


/**
 * store for json data
 *
 * to store data    : store.set(name, data)
 * to retrieve data : data = store.get(name)
 * to remove data   : store.del(name)
 */
var store = (function() {
    var _store = {};
    var storage = window['localStorage'] || console.log('error: no localStorage');

    _store.set = function(name, data) {
        storage && storage.setItem(name, JSON.stringify(data));
    };

    _store.del = function(name) {
        storage && storage.removeItem(name);
    };

    _store.get = function(name) {
        var jsonData = null;
        try {
            jsonData = JSON.parse(storage.getItem(name));
        } catch(e) {
            console.log('failed to get data for storage key ' + name);
        }
        return jsonData;
    };

    return _store;

}.call(this));

/**
 * audio player 
 * 
 * player.play(sound) will play file audio/sound.wav
 * player.stop() will stop play
 * 
 */
var player = (function() {
    var me = {};
    var audio = null;
    var loading = false;
    
    function onReady() {
       audio = document.createElement('audio');
       audio.addEventListener("canplaythrough", function() {
          if (loading) {
            loading = false;
            audio.play();
          }
       });
    }
    
    me.play = function(sound) {
      loading = true;
      audio.setAttribute('src', sound);
    };
     
    me.stop = function(sound) {
      audio.pause();
      loading = false;
    };
    
    doc.whenReady(onReady);    

    return me;
}.call());
