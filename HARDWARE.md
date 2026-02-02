# ghostPay Kiosk - Hardware Setup Guide

This guide will walk you through setting up a Raspberry Pi-based ghostPay kiosk terminal with a 3.5" touchscreen display.

---

## Hardware Requirements

### Required Components

- **Raspberry Pi 3, 4 or 5** (4GB RAM recommended, 2GB minimum)
- **3.5" TFT Touchscreen Display** (320x480 resolution, SPI interface)
  - Compatible models: Waveshare 3.5", Goodtft 3.5", similar GPIO displays
- **MicroSD Card** (32GB minimum, Class 10 or better)
- **Power Supply** (5V 3A USB-C for Pi 4/5)
- **3D-Printed Enclosure** (optional, STL files available on GitHub)

### Estimated Cost
Total hardware cost: **$80-120 USD**

---

## Prerequisites

- Raspberry Pi OS Lite or Desktop (64-bit recommended)
- Basic familiarity with Linux command line
- Stable internet connection for setup
- SSH access to Raspberry Pi (optional, for remote setup)

---

## Setup Instructions

### 1. Initial System Update

Start by updating your Raspberry Pi system to the latest packages:

```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Install X Server and Openbox

Install minimal X server components and Openbox window manager for a lightweight kiosk environment:

```bash
sudo apt-get install --no-install-recommends xserver-xorg x11-xserver-utils xinit openbox chromium vim git -y
```

**What this installs:**
- `xserver-xorg` - Minimal X Window System
- `x11-xserver-utils` - X server utilities (xset, xrandr)
- `xinit` - X server initialization
- `openbox` - Lightweight window manager
- `chromium` - Web browser (for debugging/testing)
- `vim` - Text editor
- `git` - Version control

### 3. Install Build Tools

Install compilation tools required for building native Node.js modules:

```bash
sudo apt install -y build-essential python3 make g++
```

### 4. Install SQLite

Install SQLite for local transaction database:

```bash
sudo apt install -y sqlite3 libsqlite3-dev
```

### 5. Install Node.js 24.x

Install the latest Node.js LTS version:

```bash
# Add NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -

# Install Node.js
sudo apt install -y nodejs

# Verify installation
node -v    # Should show v24.x.x
npm -v     # Should show npm version
```

### 6. Install pnpm Package Manager

Install pnpm for faster, more efficient package management:

```bash
curl -fsSL https://get.pnpm.io/install.sh | sh -

# Reload shell to use pnpm
source ~/.bashrc

# Verify installation
pnpm -v
```

### 7. Install System Fonts

Install comprehensive font packages to ensure proper text rendering in the Electron app:

```bash
sudo apt install -y \
  fonts-dejavu \
  fonts-liberation \
  fonts-noto \
  fonts-noto-core \
  fonts-noto-extra \
  fonts-noto-color-emoji \
  fonts-roboto \
  fonts-freefont-ttf \
  fonts-opensymbol
```

**Rebuild font cache:**

```bash
sudo fc-cache -fv

# Verify emoji fonts are installed
fc-list | grep -i emoji
```

---

## Display Configuration

### 8. Install LCD Driver

Install the driver for the 3.5" TFT display:

```bash
# Clone LCD driver repository
git clone https://github.com/goodtft/LCD-show.git
chmod -R 755 LCD-show
cd LCD-show/

# Install driver for 3.5" display
# This will automatically reboot your Pi
sudo ./LCD35-show
```

> **Note:** The Pi will reboot after driver installation. Wait 30-60 seconds for it to come back online.

### 9. Set Display Rotation

After reboot, set the display orientation to portrait mode:

```bash
cd ~/LCD-show
sudo ./rotate.sh 270
```

**Rotation options:**
- `0` - Landscape (default)
- `90` - Portrait (rotated right)
- `180` - Upside down landscape
- `270` - Portrait (rotated left) - **Recommended for kiosk**

The system will reboot again after rotation is set.

---

## Kiosk Mode Configuration

### 10. Enable Auto-Login

Configure the Pi to automatically log in on boot:

```bash
sudo raspi-config
```

Navigate through:
1. **System Options** → **Boot / Auto Login**
2. Select **Console Autologin** or **Desktop Autologin**
3. Exit and reboot if prompted

### 11. Configure X Server Startup

Edit `.bash_profile` to automatically start X server on login:

```bash
nano ~/.bash_profile
```

Add the following line at the end:

```bash
# Start X server without mouse cursor
startx -- -nocursor
```

Save and exit (Ctrl+X, Y, Enter).

### 12. Configure Openbox Autostart

Set up Openbox to disable screen blanking and set display resolution:

```bash
sudo nano /etc/xdg/openbox/autostart
```

Add the following lines:

```bash
# Disable any form of screen saver / screen blanking / power management
xset s off          # Disable screen saver
xset s noblank      # Don't blank the screen
xset -dpms          # Disable DPMS (Energy Star) features

