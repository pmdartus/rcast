'use strict';

const path = require('path');
const nock = require('nock');
const request = require('supertest');

const api = require('../../server');
const { _flushAllCaches } = require('../../utils/cache');

const fixturePath = filename =>
    path.resolve(__dirname, `./fixtures/${filename}`);

afterEach(() => {
    _flushAllCaches();
});

it('return 404 if endpoint is unknown', async () => {
    const { status, header, body } = await request(api).get('/api/1/unkown');

    expect(status).toBe(404);
    expect(header['content-type']).toMatch(/json/);
    expect(body).toEqual({
        error: {
            code: 404,
            message: 'Not Found',
        },
    });
});

describe('GET /api/1/search', () => {
    it('should return 400 if term is not present', async () => {
        const { status, body } = await request(api).get('/api/1/search');

        expect(status).toBe(400);
        expect(body).toEqual({
            error: {
                code: 400,
                message: 'Missing required "term" query string.',
            },
        });
    });

    it("should return 503 is iTunes API doesn't responds with a non 200 code", async () => {
        nock('https://itunes.apple.com')
            .get('/search')
            .query(true)
            .replyWithFile(500, fixturePath('search-empty.json'), {
                'Content-Type': 'application/json',
            });
        const { status, body } = await request(api).get(
            '/api/1/search?term=apple',
        );

        expect(status).toBe(503);
        expect(body).toEqual({
            error: {
                code: 503,
                message: 'Service Unavailable',
            },
        });
    });

    it('should query iTunes API with the term query string', async () => {
        const mockApi = nock('https://itunes.apple.com')
            .get('/search')
            .query({
                media: 'podcast',
                term: 'apple',
            })
            .replyWithFile(200, fixturePath('search-empty.json'), {
                'Content-Type': 'application/json',
            });
        await request(api).get('/api/1/search?term=apple');

        expect(mockApi.isDone()).toBe(true);
    });

    it('should return an empty list when not matching podcast is found', async () => {
        nock('https://itunes.apple.com')
            .get('/search')
            .query(true)
            .replyWithFile(200, fixturePath('search-empty.json'), {
                'Content-Type': 'application/json',
            });
        const { status, body } = await request(api).get(
            '/api/1/search?term=apple',
        );

        expect(status).toBe(200);
        expect(body).toEqual({
            count: 0,
            results: [],
        });
    });

    it('should return a list of matching podcasts', async () => {
        nock('https://itunes.apple.com')
            .get('/search')
            .query(true)
            .replyWithFile(200, fixturePath('search-apple.json'), {
                'Content-Type': 'application/json',
            });
        const { status, body } = await request(api).get(
            '/api/1/search?term=apple',
        );

        expect(status).toBe(200);
        expect(body.results).toHaveLength(50);
        expect(body.results[0]).toEqual({
            id: 275834665,
            name: 'Apple Keynotes',
            image:
                'https://is4-ssl.mzstatic.com/image/thumb/Music62/v4/3a/05/2c/3a052c9b-2241-5d8c-0b2e-a32b190d6cce/source/100x100bb.jpg',
            feedUrl:
                'http://podcasts.apple.com/apple_keynotes/apple_keynotes.xml',
            author: {
                id: 706424103,
                name: 'Apple',
            },
        });
    });
});

