import { LightningElement, track } from 'lwc';

const PODCAST = {
    name: 'Apple Keynotes',
    subtitle: "Video of Apple's most important announcements.",
    description:
        "The Apple Keynotes podcast offers video of the company's most important announcements, including presentations by Apple CEO Tim Cook.",
    author: {
        id: 706424103,
        name: 'Apple',
    },
    language: 'en-us',
    link: 'http://www.apple.com/',
    image:
        'http://podcasts.apple.com/apple_keynotes/images/0326_apple_keynote_logo.png',
    categories: ['Technology', 'Tech News/Tech News'],
};

const EPISODE = {
    id: 'http://podcasts.apple.com/apple_keynotes/2018/october2018_sd.m4v',
    title: 'Apple Special Event, October 2018',
    description:
        'See Apple CEO Tim Cook and team introduce the new Mac mini, MacBook Air, iPad Pro with all-screen design, and second-generation Apple Pencil.',
    image: 'https://media.npr.org/assets/img/2017/04/07/instacart_final_wide-cd1c958048af98afb8deb9450570866ffe324b5e.jpg?s=1400',
    duration: 5482,
    publication_date: '2018-10-30T16:00:00.000Z',
    audio: {
        length: '875337117',
        type: 'video/x-m4v',
        url:
            'http://podcasts.apple.com/apple_keynotes/2018/october2018_sd.m4v',
    },
};

export default class PlayerCondensed extends LightningElement {
    @track podcast = PODCAST;
    @track episode = EPISODE;

    @track state = {
        playing: false,
    };

    get cover() {
        return this.episode.image || this.podcast.image;
    }

    handleHeadClick() {
        console.log('click head')
    }

    handlePlayPauseClick(event) {
        // Stop the event propagation to avoid being handled like a click on the head.
        event.stopPropagation();
    }
}
