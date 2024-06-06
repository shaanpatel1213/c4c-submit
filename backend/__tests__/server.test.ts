import request from 'supertest'
import fs from 'fs';
import app from '../src/server'; // Adjust the import according to your file structure

// Mock the file system
jest.mock('fs');


const mockData = {
    "12345": { name: "Partner One", email: "partner1@example.com" },
    "67890": { name: "Partner Two", email: "partner2@example.com" }
};

beforeEach(() => {
    fs.existsSync.mockReturnValue(true);
    fs.readFileSync.mockReturnValue(JSON.stringify(mockData));
    fs.writeFileSync.mockClear();
});

describe('GET /partners', () => {
    it('should return all partners', async () => {
        const response = await request(app).get('/partners');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockData);
    });
});

describe('POST /partners', () => {
    it('should create a new partner', async () => {
        const newPartner = { name: "Partner Three", email: "partner3@example.com" };
        const response = await request(app)
            .post('/partners')
            .set('Authorization', 'Bearer secret-token')
            .send(newPartner);
        expect(response.status).toBe(201);
        expect(response.body).toEqual(newPartner);
        expect(fs.writeFileSync).toHaveBeenCalled();
    });

    it('should return 403 if no authorization header', async () => {
        const newPartner = { name: "Partner Three", email: "partner3@example.com" };
        const response = await request(app).post('/partners').send(newPartner);
        expect(response.status).toBe(403);
    });
});

describe('PUT /partners/:id', () => {
    it('should update an existing partner', async () => {
        const updatedPartner = { name: "Updated Partner", email: "updated@example.com" };
        const response = await request(app)
            .put('/partners/12345')
            .set('Authorization', 'Bearer secret-token')
            .send(updatedPartner);
        expect(response.status).toBe(200);
        expect(response.body).toEqual(updatedPartner);
        expect(fs.writeFileSync).toHaveBeenCalled();
    });

    it('should return 404 if partner not found', async () => {
        const updatedPartner = { name: "Non-existent Partner", email: "nonexistent@example.com" };
        const response = await request(app)
            .put('/partners/99999')
            .set('Authorization', 'Bearer secret-token')
            .send(updatedPartner);
        expect(response.status).toBe(404);
    });
});

describe('DELETE /partners/:id', () => {
    it('should delete an existing partner', async () => {
        const response = await request(app)
            .delete('/partners/12345')
            .set('Authorization', 'Bearer secret-token');
        expect(response.status).toBe(200);
        expect(fs.writeFileSync).toHaveBeenCalled();
    });

    it('should return 404 if partner not found', async () => {
        const response = await request(app)
            .delete('/partners/99999')
            .set('Authorization', 'Bearer secret-token');
        expect(response.status).toBe(404);
    });
});