# Set display resolution to match ghostPay kiosk dimensions
xrandr -s 320x480
```

Save and exit.

### 13. Configure Environment Variables

Set display environment variables for X server:

```bash
nano ~/.bashrc
```

Add these lines at the end:

```bash
# X Server configuration
export DISPLAY=:0
export XAUTHORITY=/home/pi/.Xauthority
```

Reload the configuration:

```bash
source ~/.bashrc
```

---

## Install ghostPay Kiosk

### 14. Clone and Build ghostPay

```bash
# Navigate to home directory
cd ~

# Clone ghostPay repository
git clone https://github.com/yourusername/ghostPay.git
cd ghostPay

# Install dependencies
pnpm install

# Install prebuild-install globally (for native modules)
pnpm add -g prebuild-install

# Build the kiosk application
cd apps/kiosk
pnpm build
```

### 15. Configure Environment Variables

Create the `.env.local` file for kiosk configuration:

```bash
nano apps/kiosk/.env.local
```

Add your configuration:

```env
# Merchant wallet address (receives payments)
VITE_MERCHANT_WALLET=YOUR_SOLANA_WALLET_ADDRESS

# Helius RPC endpoint
VITE_SOLANA_RPC_URL=https://mainnet.helius-rpc.com/?api-key=YOUR_HELIUS_API_KEY

# Skip onboarding screen (optional)
VITE_SKIP_ONBOARDING=true

# Enable kiosk mode
KIOSK=true
```

Save and exit.

### 16. Test the Application

Test the kiosk in development mode:

```bash
cd ~/ghostPay/apps/kiosk
pnpm dev
```

If everything works correctly, you should see the ghostPay kiosk interface on the touchscreen.

Press `Ctrl+C` to stop the development server.

---

## Production Deployment

### 17. Create Autostart Script

Create a script to automatically launch ghostPay on boot:

```bash
nano ~/start-ghostpay.sh
```

Add the following:

```bash
#!/bin/bash

# Wait for X server to be ready
sleep 5

# Set display
export DISPLAY=:0

# Navigate to kiosk directory
cd /home/pi/ghostPay/apps/kiosk

# Start ghostPay in kiosk mode
npm start -- --kiosk
```

Make it executable:

```bash
chmod +x ~/start-ghostpay.sh
```

### 18. Configure Openbox to Launch ghostPay

Edit the Openbox autostart file:

```bash
nano ~/.config/openbox/autostart
```

Add this line at the end:

```bash
# Launch ghostPay kiosk
/home/pi/start-ghostpay.sh &
```

### 19. Final Reboot

Reboot the Pi to test the complete setup:

```bash
sudo reboot
```

After reboot, the ghostPay kiosk should automatically start in fullscreen kiosk mode.

---

## Troubleshooting

### Display Not Working

**Problem:** Black screen or no display after driver installation

**Solutions:**
```bash
# Check HDMI config
sudo nano /boot/config.txt

# Ensure these lines are present:
hdmi_force_hotplug=1
hdmi_drive=2

# Reboot
sudo reboot
```

### Touch Not Responding

**Problem:** Touchscreen is visible but not responding to touch

**Solutions:**
```bash
# Recalibrate touchscreen
cd ~/LCD-show
sudo ./LCD35-show

# Check touch device
ls /dev/input/event*

# Test touch input
sudo evtest /dev/input/event0
```

### Node.js Modules Failing to Build

**Problem:** `better-sqlite3` or other native modules fail to compile

**Solutions:**
```bash
# Install missing dependencies
sudo apt install -y python3-dev

# Rebuild native modules
cd ~/ghostPay/apps/kiosk
pnpm rebuild better-sqlite3

# Or use prebuild
pnpm add -g prebuild-install
prebuild-install
```

### X Server Won't Start

**Problem:** `startx` command fails or X server crashes

**Solutions:**
```bash
# Check X server logs
cat ~/.local/share/xorg/Xorg.0.log

# Reinstall X server
sudo apt install --reinstall xserver-xorg

