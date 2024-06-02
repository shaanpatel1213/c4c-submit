import express, { Express, Request, Response } from 'express';
import fs from 'fs';
import { PartnerData, PartnerDetails } from './types';

const app: Express = express();
const port = 4000;
const DATA_FILE = 'partners.json';

// Load data from file or initialize an empty object
let partners: PartnerData = {};
if (fs.existsSync(DATA_FILE)) {
  partners = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

// Middleware
app.use(express.json());
app.use((_req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

// Basic auth middleware
const authMiddleware = (req: Request, res: Response, next: Function) => {
  const authHeader = req.headers.authorization;
  if (authHeader === 'Bearer secret-token') {
    next();
  } else {
    res.sendStatus(403);
  }
};

// Save data to file
const saveDataToFile = () => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(partners, null, 2));
};

// Routes
app.get('/partners', (_req: Request, res: Response) => {
  res.status(200).send(partners);
});

app.post('/partners', authMiddleware, (req: Request, res: Response) => {
  const newPartner: PartnerDetails = req.body;
  const id = new Date().getTime().toString();
  partners[id] = newPartner;
  saveDataToFile();
  res.status(201).send(newPartner);
});

app.put('/partners/:id', authMiddleware, (req: Request, res: Response) => {
  const { id } = req.params;
  const updatedPartner: PartnerDetails = req.body;
  if (partners[id]) {
    partners[id] = updatedPartner;
    saveDataToFile();
    res.status(200).send(updatedPartner);
  } else {
    res.sendStatus(404);
  }
});

app.delete('/partners/:id', authMiddleware, (req: Request, res: Response) => {
  const { id } = req.params;
  if (partners[id]) {
    delete partners[id];
    saveDataToFile();
    res.sendStatus(204);
  } else {
    res.sendStatus(404);
  }
});

// Search partners
app.get('/search', (req: Request, res: Response) => {
  const { query, active } = req.query;
  const result = Object.entries(partners).filter(([_, details]) => {
    return (query ? details.name.includes(query as string) : true) &&
        (active ? details.active === (active === 'true') : true);
  }).map(([id, details]) => ({ id, details }));
  res.status(200).send(result);
});

app.listen(port, () => {
  console.log(`Express server starting on port ${port}!`);
});
