const request = require('supertest');
const baseURL = 'http://localhost:3001';

const id = "xxxx";
const newNote = {
    id: id,
    title: "Auto Test Note",
    text: "This is an automated test note"
};

describe('GET /notes', () => {

    beforeAll(async () => {
        const response = (await request(baseURL).post("/api/notes").send(newNote));
    });

    afterAll(async () => {
        await request(baseURL).delete(`/api/notes/${id}`);
    })

    it('Should return 200', async () => {
        const response = await request(baseURL).get("/api/notes");
        expect(response.statusCode).toBe(200);
    });

    it('Should return notes', async () => {
        const response = await request(baseURL).get("/api/notes");
        const notes = makeArray(response._body);
        expect(notes.length >= 1).toBe(true);
    });
    
});


describe('POST /notes', () => {
    
    let length;

    beforeAll(async () => {
        const response = (await request(baseURL).get("/api/notes"));
        length = makeArray(response._body).length;
    });

    it('Should add a note', async () => {
        await request(baseURL).post("/api/notes").send(newNote);
        const response = (await request(baseURL).get("/api/notes"));
        const notes = makeArray(response._body);
        expect(notes.length == (length + 1)).toBe(true);
        expect(JSON.stringify(notes[notes.length - 1]) == JSON.stringify(newNote)).toBe(true);
        await request(baseURL).delete(`/api/notes/${id}`);
    })

    it('Added note should be present among notes', async () => {
        await request(baseURL).post("/api/notes").send(newNote);
        const response = (await request(baseURL).get("/api/notes"));
        const notes = makeArray(response._body);
        expect(JSON.stringify(notes[notes.length - 1]) == JSON.stringify(newNote)).toBe(true);
        await request(baseURL).delete(`/api/notes/${id}`);
    })
});

describe('DELETE /notes', () => {
    
    let length;

    beforeAll(async () => {
        await request(baseURL).post("/api/notes").send(newNote)
        const response = (await request(baseURL).get("/api/notes"));
        length = makeArray(response._body).length;
    });

    it('Should remove a note', async () => {
        const response = (await request(baseURL).delete(`/api/notes/${id}`));
        const notes = await (request(baseURL).get("/api/notes"));
        expect(makeArray(notes._body).length == (length - 1)).toBe(true);
    })
});

const makeArray = (obj) => {
    const arr = [];
    for (const [key, value] of Object.entries(obj)) {
        arr.push(value);
    }
    return arr;
}