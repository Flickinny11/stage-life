/**
 * Stage-Life Desktop Application
 * Electron main process for multi-platform desktop support
 */

const { app, BrowserWindow, ipcMain, dialog, Menu } = require('electron');
const path = require('path');
const isDev = process.env.ELECTRON_IS_DEV === '1';

class StageLifeDesktop {
  constructor() {
    this.mainWindow = null;
    this.audioEngine = null;
    this.isReady = false;
  }

  async initialize() {
    // Wait for app to be ready
    await app.whenReady();
    
    this.createMainWindow();
    this.setupMenu();
    this.initializeIPC();
    this.initializeNativeAudio();
    
    this.isReady = true;
    console.log('Stage-Life Desktop initialized');
  }

  createMainWindow() {
    this.mainWindow = new BrowserWindow({
      width: 1400,
      height: 900,
      minWidth: 1200,
      minHeight: 800,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: true,
        webSecurity: false // Allow loading local files
      },
      titleBarStyle: 'hiddenInset',
      show: false // Don't show until ready
    });

    // Load the React app
    const startUrl = isDev ? 
      'http://localhost:3000' : 
      `file://${path.join(__dirname, '../build/index.html')}`;
    
    this.mainWindow.loadURL(startUrl);

    // Show window when ready
    this.mainWindow.once('ready-to-show', () => {
      this.mainWindow.show();
      
      if (isDev) {
        this.mainWindow.webContents.openDevTools();
      }
    });

    // Handle window closed
    this.mainWindow.on('closed', () => {
      this.mainWindow = null;
    });

