'use strict';

const request = require('supertest');

const api = require('../server');

function testReturnHTMLEntry(path) {
    it(`responds with the HTML entry when requesting ${path} `, async () => {
        const { status, text } = await request(api).get(path);

        expect(status).toBe(200);
        expect(text).toContain('<title>rcast</title>');
    });
}

testReturnHTMLEntry('/');
testReturnHTMLEntry('/index.html');
testReturnHTMLEntry('/podcasts');

it('responds with a static asset if present', async () => {
    const { status, header } = await request(api).get('/js/main.js');

    expect(status).toBe(200);
    expect(header['content-type']).toContain('application/javascript');
});

it('gzips the response if supported', async () => {
    const { header } = await request(api).get('/');

    expect(header['content-encoding']).toBe('gzip');
});
