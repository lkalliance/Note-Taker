const request = require('supertest');
const baseURL = 'http://localhost:3001';

// Constants for a note to add and delete
const id = "xxxx";
const newNote = {
    id: id,
    title: "Auto Test Note",
    text: "This is an automated test note"
};

describe('GET /notes', () => {
    beforeAll(async () => {
        // add a new note to ensure there is at least one
        const response = (await request(baseURL).post("/api/notes").send(newNote));
    });

    afterAll(async () => {
        // delete the added note
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
        // get the list at the moment and note the array length
        const response = (await request(baseURL).get("/api/notes"));
        length = makeArray(response._body).length;
    });

    it('Should add a note', async () => {
        // add a new note, then get the updated list
        await request(baseURL).post("/api/notes").send(newNote);
        const response = (await request(baseURL).get("/api/notes"));
        const notes = makeArray(response._body);
        // test to make sure the list is one longer, then delete the added note
        expect(notes.length == (length + 1)).toBe(true);
        await request(baseURL).delete(`/api/notes/${id}`);
    })

    it('Added note should be present among notes', async () => {
        // add a new note, then get the updated list
        await request(baseURL).post("/api/notes").send(newNote);
        const response = (await request(baseURL).get("/api/notes"));
        const notes = makeArray(response._body);
        // test to make sure the last note is the one we added, then delete the added note
        expect(JSON.stringify(notes[notes.length - 1]) == JSON.stringify(newNote)).toBe(true);
        await request(baseURL).delete(`/api/notes/${id}`);
    })
});

describe('DELETE /notes', () => {
    let length;

    beforeAll(async () => {
        // add a new note to ensure there is at least one, and get the length of the list
        await request(baseURL).post("/api/notes").send(newNote)
        const response = (await request(baseURL).get("/api/notes"));
        length = makeArray(response._body).length;
    });

    it('Should remove a note', async () => {
        // delete the note, and confirm the list is now one shorter
        const response = (await request(baseURL).delete(`/api/notes/${id}`));
        const notes = await (request(baseURL).get("/api/notes"));
        expect(makeArray(notes._body).length == (length - 1)).toBe(true);
    })
});

const makeArray = (obj) => {
    // function to turn an ojbect into an array
    const arr = [];
    for (const [key, value] of Object.entries(obj)) {
        arr.push(value);
    }
    return arr;
}