# 🚀 Deploy Frontend to Vercel - Step by Step

Your backend is live at: **https://fivealive.onrender.com** ✅

Now let's deploy your frontend to Vercel (takes ~5 minutes)!

---

## 📝 Step 1: Sign Up for Vercel

1. Go to: **[vercel.com](https://vercel.com)**
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub repositories

---

## 📦 Step 2: Import Your Project

1. After signing in, click **"Add New..."** → **"Project"**
2. You'll see your GitHub repositories
3. Find **"5alive"** (or **"rajuw892/5alive"**)
4. Click **"Import"**

---

## ⚙️ Step 3: Configure Build Settings

You'll see a configuration screen. Set these **EXACTLY**:

### **Framework Preset:**
- Select: **Vite**

### **Root Directory:**
- Click **"Edit"**
- Enter: `frontend`
- Click **"Continue"**

### **Build Command:**
- Should auto-fill: `npm run build`
- ✅ Leave as is

### **Output Directory:**
- Should auto-fill: `dist`
- ✅ Leave as is

### **Install Command:**
- Should auto-fill: `npm install`
- ✅ Leave as is

---

## 🔑 Step 4: Add Environment Variables

**VERY IMPORTANT!** Click on **"Environment Variables"** section.

Add these **THREE** variables:

| Name | Value |
|------|-------|
| `VITE_API_URL` | `https://fivealive.onrender.com` |
| `VITE_SOCKET_URL` | `https://fivealive.onrender.com` |
| `VITE_AGORA_APP_ID` | `a017a84c07a846eda3bb5b0466e88f73` |

**How to add each variable:**
1. Type the **Name** (e.g., `VITE_API_URL`)
2. Type the **Value** (e.g., `https://fivealive.onrender.com`)
3. Click **"Add"**
4. Repeat for all 3 variables

---

## 🚀 Step 5: Deploy!

1. After adding environment variables, click **"Deploy"**
2. Wait 2-5 minutes (Vercel will build your frontend)
3. You'll see a success screen with confetti! 🎉

Your frontend will be live at: **`https://YOUR-PROJECT-NAME.vercel.app`**

Example: `https://5alive-game.vercel.app`

---

## 🔄 Step 6: Update Backend CORS

**After your frontend is deployed**, you need to update your backend to allow it:

1. Go to **[Render Dashboard](https://dashboard.render.com)**
2. Click on your **"5alive-backend"** service (or whatever you named it)
3. Click **"Environment"** in the left menu
4. Find `CORS_ORIGIN` variable
5. Click **"Edit"**
6. Change from `*` to your Vercel URL: `https://YOUR-APP.vercel.app`
7. Click **"Save Changes"**
8. Backend will auto-redeploy (takes ~2 minutes)

**Example:**
```
CORS_ORIGIN=https://5alive-game.vercel.app
```

---

## ✅ Step 7: Test Your Game!

1. Open your Vercel URL in a browser
2. Click **"Create Room"**
3. Share the link with friends!
4. Play 5 Alive! 🎮🎉

---

## 🎯 Your Live URLs

After deployment, save these:

- **Frontend (Share this!)**: `https://__________.vercel.app`
- **Backend API**: `https://fivealive.onrender.com`

---

## 🐛 Troubleshooting

### Frontend shows "Cannot connect to server"
- ✅ Check Vercel environment variables are set correctly
- ✅ Check backend CORS_ORIGIN matches your Vercel URL
- ✅ Open browser console (F12) to see error messages

### Cards not loading / Blank screen
- ✅ Check browser console for errors
- ✅ Make sure all 3 environment variables are set in Vercel
- ✅ Try clearing cache and hard refresh (Ctrl+Shift+R)

### Voice chat not working
- ✅ Check VITE_AGORA_APP_ID is set correctly
- ✅ Allow microphone permissions in browser
- ✅ Check browser console for Agora errors

---

## 🔄 Updating Your Game (After Initial Deployment)

Whenever you make changes to your code:

1. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your change description"
   git push origin main
   ```

2. **Vercel auto-deploys!** (You don't need to do anything)
3. **Render auto-deploys!** (Backend also updates automatically)

---

## 🎉 You're Done!

Your multiplayer card game is now live and playable by anyone in the world!

**Share your Vercel URL with friends and start playing!** 🎮✨

---

## 💡 Next Steps (Optional)

- **Custom Domain**: Add your own domain in Vercel settings
- **Analytics**: Enable Vercel Analytics to see visitor stats
- **Performance**: Monitor in Vercel Dashboard
- **Scaling**: When you get popular, upgrade Render to paid tier for better performance

---

**Need help?** Let me know your Vercel URL and any errors you see! 🚀
