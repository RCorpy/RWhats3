const { app, BrowserWindow } = require('electron');
const path = require('path');

//npx cap open android - mobile app
//npm run dev -- web app
//npm run rwhats -- desktop app

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // Optional
    },
  });

  win.loadURL('http://localhost:5173'); // During dev, use Vite dev server
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
