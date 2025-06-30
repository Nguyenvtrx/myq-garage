import express from 'express';
import dotenv from 'dotenv';
import { myQApi } from '@hjdhjd/myq';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.get('/open-garage', async (req, res) => {
  try {
    // login() is called during construction in v6+
    const api = new myQApi({
      email: process.env.MYQ_EMAIL,
      password: process.env.MYQ_PASSWORD
    });

    await api.refreshDevices();

    console.log('All devices:', api.devices);

    const door = api.devices.find(
      d => d.device_family === 'garagedoor' && d.state?.door_state
    );

    if (door) {
      console.log(`Opening: ${door.name}`);
      await api.execute(door, 'open');
      res.send('Garage is opening!');
    } else {
      res.status(404).send('Garage door not found');
    }
  } catch (err) {
    console.error('Garage open failed:', err);
    res.status(500).send('Failed to open garage');
  }
});

app.listen(port, () => {
  console.log(`Garage opener running on port ${port}`);
});
