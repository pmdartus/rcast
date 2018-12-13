// import { createElement } from 'lwc';
// import Player from 'rcast/player';

// const player = createElement('rcast-player', {
//     is: Player,
//     fallback: false,
// });
// player.titleText = 'Dyson: James Dyson';
// player.coverUrl =
//     'https://media.npr.org/assets/img/2018/02/08/ep68-dyson_wide-0cac8437ffbe9316816290795248fbefdbfb3dbf.jpg?s=1400';
// player.mediaUrl = `/api/stream/${encodeURIComponent(
//     'https://play.podtrac.com/npr-510313/npr.mc.tritondigital.com/NPR_510313/media/anon.npr-mp3/npr/hibt/2018/02/20180209_hibt_dyson.mp3?orgId=1&d=2684&p=510313&story=584331881&t=podcast&e=584331881&ft=pod&f=510313',
// )}`;


// import { createElement } from 'lwc';
// import Discover from 'rcast/discover';

// const page = createElement('rcast-discover', {
//     is: Discover,
//     fallback: false,
// })
// document.body.appendChild(page);

import { createElement } from 'lwc';
import App from 'rcast/app';

const bar = createElement('rcast-discover', {
    is: App,
    fallback: false,
});
document.body.appendChild(bar);