describe('GET /api/1/top', () => {
    it('should return 400 if genreId is not present', async () => {
        const { status, body } = await request(api).get('/api/1/top');

        expect(status).toBe(400);
        expect(body).toEqual({
            error: {
                code: 400,
                message: 'Missing required "genreId" query string.',
            },
        });
    });

    it("should return 503 is iTunes API doesn't responds with a non 200 code", async () => {
        nock('https://itunes.apple.com')
            .get('/us/rss/toppodcasts/genre=123/json')
            .query(true)
            .replyWithFile(500, fixturePath('top-podcasts.json'), {
                'Content-Type': 'application/json',
            });
        const { status, body } = await request(api).get(
            '/api/1/top?genreId=123',
        );

        expect(status).toBe(503);
        expect(body).toEqual({
            error: {
                code: 503,
                message: 'Service Unavailable',
            },
        });
    });

    it('should query iTunes API with genreId and us country by default', async () => {
        const mock = nock('https://itunes.apple.com')
            .get('/us/rss/toppodcasts/genre=123/json')
            .replyWithFile(200, fixturePath('top-podcasts.json'), {
                'Content-Type': 'application/json',
            });
        await request(api).get('/api/1/top?genreId=123');

        expect(mock.isDone()).toBe(true);
    });

    it('should query iTunes API with genreId and country', async () => {
        const mock = nock('https://itunes.apple.com')
            .get('/fr/rss/toppodcasts/genre=123/json')
            .replyWithFile(200, fixturePath('top-podcasts.json'), {
                'Content-Type': 'application/json',
            });
        await request(api).get('/api/1/top?genreId=123&country=fr');

        expect(mock.isDone()).toBe(true);
    });

    it('should return a list of the top podcasts', async () => {
        nock('https://itunes.apple.com')
            .get('/us/rss/toppodcasts/genre=123/json')
            .replyWithFile(200, fixturePath('top-podcasts.json'), {
                'Content-Type': 'application/json',
            });
        const { status, body } = await request(api).get(
            '/api/1/top?genreId=123',
        );

        expect(status).toBe(200);
        expect(body.count).toBe(50);
        expect(body.results).toHaveLength(50);
        expect(body.results[0]).toEqual({
            id: '523121474',
            name: 'TED Radio Hour - NPR',
            image:
                'https://is3-ssl.mzstatic.com/image/thumb/Podcasts118/v4/ef/e2/d4/efe2d4c6-a7cf-0eb4-cd60-a94ec7720f98/mza_1915696984681289998.jpg/170x170bb-85.png',
            author: {
                id: '125443881',
                name: 'NPR',
            },
        });
    });
});

describe('GET /podcasts/:id', () => {
    it("should return 404 if the podcast doesn't exists", async () => {
        nock('https://itunes.apple.com')
            .get('/lookup')
            .query(true)
            .replyWithFile(200, fixturePath('search-empty.json'), {
                'Content-Type': 'application/json',
            });
        const { status, body } = await request(api).get('/api/1/podcasts/123');

        expect(status).toBe(404);
        expect(body).toEqual({
            error: {
                code: 404,
                message: 'Not Found',
            },
        });
    });

    it('should query iTunes API and the feedUrl', async () => {
        const mockSearchApi = nock('https://itunes.apple.com')
            .get('/lookup')
            .query({
                id: '123',
            })
            .replyWithFile(200, fixturePath('lookup-apple-keynotes.json'), {
                'Content-Type': 'application/json',
            });
        const mockFeedApi = nock('http://podcasts.apple.com')
            .get('/apple_keynotes/apple_keynotes.xml')
            .replyWithFile(200, fixturePath('feed-apple-keynotes.xml'), {
                'Content-Type': 'application/xml',
            });
        await request(api).get('/api/1/podcasts/123');

        expect(mockSearchApi.isDone()).toBe(true);
        expect(mockFeedApi.isDone()).toBe(true);
    });

    it('should return the podcast information with the associated episodes', async () => {
        nock('https://itunes.apple.com')
            .get('/lookup')
            .query({
                id: '123',
            })
            .replyWithFile(200, fixturePath('lookup-apple-keynotes.json'), {
                'Content-Type': 'application/json',
            });
        nock('http://podcasts.apple.com')
            .get('/apple_keynotes/apple_keynotes.xml')
            .replyWithFile(200, fixturePath('feed-apple-keynotes.xml'), {
                'Content-Type': 'application/xml',
            });
        const { status, body } = await request(api).get('/api/1/podcasts/123');

        expect(status).toBe(200);

        expect(body).toMatchObject({
            name: 'Apple Keynotes',
            subtitle: "Video of Apple's most important announcements.",
            description:
                "The Apple Keynotes podcast offers video of the company's most important announcements, including presentations by Apple CEO Tim Cook.",
            author: {
                id: 706424103,
                name: 'Apple'
            },
            language: 'en-us',
            link: 'http://www.apple.com/',
            image:
                'http://podcasts.apple.com/apple_keynotes/images/0326_apple_keynote_logo.png',
            episodes: expect.any(Array),
        });

        expect(body.episodes).toHaveLength(3);
        expect(body.episodes[0]).toEqual({
            id:
                'http://podcasts.apple.com/apple_keynotes/2018/october2018_sd.m4v',
            title: 'Apple Special Event, October 2018',
            description:
                'See Apple CEO Tim Cook and team introduce the new Mac mini, MacBook Air, iPad Pro with all-screen design, and second-generation Apple Pencil.',
            image: null,
            duration: 5482,
            publication_date: '2018-10-30T16:00:00.000Z',
            audio: {
                length: '875337117',
                type: 'video/x-m4v',
                url:
                    'http://podcasts.apple.com/apple_keynotes/2018/october2018_sd.m4v',
            },
        });
    });
});
