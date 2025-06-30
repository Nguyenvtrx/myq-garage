app.get('/open-garage', async (req, res) => {
  try {
    const api = new myQApi();
    await api.login(process.env.MYQ_EMAIL, process.env.MYQ_PASSWORD);
    await api.refreshDevices();

    // Print all available devices to log
    console.log('All devices:', api.devices);

    // Try to locate a garage door opener
    const door = api.devices.find(
      (d) => d.device_family === 'garagedoor' && d.state?.door_state
    );

    if (door) {
      console.log(`Opening door: ${door.name}`);
      await api.execute(door, 'open');
      res.send('Garage is opening!');
    } else {
      res.status(404).send('Garage door not found');
    }
  } catch (err) {
    console.error('Failed to operate garage door:', err);
    res.status(500).send('Failed to open garage');
  }
});
