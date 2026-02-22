# 🌸 Cute Photo Booth 🌸

A cute, pastel photo booth website that runs in your browser. Take selfies with optional frames (flower, stars, hearts), then download your photo.

![Screenshot placeholder – add a screenshot of your photo booth here]

## Features

- **Live camera feed** – Uses your device camera (front-facing on mobile)
- **Frame overlays** – Choose 🌸 Flower, ⭐ Stars, or 💖 Hearts (toggle on/off)
- **Capture** – Snap a photo with one click
- **Download** – Save as `cute-photo-{timestamp}.png`
- **Cute design** – Pastel colors, Quicksand font, floating hearts, “Cheese!” popup
- **Mobile responsive** – Works on phones and tablets
- **Accessible** – Semantic HTML, ARIA labels, alt text

## How to use

1. Open the site and **allow camera access** when prompted.
2. (Optional) Tap a frame button to add 🌸 Flower, ⭐ Stars, or 💖 Hearts. Tap again to remove.
3. Tap **📸 Capture** to take a photo.
4. Your photo appears below in a polaroid-style area.
5. Tap **💾 Download** to save the image to your device.

## Technologies

- **HTML5** – Structure, `<video>`, `<canvas>`
- **CSS3** – Flexbox, custom properties, animations
- **JavaScript** – Vanilla JS, no frameworks
- **WebRTC** – `getUserMedia` for camera access

## Deployment (Netlify)

1. **Create a GitHub repository**  
   - Create a new repo (e.g. `cute-photobooth`).  
   - Don’t add a README if you’re pushing this project (you already have one).

2. **Push your code**  
   ```bash
   git init
   git add .
   git commit -m "Cute photo booth"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

3. **Deploy on Netlify**  
   - Go to [Netlify](https://www.netlify.com).  
   - Click **“Add new site”** → **“Import an existing project”**.  
   - Choose **GitHub** and authorize if needed.  
   - Select your `cute-photobooth` repo.  
   - **Build settings:** leave default (no build command; publish directory can stay empty or `./`).  
   - Click **Deploy site**.

4. **Get your live URL**  
   - After the deploy finishes, Netlify gives you a URL like `https://random-name-123.netlify.app`.  
   - You can change it in **Site settings → Domain management**.

**Live demo:** [Add your Netlify URL here after deployment]

## Assets

- **Frames** – Place PNGs in `assets/frames/`:  
  `flower-frame.png`, `star-sparkles.png`, `heart-corners.png`  
  (Transparent overlays; see `assets/frames/README.md` for descriptions.)
- **Sound** – Place `camera-pop.mp3` in `assets/sounds/` for a shutter “pop” on capture. Optional; app works without it.

## Credits

- Font: [Quicksand](https://fonts.google.com/specimen/Quicksand) (Google Fonts)  
- Built as a fun browser-based photo booth.
