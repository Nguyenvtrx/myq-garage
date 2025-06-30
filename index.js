import express from 'express';
import dotenv from 'dotenv';
import { myQApi } from '@hjdhjd/myq';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.get('/open-garage', async (req, res) => {
  try {
    const api = new myQApi();
    await api.login(process.env.MYQ_EMAIL, process.env.MYQ_PASSWORD);
    await api.refreshDevices();
    const door = api.devices.find(d => d.device_family === 'garagedoor');
    if (door) {
      await api.execute(door, 'open');
      res.send('Garage is opening!');
    } else {
      res.status(404).send('Garage door not found');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to open garage');
  }
});

app.listen(port, () => {
  console.log(`Garage opener running on port ${port}`);
});
