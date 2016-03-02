var dingen = [
  { woord: 'boom', 	plaatje: 'boom',  geluid: '', spraak: 'boom'},
  { woord: 'huis', 	plaatje: 'huis',  geluid: '', spraak: 'huis'},
  { woord: 'plant', plaatje: 'plant', geluid: '', spraak: 'plant'},
  { woord: 'steen', plaatje: 'steen', geluid: '', spraak: 'steen'},
  { woord: 'stoel', plaatje: 'stoel', geluid: '', spraak: 'stoel'},
  { woord: 'tafel', plaatje: 'tafel', geluid: '', spraak: 'tafel'},
  { woord: 'bank', 	plaatje: 'bank',  geluid: '', spraak: 'bank'},
  { woord: 'roos', 	plaatje: 'roos',  geluid: '', spraak: 'roos'},
  { woord: 'boot', 	plaatje: 'boot',  geluid: '', spraak: 'boot'},
  { woord: 'wolk', 	plaatje: 'wolk',  geluid: '', spraak: 'wolk'},
  { woord: 'vuur', 	plaatje: 'vuur',  geluid: '', spraak: 'vuur'},
  { woord: 'pet', 	plaatje: 'pet',   geluid: '', spraak: 'pet'},
  { woord: 'bal', 	plaatje: 'bal',   geluid: '', spraak: 'bal'},
  { woord: 'appel', plaatje: 'appel', geluid: '', spraak: 'appel'},
  { woord: 'kat',    plaatje: 'kat', 	geluid: 'kat',    spraak: 'kat'},
  { woord: 'hond',   plaatje: 'hond', 	geluid: 'hond',   spraak: 'hond'},
  { woord: 'kip',    plaatje: 'kip', 	geluid: 'kip',    spraak: 'kip'},
  { woord: 'varken', plaatje: 'varken', geluid: 'varken', spraak: 'varken'},
  { woord: 'eend',   plaatje: 'eend', 	geluid: 'eend',   spraak: 'eend'},
  { woord: 'schaap', plaatje: 'schaap', geluid: 'schaap', spraak: 'schaap'},
  { woord: 'koe',    plaatje: 'koe',    geluid: 'koe',    spraak: 'koe'}
];


var main = (function() {
    var main = {};

    /*
     *  metPlaatje: als waar selecteer dan dingen met plaatje
     *  metGeluid: als waar selecteer dan dingen met geluid
     *  metSpraak: als waar selecteer dan dingen met spraak
     */
    main.selecteerSet = function(metPlaatje, metGeluid, metSpraak) {
        var aantal = 5;
        var bron = [];
        var resultaat = [];

        // zet alle dingen in bron die voldoen aan metPlaatje, metGeluid, metSpraak
        for (var i=0; i<dingen.length; i++)
            if ((!metPlaatje || dingen[i].plaatje) && (!metGeluid || dingen[i].geluid) && (!metSpraak || dingen[i].spraak))
                bron.push(dingen[i]);

        // aantal mag niet groter zijn dan het aantal dingen in de bron
        if (aantal > bron.length) aantal = bron.length;

        // haal random dingen uit de bron en plaats ze in resultaat
        while (resultaat.length < aantal) {
            var index = Math.floor(Math.random() * bron.length);
            resultaat.push(bron.splice(index, 1)[0]);
        }

        return resultaat;
    };

    return main;
}.call());

