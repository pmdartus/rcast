// API documentation
// https://affiliate.itunes.apple.com/resources/documentation/itunes-store-web-service-search-api/


// iTune API genre/subgenre name id mapping. More details:
// https://affiliate.itunes.apple.com/resources/documentation/genre-mapping/
const PODCAST_GENRE_MAPPING = [
    {
        id: 1301,
        name: 'Arts',
        subGenre: [
            { id: 306, name: 'Food' },
            { id: 1401, name: 'Literature' },
            { id: 1402, name: 'Design' },
            { id: 1405, name: 'Performing Arts' },
            { id: 1406, name: 'Visual Arts' },
            { id: 1459, name: 'Fashion & Beauty' },
        ],
    },
    {
        id: 1303,
        name: 'Comedy',
        subGenre: [],
    },
    {
        id: 1304,
        name: 'Education',
        subGenre: [
            { id: 1415, name: 'K–12' },
            { id: 1416, name: 'Higher Education' },
            { id: 1468, name: 'Educational Technology' },
            { id: 1469, name: 'Language Courses' },
            { id: 1470, name: 'Training' },
        ],
    },
    {
        id: 1307,
        name: 'Health',
        subGenre: [
            { id: 1417, name: 'Fitness & Nutrition' },
            { id: 1420, name: 'Self-Help' },
            { id: 1421, name: 'Sexuality' },
            { id: 1481, name: 'Alternative Health' },
        ],
    },
    { id: 1309, name: 'TV & Film', subGenre: [] },
    { id: 1310, name: 'Music', subGenre: [] },
    { id: 1311, name: 'News & Politics', subGenre: [] },
    {
        id: 1314,
        name: 'Religion & Spirituality',
        subGenre: [
            { id: 1438, name: 'Buddhism' },
            { id: 1439, name: 'Christianity' },
            { id: 1440, name: 'Islam' },
            { id: 1441, name: 'Judaism' },
            { id: 1444, name: 'Spirituality' },
            { id: 1463, name: 'Hinduism' },
            { id: 1464, name: 'Other' },
        ],
    },
    {
        id: 1315,
        name: 'Science & Medicine',
        subGenre: [
            { id: 1477, name: 'Natural Sciences' },
            { id: 1478, name: 'Medicine' },
            { id: 1479, name: 'Social Sciences' },
        ],
    },
    {
        id: 1316,
        name: 'Sports & Recreation',
        subGenre: [
            { id: 1456, name: 'Outdoor' },
            { id: 1465, name: 'Professional' },
            { id: 1466, name: 'College & High School' },
            { id: 1467, name: 'Amateur' },
        ],
    },
    {
        id: 1318,
        name: 'Technology',
        subGenre: [
            { id: 1446, name: 'Gadgets' },
            { id: 1448, name: 'Tech News' },
            { id: 1450, name: 'Podcasting' },
            { id: 1480, name: 'Software How-To' },
        ],
    },
    {
        id: 1321,
        name: 'Business',
        subGenre: [
            { id: 1410, name: 'Careers' },
            { id: 1412, name: 'Investing' },
            { id: 1413, name: 'Management & Marketing' },
            { id: 1471, name: 'Business News' },
            { id: 1472, name: 'Shopping' },
        ],
    },
    {
        id: 1323,
        name: 'Games & Hobbies',
        subGenre: [
            {id: 1404, name: 'Video Games'},
            {id: 1454, name: 'Automotive'},
            {id: 1455, name: 'Aviation'},
            {id: 1460, name: 'Hobbies'},
            {id: 1461, name: 'Other Games'},
        ]
    },
    {
        id: 1324,
        name: 'Society & Culture',
        subGenre: [
            { id: 1302, name: 'Personal Journals' },
            { id: 1320, name: 'Places & Travel' },
            { id: 1443, name: 'Philosophy' },
            { id: 1462, name: 'History' },
        ]
    },
    {
        id: 1325,
        name: 'Government & Organizations',
        subGenre: [
            { id: 1473, name: 'National' },
            { id: 1474, name: 'Regional' },
            { id: 1475, name: 'Local' },
            { id: 1476, name: 'Non-Profit' },
        ]
    }
];

async function fetchJSON(url) {
    const response = await fetch(url);
    const res = await response.json();
    return res.data;
}

export function searchPodcasts({ term }) {
    return fetchJSON(
        `https://itunes.apple.com/search?media=podcast&term=${term}`,
    );
}

export function lookupPodcast({ podcastId }) {
    return fetchJSON(`https://itunes.apple.com/lookup?id=${podcastId}`);
}
