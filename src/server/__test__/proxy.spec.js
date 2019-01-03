'use strict';

const nock = require('nock');
const request = require('supertest');

const api = require('../server');

function proxifyUrl(url) {
    return `/proxy/${encodeURI(url)}`;
}

it('should forward request', async () => {
    nock('http://foo.com')
        .get('/bar')
        .reply(200, 'hello world!');

    const { status, text } = await request(api).get(proxifyUrl('http://foo.com/bar'));

    expect(status).toBe(200);
    expect(text).toBe('hello world!');
});

function testReplyError(code) {
    it(`should respond with 503 on ${code} error`, async () => {
        nock('http://foo.com')
            .get('/bar')
            .replyWithError({
                code,
            });

        const { status } = await request(api).get(proxifyUrl('http://foo.com/bar'));

        expect(status).toBe(503);
    });
}

testReplyError('ECONNRESET');
testReplyError('ECONNREFUSED');
