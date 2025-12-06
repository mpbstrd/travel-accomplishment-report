# 📦 Installation Guide - Node.js & Docker

## Overview

This guide will walk you through installing Node.js and Docker Desktop on Windows.

**Time Required:** 10-15 minutes  
**Difficulty:** Easy (just click Next a few times!)

---

## Part 1: Install Node.js

### Step 1: Download Node.js

1. Open your web browser
2. Go to: **https://nodejs.org/**
3. You'll see two download buttons:
   - **LTS (Long Term Support)** - Recommended ✅
   - Current (Latest features)
4. Click the **LTS** button (e.g., "20.10.0 LTS")
5. The installer will download (about 30 MB)

### Step 2: Run the Installer

1. Find the downloaded file (usually in Downloads folder)
   - File name: `node-v20.x.x-x64.msi`
2. Double-click to run the installer
3. Click **"Next"** on the welcome screen
4. Accept the license agreement ✅
5. Click **"Next"**
6. Choose installation location (default is fine)
7. Click **"Next"**
8. Custom Setup screen - keep all defaults ✅
   - Make sure "Add to PATH" is checked
9. Click **"Next"**
10. Click **"Install"**
11. Wait for installation (1-2 minutes)
12. Click **"Finish"**

### Step 3: Verify Node.js Installation

1. Open Command Prompt:
   - Press `Win + R`
   - Type `cmd`
   - Press Enter

2. Type this command and press Enter:
   ```bash
   node --version
   ```
   
3. You should see something like:
   ```
   v20.10.0
   ```

4. Type this command and press Enter:
   ```bash
   npm --version
   ```
   
5. You should see something like:
   ```
   10.2.3
   ```

✅ **Success!** Node.js and npm are installed!

---

## Part 2: Install Docker Desktop

### Step 1: Download Docker Desktop

1. Open your web browser
2. Go to: **https://www.docker.com/products/docker-desktop/**
3. Click **"Download for Windows"**
4. The installer will download (about 500 MB - takes a few minutes)

### Step 2: Run the Installer

1. Find the downloaded file (usually in Downloads folder)
   - File name: `Docker Desktop Installer.exe`
2. Double-click to run the installer
3. **Important:** Check these options:
   - ✅ "Use WSL 2 instead of Hyper-V" (recommended)
   - ✅ "Add shortcut to desktop"
4. Click **"Ok"**
5. Wait for installation (3-5 minutes)
6. Click **"Close and restart"**
7. Your computer will restart

### Step 3: Start Docker Desktop

1. After restart, Docker Desktop should start automatically
2. If not, double-click the Docker Desktop icon on your desktop
3. You'll see the Docker Desktop window
4. Wait for it to say **"Docker Desktop is running"** (takes 1-2 minutes)
5. You might see a tutorial - you can skip it

### Step 4: Verify Docker Installation

1. Open Command Prompt:
   - Press `Win + R`
   - Type `cmd`
   - Press Enter

2. Type this command and press Enter:
   ```bash
   docker --version
   ```
   
3. You should see something like:
   ```
   Docker version 24.0.6, build ed223bc
   ```

4. Type this command and press Enter:
   ```bash
   docker-compose --version
   ```
   
5. You should see something like:
   ```
   Docker Compose version v2.23.0
   ```

✅ **Success!** Docker Desktop is installed!

---

## Part 3: Test Your Installation

### Quick Test

Open Command Prompt and run these commands:

```bash
# Check Node.js
node --version
npm --version

# Check Docker
docker --version
docker-compose --version
```

If all four commands show version numbers, you're ready! 🎉

---

## Troubleshooting

### Node.js Issues

**Problem:** "node is not recognized as a command"

**Solution:**
1. Close and reopen Command Prompt
2. If still not working, restart your computer
3. If still not working, reinstall Node.js and make sure "Add to PATH" is checked

**Problem:** Installation fails

