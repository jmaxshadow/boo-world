const request = require('supertest');
const app = global.__APP__;
const puppeteer = require('puppeteer');

describe('Boo Tests', () => {
    let createdProfileId;
    test('should create a new profile via POST', async () => {
        const accountData = {
            name: 'Jose Machado',
            bio: 'Top Programmer'
        };

        const response = await request(app).post('/profile').send(accountData);

        expect(response.statusCode).toEqual(201);
        expect(response.body).toBeInstanceOf(Object);
        createdProfileId = response.body._id;
        expect(createdProfileId).toBeDefined();
    });

    // Check webpage to include title == Jose Machado MBTI | Boo Personality Database
    test('should retrieve the created account via GET', async () => {
        // Added test in puppeteer to check if the title is correct
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(`http://localhost:3000/profile/${createdProfileId}`);
        const title = await page.title();
        await browser.close();

        expect(title).toBe('Jose Machado MBTI | Boo Personality Database');
    });

    // Add account
    let createdAccountId;
    test('should add a new account via POST', async () => {
        const accountData = {
            name: 'Elon Musk'
        };

        const response = await request(app).post('/account').send(accountData);

        expect(response.statusCode).toEqual(201);
        expect(response.body).toBeInstanceOf(Object);
        createdAccountId = response.body._id;
        expect(createdAccountId).toBeDefined();
    });

    // Get account
    test('should retrieve the created account via GET', async () => {
        const response = await request(app).get(`/account/${createdAccountId}`);

        expect(response.statusCode).toEqual(200);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body.name).toEqual('Elon Musk');
    });

    // Add comment
    let createdCommentId;
    test('should add a new comment via POST', async () => {
        const commentData = {
            ProfileId: createdProfileId,
            AccountId: createdAccountId,
            title: 'This is a comment TITLE',
            text: 'This is a comment CONTENT',
            enneagram: '3W2',
            zodiac: 'VIRGO'
        };

        const response = await request(app).post(`/account/${createdAccountId}/comments`).send(commentData);

        expect(response.statusCode).toEqual(201);
        const res = response.body;
        createdCommentId = res._id;
        expect(res).toBeInstanceOf(Object);
        expect(res.ProfileId).toEqual(createdProfileId);
        expect(res.AccountId).toEqual(createdAccountId);
        expect(res.title).toEqual('This is a comment TITLE');
        expect(res.text).toEqual('This is a comment CONTENT');
        expect(res.enneagram).toEqual('3W2');
        expect(res.zodiac).toEqual('VIRGO');
        expect(res.likes).toBeInstanceOf(Array);
        expect(res.likes.length).toEqual(0);
    });

    // Like comment
    test('should like the created comment via PUT', async () => {
        const likeData = {
            profileId: createdProfileId
        };

        const response = await request(app).put(`/account/${createdAccountId}/comments/${createdCommentId}/like`).send(likeData);

        expect(response.statusCode).toEqual(200);
        const res = response.body;
        expect(res).toBeInstanceOf(Object);
        expect(res.likes).toBeInstanceOf(Array);
        expect(res.likes.length).toEqual(1);
        expect(res.likes[0]).toEqual(createdProfileId);
    });

    // Unlike comment
    test('should unlike the created comment via PUT', async () => {
        const unlikeData = {
            profileId: createdProfileId
        };

        const response = await request(app).put(`/account/${createdAccountId}/comments/${createdCommentId}/unlike`).send(unlikeData);

        expect(response.statusCode).toEqual(200);
        const res = response.body;
        expect(res).toBeInstanceOf(Object);
        expect(res.likes).toBeInstanceOf(Array);
        expect(res.likes.length).toEqual(0);
    });

    // Process comments
    test('should process the comments via GET', async () => {
        // Add 10 profiles
        const profileIds = [];
        for (let i = 0; i < 10; i++) {
            const profileResponse = await request(app).post('/profile').send({
                name: `Random Profile ${i}`,
                bio: 'Generated Profile'
            });
            expect(profileResponse.statusCode).toEqual(201);
            profileIds.push(profileResponse.body._id);
        }

        // Add 20 comments, from random profiles
        const commentIds = [];
        for (let i = 1; i < 20; i++) {
            const randomProfileId = profileIds[Math.floor(Math.random() * profileIds.length)];
            const commentResponse = await request(app).post(`/account/${createdAccountId}/comments`).send({
                ProfileId: randomProfileId,
                AccountId: createdAccountId,
                title: `Random Comment ${i}`,
                text: 'This is a randomly generated comment',
                enneagram: '5W4',
                zodiac: 'ARIES'
            });
            expect(commentResponse.statusCode).toEqual(201);
            commentIds.push(commentResponse.body._id);
        }

        // Randomly select 10 comments and apply a random number of likes from random profiles
        for (let i = 0; i < 10; i++) {
            const randomCommentId = commentIds[Math.floor(Math.random() * commentIds.length)];
            const numberOfLikes = Math.floor(Math.random() * 5) + 1; // Random number of likes between 1 and 5
            for (let j = 0; j < numberOfLikes; j++) {
                const randomProfileId = profileIds[Math.floor(Math.random() * profileIds.length)];
                const likeResponse = await request(app).put(`/account/${createdAccountId}/comments/${randomCommentId}/like`).send({
                    profileId: randomProfileId
                });
                expect(likeResponse.statusCode).toEqual(200);
            }
        }

        // Process comments
        let response = await request(app).get(`/account/${createdAccountId}/comments`);
        expect(response.statusCode).toEqual(200);
        const res = response.body;
        expect(res).toBeInstanceOf(Array);
        expect(res.length).toEqual(20);
        res.forEach(comment => {
            expect(comment).toBeInstanceOf(Object);
            expect(comment.ProfileId).toBeDefined();
            expect(comment.AccountId).toBeDefined();
            expect(comment.title).toBeDefined();
            expect(comment.text).toBeDefined();
            expect(comment.enneagram).toBeDefined();
            expect(comment.zodiac).toBeDefined();
            expect(comment.likes).toBeInstanceOf(Array);
        });

        // Sort by likes descending
        const sortedByLikesIds = res.slice().sort((a, b) => b.likes.length - a.likes.length).map(comment => comment._id);
        
        const response2 = await request(app).get(`/account/${createdAccountId}/comments?sort=likes`);
        expect(response2.statusCode).toEqual(200);
        const res2 = response2.body;
        expect(res2).toBeInstanceOf(Array);
        expect(res2.length).toEqual(20);
        const likes = res2.map(comment => comment.likes.length);
        expect(likes).toEqual(likes.slice().sort((a, b) => b - a));
        const resSortedByLikesIds = res2.map(comment => comment._id);
        expect(resSortedByLikesIds).toEqual(sortedByLikesIds);

        // Filter by enneagram
        const filteredByEnneagram = res.filter(comment => comment.enneagram === '5W4');
        const response3 = await request(app).get(`/account/${createdAccountId}/comments?filterBy=enneagram&filterValue=5W4`);
        expect(response3.statusCode).toEqual(200);
        const res3 = response3.body;
        expect(res3).toBeInstanceOf(Array);
        expect(res3.length).toEqual(filteredByEnneagram.length);
        expect(res3).toEqual(filteredByEnneagram);

        // Filter by zodiac
        const filteredByZodiac = res.filter(comment => comment.zodiac === 'ARIES');
        const response4 = await request(app).get(`/account/${createdAccountId}/comments?filterBy=zodiac&filterValue=ARIES`);
        expect(response4.statusCode).toEqual(200);
        const res4 = response4.body;
        expect(res4).toBeInstanceOf(Array);
        expect(res4.length).toEqual(filteredByZodiac.length);
        expect(res4).toEqual(filteredByZodiac);

        // Sort by date descending order
        const sortedByDateIds = res.slice().sort((a, b) => new Date(b.date) - new Date(a.date)).map(comment => comment._id);
        const response5 = await request(app).get(`/account/${createdAccountId}/comments?sort=date`);
        expect(response5.statusCode).toEqual(200);
        const res5 = response5.body;
        expect(res5).toBeInstanceOf(Array);
        expect(res5.length).toEqual(20);
        expect(res5.map(comment => comment._id)).toEqual(sortedByDateIds);

        // Filter by another enneagram
        const response6 = await request(app).get(`/account/${createdAccountId}/comments?filterBy=enneagram&filterValue=3W2`);
        expect(response6.statusCode).toEqual(200);
        const res6 = response6.body;
        expect(res6).toBeInstanceOf(Array);
        expect(res6.length).toEqual(1);

        // Filter by another zodiac
        const response7 = await request(app).get(`/account/${createdAccountId}/comments?filterBy=zodiac&filterValue=VIRGO`);
        expect(response7.statusCode).toEqual(200);
        const res7 = response7.body;
        expect(res7).toBeInstanceOf(Array);
        expect(res7.length).toEqual(1);
    });
});