# Reset X authority
rm ~/.Xauthority
startx -- -nocursor
```

### Kiosk Not Starting on Boot

**Problem:** System boots but ghostPay doesn't launch

**Solutions:**
```bash
# Check if script is executable
ls -l ~/start-ghostpay.sh

# Make executable if needed
chmod +x ~/start-ghostpay.sh

# Check Openbox autostart syntax
cat ~/.config/openbox/autostart

# Test script manually
~/start-ghostpay.sh

# Check logs
journalctl -xe
```

### Screen Blanking/Sleeping

**Problem:** Display turns off after inactivity

**Solutions:**
```bash
# Edit Openbox autostart
nano /etc/xdg/openbox/autostart

# Ensure these lines are present:
xset s off
xset s noblank
xset -dpms

# Apply immediately
xset s off && xset s noblank && xset -dpms
```

### Performance Issues

**Problem:** Kiosk is slow or laggy

**Solutions:**
```bash
# Increase GPU memory
sudo raspi-config
# Performance Options > GPU Memory > Set to 256

# Disable swap if using SD card
sudo dphys-swapfile swapoff
sudo systemctl disable dphys-swapfile

# Use faster SD card (Class 10 or UHS-I)
# Consider upgrading to Pi 5 with 4GB+ RAM
```

---

## Performance Optimization

### GPU Memory Configuration

Allocate more memory to GPU for better graphics performance:

```bash
sudo raspi-config
# Navigate to: Performance Options > GPU Memory
# Set to: 256 MB (for Pi with 2GB+ RAM)
```

### Disable Unused Services

Free up system resources by disabling unnecessary services:

```bash
# Disable Bluetooth (if not using)
sudo systemctl disable bluetooth

# Disable WiFi (if using Ethernet)
sudo rfkill block wifi

# List running services
systemctl list-units --type=service --state=running
```

### Use RAM for Logs (Optional)

Reduce SD card wear by using RAM for logs:

```bash
sudo nano /etc/fstab
```

Add:
```
tmpfs /var/log tmpfs defaults,noatime,mode=0755 0 0
```

---

## Maintenance

### Updating ghostPay

To update the kiosk software:

```bash
cd ~/ghostPay

# Pull latest changes
git pull

# Reinstall dependencies
pnpm install

# Rebuild kiosk
cd apps/kiosk
pnpm build

# Reboot
sudo reboot
```

### Backup Database

The transaction database is stored at:
```
~/.config/ghostPay/ghostpay.db
```

To backup:
```bash
# Create backup
cp ~/.config/ghostPay/ghostpay.db ~/ghostpay-backup-$(date +%Y%m%d).db

# Restore from backup
cp ~/ghostpay-backup-YYYYMMDD.db ~/.config/ghostPay/ghostpay.db
```

### System Updates

Regularly update the Pi OS:

```bash
sudo apt update && sudo apt upgrade -y
sudo reboot
```

---

## Hardware Specs Summary

### Tested Configuration

- **Device:** Raspberry Pi 4 Model B (4GB RAM)
- **OS:** Raspberry Pi OS Lite (64-bit, Debian 12 Bookworm)
- **Display:** Goodtft 3.5" TFT LCD (320x480, SPI)
- **Node.js:** v24.x.x LTS
- **pnpm:** v9.x.x
- **Electron:** v30.x.x

### Power Consumption

- Idle: ~2.5W
- Active (payment processing): ~4W
- Peak: ~5W

Use a quality 5V 3A power supply for stable operation.

---

## Security Considerations

### Firewall Configuration

```bash
# Install UFW firewall
sudo apt install -y ufw

# Allow SSH (if needed)
sudo ufw allow 22/tcp

# Enable firewall
sudo ufw enable
```

### Secure Merchant Wallet

- Store merchant wallet private key in hardware wallet (Ledger, Trezor)
- Never store private keys on the Raspberry Pi
- The kiosk only needs the public wallet address

### Automatic Updates

Consider setting up unattended security updates:

```bash
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

---

## Additional Resources

- **Raspberry Pi Documentation:** https://www.raspberrypi.com/documentation/
- **LCD-show Driver:** https://github.com/goodtft/LCD-show
- **Node.js ARM Builds:** https://nodejs.org/en/download/
- **Electron on Raspberry Pi:** https://github.com/electron/electron/blob/main/docs/tutorial/linux-rpi.md

---

## Support

For hardware-specific issues:
- Check the Troubleshooting section above
- Search GitHub Issues
- Join the ghostPay community (coming soon)

---

**Next Steps:** After completing this setup, your ghostPay kiosk is ready for production use. Configure your merchant wallet address and start accepting private payments on Solana!