    console.log('Main window created');
  }

  setupMenu() {
    const template = [
      {
        label: 'Stage-Life',
        submenu: [
          { role: 'about' },
          { type: 'separator' },
          { 
            label: 'Preferences...',
            accelerator: 'CmdOrCtrl+,',
            click: () => this.showPreferences()
          },
          { type: 'separator' },
          { role: 'services' },
          { type: 'separator' },
          { role: 'hide' },
          { role: 'hideothers' },
          { role: 'unhide' },
          { type: 'separator' },
          { role: 'quit' }
        ]
      },
      {
        label: 'File',
        submenu: [
          {
            label: 'New Recording',
            accelerator: 'CmdOrCtrl+N',
            click: () => this.newRecording()
          },
          {
            label: 'Open Project',
            accelerator: 'CmdOrCtrl+O',
            click: () => this.openProject()
          },
          { type: 'separator' },
          {
            label: 'Export Audio',
            accelerator: 'CmdOrCtrl+E',
            click: () => this.exportAudio()
          }
        ]
      },
      {
        label: 'Audio',
        submenu: [
          {
            label: 'Start Recording',
            accelerator: 'Space',
            click: () => this.toggleRecording()
          },
          {
            label: 'Audio Settings',
            click: () => this.showAudioSettings()
          },
          { type: 'separator' },
          {
            label: 'Enable Professional Mode',
            type: 'checkbox',
            checked: false,
            click: (item) => this.toggleProfessionalMode(item.checked)
          }
        ]
      },
      {
        label: 'Window',
        submenu: [
          { role: 'minimize' },
          { role: 'close' }
        ]
      },
      {
        label: 'Help',
        submenu: [
          {
            label: 'Stage-Life Help',
            click: () => this.showHelp()
          },
          {
            label: 'Report Issue',
            click: () => this.reportIssue()
          }
        ]
      }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  }

  initializeIPC() {
    // Handle audio engine requests
    ipcMain.handle('audio-initialize', async () => {
      return await this.initializeAudio();
    });

    ipcMain.handle('audio-start-recording', async () => {
      return await this.startRecording();
    });

    ipcMain.handle('audio-stop-recording', async () => {
      return await this.stopRecording();
    });

    ipcMain.handle('audio-get-devices', async () => {
      return await this.getAudioDevices();
    });

    // Handle file operations
    ipcMain.handle('show-save-dialog', async (event, options) => {
      const result = await dialog.showSaveDialog(this.mainWindow, options);
      return result;
    });

    ipcMain.handle('show-open-dialog', async (event, options) => {
      const result = await dialog.showOpenDialog(this.mainWindow, options);
      return result;
    });

    // Handle app info
    ipcMain.handle('get-app-info', () => {
      return {
        version: app.getVersion(),
        platform: process.platform,
        arch: process.arch,
        isPackaged: app.isPackaged
      };
    });

    console.log('IPC handlers initialized');
  }

  initializeNativeAudio() {
    // Platform-specific audio initialization
    if (process.platform === 'darwin') {
      this.setupCoreAudio();
    } else if (process.platform === 'win32') {
      this.setupWindowsAudio();
    } else if (process.platform === 'linux') {
      this.setupLinuxAudio();
    }
  }

  setupCoreAudio() {
    // macOS CoreAudio integration
    console.log('Setting up CoreAudio for macOS');
    // In production, this would integrate with native audio APIs
  }

  setupWindowsAudio() {
    // Windows WASAPI/ASIO integration
    console.log('Setting up WASAPI for Windows');
    // In production, this would integrate with native audio APIs
  }

  setupLinuxAudio() {
    // Linux ALSA/PulseAudio integration
    console.log('Setting up ALSA/PulseAudio for Linux');
    // In production, this would integrate with native audio APIs
  }

  // Menu action handlers
  showPreferences() {
    // Create preferences window
    const prefsWindow = new BrowserWindow({
      width: 600,
      height: 400,
      parent: this.mainWindow,
      modal: true,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      }
    });

    prefsWindow.loadURL(`data:text/html,<h1>Stage-Life Preferences</h1><p>Coming soon...</p>`);
  }

  newRecording() {
    this.mainWindow.webContents.send('menu-new-recording');
  }

  async openProject() {
    const result = await dialog.showOpenDialog(this.mainWindow, {
      properties: ['openFile'],
      filters: [
        { name: 'Stage-Life Projects', extensions: ['slp'] },
        { name: 'Audio Files', extensions: ['wav', 'mp3', 'flac', 'm4a'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    });

    if (!result.canceled && result.filePaths.length > 0) {
      this.mainWindow.webContents.send('menu-open-project', result.filePaths[0]);
    }
  }

  async exportAudio() {
    const result = await dialog.showSaveDialog(this.mainWindow, {
      filters: [
        { name: 'WAV Audio', extensions: ['wav'] },
        { name: 'MP3 Audio', extensions: ['mp3'] },
        { name: 'FLAC Audio', extensions: ['flac'] }
      ],
      defaultPath: 'stage-life-recording.wav'
    });

    if (!result.canceled) {
      this.mainWindow.webContents.send('menu-export-audio', result.filePath);
    }
  }

  toggleRecording() {
    this.mainWindow.webContents.send('menu-toggle-recording');
  }

  showAudioSettings() {
    this.mainWindow.webContents.send('menu-show-audio-settings');
  }

  toggleProfessionalMode(enabled) {
    this.mainWindow.webContents.send('menu-toggle-professional-mode', enabled);
  }

  showHelp() {
    require('electron').shell.openExternal('https://stage-life.app/help');
  }

  reportIssue() {
    require('electron').shell.openExternal('https://github.com/Flickinny11/stage-life/issues');
  }

  // Audio methods (placeholders for native integration)
  async initializeAudio() {
    console.log('Initializing native audio...');
    return { success: true };
  }

  async startRecording() {
    console.log('Starting native recording...');
    return { success: true };
  }

  async stopRecording() {
    console.log('Stopping native recording...');
    return { success: true };
  }

  async getAudioDevices() {
    console.log('Getting audio devices...');
    return {
      inputs: [
        { id: 'default', name: 'Default Input' },
        { id: 'mic1', name: 'Built-in Microphone' }
      ],
      outputs: [
        { id: 'default', name: 'Default Output' },
        { id: 'speakers', name: 'Built-in Speakers' }
      ]
    };
  }
}

// Create and initialize the app
const stageLifeApp = new StageLifeDesktop();

// App event handlers
app.on('ready', () => {
  stageLifeApp.initialize();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    stageLifeApp.createMainWindow();
  }
});

// Handle security
app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (event, navigationUrl) => {
    event.preventDefault();
    require('electron').shell.openExternal(navigationUrl);
  });
});

module.exports = stageLifeApp;