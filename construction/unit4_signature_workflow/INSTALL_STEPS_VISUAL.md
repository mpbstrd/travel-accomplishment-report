# 📸 Visual Installation Guide - Step by Step

## 🎯 What You'll Install

1. **Node.js** (5 minutes) - To run the application
2. **Docker Desktop** (10 minutes) - To run the database

---

## Part 1: Node.js Installation (5 minutes)

### Step 1: Go to nodejs.org

```
┌─────────────────────────────────────────┐
│  🌐 Browser: https://nodejs.org/        │
├─────────────────────────────────────────┤
│                                          │
│         Node.js®                         │
│                                          │
│  ┌──────────────┐  ┌──────────────┐    │
│  │ 20.10.0 LTS  │  │   21.2.0     │    │
│  │ Recommended  │  │   Current    │    │
│  │  For Most    │  │              │    │
│  │    Users     │  │              │    │
│  └──────────────┘  └──────────────┘    │
│         ↑                                │
│    Click this one!                       │
└─────────────────────────────────────────┘
```

**Action:** Click the **LTS** button (left side)

---

### Step 2: Run the Installer

```
┌─────────────────────────────────────────┐
│  Node.js Setup Wizard                    │
├─────────────────────────────────────────┤
│                                          │
│  Welcome to the Node.js Setup Wizard    │
│                                          │
│  This will install Node.js on your      │
│  computer.                               │
│                                          │
│                                          │
│              [Cancel]  [Next >]          │
│                           ↑              │
│                      Click here          │
└─────────────────────────────────────────┘
```

**Action:** Click **Next** through all screens

---

### Step 3: Accept License

```
┌─────────────────────────────────────────┐
│  Node.js Setup - License Agreement       │
├─────────────────────────────────────────┤
│                                          │
│  ☑ I accept the terms in the License    │
│     Agreement                            │
│      ↑                                   │
│  Check this box                          │
│                                          │
│              [< Back]  [Next >]          │
│                           ↑              │
│                      Click here          │
└─────────────────────────────────────────┘
```

**Action:** Check the box, then click **Next**

---

### Step 4: Installation Location

```
┌─────────────────────────────────────────┐
│  Node.js Setup - Destination Folder      │
├─────────────────────────────────────────┤
│                                          │
│  Install to:                             │
│  C:\Program Files\nodejs\                │
│                                          │
│  (Default location is fine)              │
│                                          │
│              [< Back]  [Next >]          │
│                           ↑              │
│                      Click here          │
└─────────────────────────────────────────┘
```

**Action:** Keep default, click **Next**

---

### Step 5: Custom Setup

```
┌─────────────────────────────────────────┐
│  Node.js Setup - Custom Setup            │
├─────────────────────────────────────────┤
│                                          │
│  ☑ Node.js runtime                       │
│  ☑ npm package manager                   │
│  ☑ Online documentation shortcuts        │
│  ☑ Add to PATH                           │
│      ↑                                   │
│  Make sure all are checked!              │
│                                          │
│              [< Back]  [Next >]          │
│                           ↑              │
│                      Click here          │
└─────────────────────────────────────────┘
```

**Action:** Keep all checked, click **Next**

---

### Step 6: Install

```
┌─────────────────────────────────────────┐
│  Node.js Setup - Ready to Install        │
├─────────────────────────────────────────┤
│                                          │
│  Click Install to begin installation    │
│                                          │
│                                          │
│              [< Back]  [Install]         │
│                           ↑              │
│                      Click here          │
└─────────────────────────────────────────┘
```

**Action:** Click **Install**

---

### Step 7: Wait for Installation

```
┌─────────────────────────────────────────┐
│  Node.js Setup - Installing              │
├─────────────────────────────────────────┤
│                                          │
│  Installing Node.js...                   │
│                                          │
│  ████████████████░░░░░░░░░░  60%        │
│                                          │
│  Please wait...                          │
│                                          │
└─────────────────────────────────────────┘
```

**Action:** Wait 1-2 minutes

---

### Step 8: Finish

```
┌─────────────────────────────────────────┐
│  Node.js Setup - Completed               │
├─────────────────────────────────────────┤
│                                          │
│  ✅ Node.js has been successfully        │
│     installed!                           │
│                                          │
│                                          │
│                         [Finish]         │
│                            ↑             │
│                       Click here         │
└─────────────────────────────────────────┘
```

**Action:** Click **Finish**

---

### Step 9: Verify Installation

```
┌─────────────────────────────────────────┐
│  Command Prompt                          │
├─────────────────────────────────────────┤
│                                          │
│  C:\Users\You> node --version            │
│  v20.10.0                                │
│                                          │
│  C:\Users\You> npm --version             │
│  10.2.3                                  │
│                                          │
│  ✅ Success! Both commands work!         │
│                                          │
└─────────────────────────────────────────┘
```

**Action:** Open Command Prompt and test

---

## Part 2: Docker Desktop Installation (10 minutes)

### Step 1: Go to docker.com