**Solution:**
1. Make sure you have administrator rights
2. Right-click the installer and choose "Run as administrator"
3. Disable antivirus temporarily during installation

### Docker Issues

**Problem:** "Docker Desktop requires Windows 10 Pro/Enterprise"

**Solution:**
- Docker Desktop requires Windows 10 Pro, Enterprise, or Education
- Or Windows 11 (any edition)
- If you have Windows 10 Home, you need to upgrade or use Docker Toolbox (older version)

**Problem:** "WSL 2 installation is incomplete"

**Solution:**
1. Open PowerShell as Administrator
2. Run: `wsl --install`
3. Restart your computer
4. Start Docker Desktop again

**Problem:** Docker Desktop won't start

**Solution:**
1. Make sure Hyper-V or WSL 2 is enabled
2. Restart your computer
3. Check if virtualization is enabled in BIOS
4. Try running Docker Desktop as administrator

**Problem:** "Docker daemon is not running"

**Solution:**
1. Make sure Docker Desktop is running (check system tray)
2. If not, start Docker Desktop from Start menu
3. Wait for it to fully start (1-2 minutes)

---

## System Requirements

### For Node.js
- **OS:** Windows 7 or later
- **RAM:** 512 MB minimum
- **Disk:** 50 MB free space

### For Docker Desktop
- **OS:** Windows 10 64-bit Pro/Enterprise/Education or Windows 11
- **RAM:** 4 GB minimum (8 GB recommended)
- **Disk:** 4 GB free space
- **CPU:** 64-bit processor with virtualization support
- **Virtualization:** Must be enabled in BIOS

---

## Next Steps

After installation is complete:

1. ✅ Node.js installed and verified
2. ✅ Docker Desktop installed and running
3. ✅ Ready to test the application!

**Now you can run the application!**

Go to: **START_HERE.md** for the 5-step setup to run the UI.

---

## Quick Reference

### Node.js Commands
```bash
node --version          # Check Node.js version
npm --version           # Check npm version
npm install            # Install dependencies
npm run dev            # Start development server
```

### Docker Commands
```bash
docker --version       # Check Docker version
docker ps              # List running containers
docker-compose up -d   # Start services in background
docker-compose down    # Stop services
docker-compose logs    # View logs
```

---

## Video Tutorials (Optional)

If you prefer video guides:

**Node.js Installation:**
- Search YouTube for: "How to install Node.js on Windows"
- Official guide: https://nodejs.org/en/download/package-manager

**Docker Desktop Installation:**
- Search YouTube for: "How to install Docker Desktop on Windows"
- Official guide: https://docs.docker.com/desktop/install/windows-install/

---

## Support

### Official Documentation
- **Node.js:** https://nodejs.org/en/docs/
- **Docker:** https://docs.docker.com/desktop/

### Common Issues
- **Node.js:** https://nodejs.org/en/docs/guides/
- **Docker:** https://docs.docker.com/desktop/troubleshoot/overview/

---

## Summary

**What You Just Installed:**

1. **Node.js** - JavaScript runtime
   - Allows you to run the application
   - Includes npm (package manager)

2. **Docker Desktop** - Container platform
   - Runs MS SQL Server database
   - Isolated environment for testing

**Total Installation Time:** 10-15 minutes  
**Total Download Size:** ~530 MB  
**Disk Space Used:** ~5 GB

---

## ✅ Installation Checklist

- [ ] Downloaded Node.js installer
- [ ] Installed Node.js
- [ ] Verified Node.js (`node --version`)
- [ ] Verified npm (`npm --version`)
- [ ] Downloaded Docker Desktop installer
- [ ] Installed Docker Desktop
- [ ] Restarted computer
- [ ] Started Docker Desktop
- [ ] Verified Docker (`docker --version`)
- [ ] Verified Docker Compose (`docker-compose --version`)
- [ ] Ready to run the application! 🎉

---

**Once both are installed, go to START_HERE.md to run the application!** 🚀
