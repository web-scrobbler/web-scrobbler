export {};

Connector.playerSelector = '.musica-info';

Connector.artistSelector = '#nome-artista';

Connector.trackSelector = '#nome-musica';

Connector.trackArtSelector = '#capa-album';

Connector.isPlaying = () => Util.hasElementClass('#botao-play', 'tocando');
