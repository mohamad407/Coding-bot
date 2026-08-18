# Running your Coding Bot with NO internet on the PC

Your PC stays fully offline. Your phone (with mobile data) relays requests
to your Render backend over a USB cable. Nothing is shared over Wi-Fi.

```
PC (client.js)  --USB (adb forward)-->  Phone (relay.js, Termux)  --mobile data-->  Render backend
```

You do **not** need to change `client.js` or `server.js` at all.
When the bot asks "Enter Backend URL:", you'll just type:

    http://localhost:5000

---

## One-time setup

### 1. On your phone
1. Install **Termux** from F-Droid (recommended) or Play Store.
2. Open Termux and install Node.js:
   ```
   pkg update
   pkg install nodejs
   ```
3. Enable **Developer Options** on the phone:
   Settings → About Phone → tap "Build Number" 7 times.
4. In Developer Options, turn on **USB Debugging**.

### 2. On your PC
1. Install **adb** (Android Platform Tools). It's a single small
   executable — download it once on any machine with internet and
   copy `adb` (or `adb.exe`) onto your offline PC via USB.
   - Windows: https://developer.android.com/tools/releases/platform-tools
   - Linux: `sudo apt install android-tools-adb` (do this on a machine
     with internet, then copy the binary over, or use a local mirror)

### 3. Copy `relay.js` onto your phone
- Use Termux's shared storage, or `adb push` from a machine with
  internet, or just paste the code into a file inside Termux with a
  text editor (`nano relay.js`).
- Open `relay.js` and set `DEFAULT_RENDER_URL` to your actual Render
  backend URL (the same one you'd normally type into `client.js`).

---

## Every time you want to use the bot

1. **Plug the phone into the PC** with a USB data cable.
2. On the phone, allow the "Allow USB debugging?" popup.
3. **In Termux on the phone**, start the relay:
   ```
   node relay.js
   ```
   Leave this running — it prints "Listening on http://127.0.0.1:5000".

4. **On the PC**, forward the port over USB:
   ```
   adb forward tcp:5000 tcp:5000
   ```
   (Run this once per USB connection. If `adb devices` doesn't show
   your phone, re-check USB debugging and the USB cable/mode —
   set the phone's USB mode to "File Transfer" if needed.)

5. **On the PC**, run your bot as usual:
   ```
   node client.js
   ```
   When asked for the Backend URL, enter:
   ```
   http://localhost:5000
   ```
   Then use it exactly like before — it will generate code, just
   routed through your phone instead of directly over PC internet.

---

## Notes
- The PC's Wi-Fi/Ethernet can be fully off the entire time — `adb`
  communicates purely over the USB cable.
- If the relay ever shows "Relay could not reach the backend," check
  that the phone still has mobile data / internet.
- To stop, just close Termux's relay (Ctrl+C) and unplug.