```
┌─────────────────────────────────────────┐
│  🌐 Browser: docker.com/products/        │
│              docker-desktop              │
├─────────────────────────────────────────┤
│                                          │
│         Docker Desktop                   │
│                                          │
│  ┌────────────────────────────────┐     │
│  │  Download for Windows          │     │
│  │                                │     │
│  │  [Download Docker Desktop]     │     │
│  │            ↑                   │     │
│  │       Click here               │     │
│  └────────────────────────────────┘     │
│                                          │
└─────────────────────────────────────────┘
```

**Action:** Click **Download for Windows**

---

### Step 2: Run the Installer

```
┌─────────────────────────────────────────┐
│  Docker Desktop Installer                │
├─────────────────────────────────────────┤
│                                          │
│  Configuration                           │
│                                          │
│  ☑ Use WSL 2 instead of Hyper-V         │
│     (recommended)                        │
│      ↑                                   │
│  Check this!                             │
│                                          │
│  ☑ Add shortcut to desktop              │
│                                          │
│                         [Ok]             │
│                          ↑               │
│                     Click here           │
└─────────────────────────────────────────┘
```

**Action:** Check both boxes, click **Ok**

---

### Step 3: Wait for Installation

```
┌─────────────────────────────────────────┐
│  Docker Desktop Installer                │
├─────────────────────────────────────────┤
│                                          │
│  Installing Docker Desktop...            │
│                                          │
│  ████████████░░░░░░░░░░░░░░  45%        │
│                                          │
│  This may take several minutes...        │
│                                          │
└─────────────────────────────────────────┘
```

**Action:** Wait 3-5 minutes

---

### Step 4: Restart Required

```
┌─────────────────────────────────────────┐
│  Docker Desktop Installer                │
├─────────────────────────────────────────┤
│                                          │
│  ✅ Installation successful!             │
│                                          │
│  A restart is required to complete       │
│  the installation.                       │
│                                          │
│              [Close and restart]         │
│                       ↑                  │
│                  Click here              │
└─────────────────────────────────────────┘
```

**Action:** Click **Close and restart**

**Your computer will restart!**

---

### Step 5: Start Docker Desktop

```
┌─────────────────────────────────────────┐
│  Desktop (after restart)                 │
├─────────────────────────────────────────┤
│                                          │
│     🐳                                   │
│  Docker Desktop                          │
│      ↑                                   │
│  Double-click this icon                  │
│                                          │
└─────────────────────────────────────────┘
```

**Action:** Double-click Docker Desktop icon

---

### Step 6: Docker Starting

```
┌─────────────────────────────────────────┐
│  Docker Desktop                          │
├─────────────────────────────────────────┤
│                                          │
│         🐳                               │
│                                          │
│  Docker Desktop is starting...           │
│                                          │
│  ⏳ Please wait...                       │
│                                          │
└─────────────────────────────────────────┘
```

**Action:** Wait 1-2 minutes

---

### Step 7: Docker Running

```
┌─────────────────────────────────────────┐
│  Docker Desktop                          │
├─────────────────────────────────────────┤
│                                          │
│         🐳                               │
│                                          │
│  ✅ Docker Desktop is running            │
│                                          │
│  You can now use Docker!                 │
│                                          │
└─────────────────────────────────────────┘
```

**Action:** Docker is ready! You can minimize this window

---

### Step 8: Verify Docker

```
┌─────────────────────────────────────────┐
│  Command Prompt                          │
├─────────────────────────────────────────┤
│                                          │
│  C:\Users\You> docker --version          │
│  Docker version 24.0.6, build ed223bc    │
│                                          │
│  C:\Users\You> docker-compose --version  │
│  Docker Compose version v2.23.0          │
│                                          │
│  ✅ Success! Both commands work!         │
│                                          │
└─────────────────────────────────────────┘
```

**Action:** Open Command Prompt and test

---

## ✅ Installation Complete!

### Final Verification

```
┌─────────────────────────────────────────┐
│  Command Prompt - Final Check           │
├─────────────────────────────────────────┤
│                                          │
│  C:\Users\You> node --version            │
│  v20.10.0                    ✅          │
│                                          │
│  C:\Users\You> npm --version             │
│  10.2.3                      ✅          │
│                                          │
│  C:\Users\You> docker --version          │
│  Docker version 24.0.6       ✅          │
│                                          │
│  C:\Users\You> docker-compose --version  │
│  Docker Compose version v2   ✅          │
│                                          │
│  🎉 All installed successfully!          │
│                                          │
└─────────────────────────────────────────┘
```

---

## 🚀 What's Next?

Now that everything is installed, you can run the application!

### Go to START_HERE.md and run these commands:

```bash
cd construction/unit4_signature_workflow/src
npm install
docker-compose up -d
npm run migration:run
npm run seed
npm run dev
```

### Then open your browser to:

```
http://localhost:3004
```

---

## 🎯 Quick Troubleshooting

### If Node.js doesn't work:
1. Close and reopen Command Prompt
2. Restart your computer
3. Reinstall Node.js

### If Docker doesn't work:
1. Make sure Docker Desktop is running (check system tray)
2. Restart Docker Desktop
3. Restart your computer

---

## 📞 Need Help?

See **INSTALLATION_GUIDE.md** for detailed troubleshooting!

---

**You're all set! Time to test the application!** 🎉
