import { LightningElement, track } from 'lwc';

const PODCASTS = new Array(20).fill({
    id: 275834665,
    name: 'Apple Keynotes',
    primaryGenreName: 'Tech News',
    releaseDate: '2018-10-30T16:00:00Z',
    feedUrl:
        'http://podcasts.apple.com/apple_keynotes/apple_keynotes.xml',
    artist: {
        id: 706424103,
        name: 'Apple',
    },
    cover: {
        large:
            'https://is4-ssl.mzstatic.com/image/thumb/Music62/v4/3a/05/2c/3a052c9b-2241-5d8c-0b2e-a32b190d6cce/source/600x600bb.jpg',
        medium:
            'https://is4-ssl.mzstatic.com/image/thumb/Music62/v4/3a/05/2c/3a052c9b-2241-5d8c-0b2e-a32b190d6cce/source/100x100bb.jpg',
        small:
            'https://is4-ssl.mzstatic.com/image/thumb/Music62/v4/3a/05/2c/3a052c9b-2241-5d8c-0b2e-a32b190d6cce/source/60x60bb.jpg',
    },
}).map((item, index) => ({
    ...item,
    id: item.id + index
}));

export default class ViewPodcasts extends LightningElement {
    @track podcasts = PODCASTS;

    handlePodcastClick(event) {
        const { podcastId } = event.currentTarget.dataset;
        console.log(podcastId)
    }
}
