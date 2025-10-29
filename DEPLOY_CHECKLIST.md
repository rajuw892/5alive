# ✅ 5 Alive Deployment Checklist

Follow this checklist to deploy your game in ~30 minutes!

---

## 📝 Pre-Deployment Checklist

- [x] Git initialized
- [x] .gitignore created
- [ ] Create GitHub account (if you don't have one)
- [ ] Create Supabase account
- [ ] Create Upstash account
- [ ] Create Render account
- [ ] Create Vercel account

---

## 🚀 Deployment Steps

### 1️⃣ Push to GitHub (5 minutes)

```bash
# Add all files
git add .

# Commit
git commit -m "Initial commit - 5 Alive game"

# Create repo on GitHub: https://github.com/new
# Name it: 5alive-game

# Push (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/5alive-game.git
git branch -M main
git push -u origin main
```

**Status**: [ ] Done

---

### 2️⃣ Set Up Supabase Database (5 minutes)

1. Go to: https://supabase.com
2. Sign up (free)
3. Create New Project:
   - Name: `5alive`
   - Password: `_______________` (write it down!)
   - Region: _____________
4. Get connection string:
   - Settings → Database → Connection Pooling
   - Copy URI format
   - Save here: `_________________________________`

**Status**: [ ] Done

---

### 3️⃣ Set Up Upstash Redis (3 minutes)

1. Go to: https://upstash.com
2. Sign up with GitHub
3. Create Database:
   - Name: `5alive-redis`
   - Type: Regional
4. Copy Redis URL
5. Save here: `_________________________________`

**Status**: [ ] Done

---

### 4️⃣ Deploy Backend to Render (10 minutes)

1. Go to: https://render.com
2. Sign up with GitHub
3. New → Web Service
4. Connect your repo: `5alive-game`
5. Configure:
   - Name: `5alive-backend`
   - Root Directory: `backend`
   - Build: `npm install && npm run build`
   - Start: `npm start`
   - Instance: Free

6. **Environment Variables** (copy exactly):
   ```
   NODE_ENV=production
   PORT=5000
   DATABASE_URL=<your Supabase URL>
   REDIS_URL=<your Upstash URL>
   JWT_SECRET=<generate random 32 characters>
   JWT_EXPIRES_IN=7d
   CORS_ORIGIN=*
   AGORA_APP_ID=a017a84c07a846eda3bb5b0466e88f73
   AGORA_APP_CERTIFICATE=9020f4c8d6234bab9b0b3dce11bbc7f4
   ```

7. Deploy and wait
8. Your backend URL: `_________________________________`

**Status**: [ ] Done

---

### 5️⃣ Deploy Frontend to Vercel (5 minutes)

1. Go to: https://vercel.com
2. Sign up with GitHub
3. Import Project → `5alive-game`
4. Configure:
   - Framework: Vite
   - Root Directory: `frontend`
   - Build: `npm run build`
   - Output: `dist`

5. **Environment Variables**:
   ```
   VITE_API_URL=<your Render backend URL>
   VITE_SOCKET_URL=<your Render backend URL>
   VITE_AGORA_APP_ID=a017a84c07a846eda3bb5b0466e88f73
   ```

6. Deploy
7. Your frontend URL: `_________________________________`

**Status**: [ ] Done

---

### 6️⃣ Update Backend CORS (2 minutes)

1. Go back to Render
2. Your backend → Environment
3. Update `CORS_ORIGIN` to your Vercel URL:
   ```
   CORS_ORIGIN=<your Vercel URL>
   ```
4. Save (auto-redeploys)

**Status**: [ ] Done

---

### 7️⃣ Run Database Migrations (2 minutes)

1. Render → Your backend → Shell tab
2. Run:
   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```

**Status**: [ ] Done

---

### 8️⃣ Test Your Game! (∞ minutes)

1. Open your Vercel URL
2. Create a room
3. Play and have fun! 🎮🎉

**Status**: [ ] Done

---

## 🎯 Your Live URLs

- **Frontend (Share this!)**: `_________________________________`
- **Backend API**: `_________________________________`

---

## 🆘 Quick Troubleshooting

**Problem**: Backend won't start
- ✅ Check Render logs
- ✅ Verify all environment variables
- ✅ Check DATABASE_URL format

**Problem**: Frontend can't connect
- ✅ Check VITE_API_URL matches Render URL
- ✅ Check CORS_ORIGIN in backend
- ✅ Open browser console for errors

**Problem**: Database errors
- ✅ Run Prisma migrations in Render Shell
- ✅ Check Supabase connection string

---

## 📞 Need Help?

1. Check the full guide: `DEPLOYMENT_GUIDE.md`
2. Check Render logs (backend errors)
3. Check Vercel logs (frontend errors)
4. Check browser console (client errors)

---

**🎉 Congratulations on deploying your game!**
