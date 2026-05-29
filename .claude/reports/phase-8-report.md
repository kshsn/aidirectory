# Phase 8 Report — Deployment
**Project:** aidirectory  
**Date:** 2026-05-29  
**Status:** READY TO DEPLOY — Commands below

---

## Target Server
- **VPS:** `89.116.236.22` (Hostinger, root)
- **Staging URL:** `http://89.116.236.22:3002`
- **Production URL:** `http://89.116.236.22:3001`
- **Deploy Method:** rsync source → build on server → PM2

---

## Step A — One-Time Server Setup (run once via SSH)

```bash
ssh root@89.116.236.22
```

```bash
# ── 1. Install Node 20 via NVM ────────────────────────────────────────────────
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 20 && nvm use 20 && nvm alias default 20
node --version   # should print v20.x.x

# ── 2. Install PM2 and global tools ──────────────────────────────────────────
npm install -g pm2 tsx
pm2 startup     # follow the printed command to enable auto-start

# ── 3. Install PostgreSQL ─────────────────────────────────────────────────────
apt update && apt install -y postgresql postgresql-contrib
systemctl start postgresql && systemctl enable postgresql

# Create DB and user
sudo -u postgres psql << 'EOF'
CREATE DATABASE aidirectory;
CREATE DATABASE aidirectory_staging;
ALTER USER postgres PASSWORD 'CHOOSE_A_STRONG_PASSWORD';
EOF

# ── 4. Create app directories ─────────────────────────────────────────────────
mkdir -p /home/developer/aidirectory /home/developer/aidirectory-staging

# ── 5. Create .env on server ─────────────────────────────────────────────────
cat > /home/developer/aidirectory/.env << 'EOF'
NODE_ENV=production
DATABASE_URL=postgresql://postgres:CHOOSE_A_STRONG_PASSWORD@localhost:5432/aidirectory
PORT=3001
NEXTAUTH_SECRET=GENERATE_WITH_openssl_rand_-base64_32
NEXTAUTH_URL=http://89.116.236.22:3001
NEXT_PUBLIC_APP_URL=http://89.116.236.22:3001
ADMIN_USER=admin
ADMIN_PASSWORD_HASH=GENERATE_BELOW
NEXT_PUBLIC_ADSENSE_PUBLISHER_ID=
NEXT_PUBLIC_ADSENSE_SLOT_HOMEPAGE=
NEXT_PUBLIC_ADSENSE_SLOT_CATEGORY=
NEXT_PUBLIC_ADSENSE_SLOT_TOOL_SIDEBAR=
OPENAI_API_KEY=
EOF

# Generate NEXTAUTH_SECRET:
openssl rand -base64 32

# Generate ADMIN_PASSWORD_HASH (replace YOUR_PASSWORD):
node -e "const b=require('bcryptjs'); b.hash('YOUR_PASSWORD',10).then(h=>console.log(h))"
# Paste the output as ADMIN_PASSWORD_HASH in .env

# Copy .env for staging (adjust PORT and DATABASE_URL)
cp /home/developer/aidirectory/.env /home/developer/aidirectory-staging/.env
sed -i 's/PORT=3001/PORT=3002/' /home/developer/aidirectory-staging/.env
sed -i 's/aidirectory$/aidirectory_staging/' /home/developer/aidirectory-staging/.env
sed -i 's|:3001|:3002|g' /home/developer/aidirectory-staging/.env
```

---

## Step B — Deploy to Staging (run from your Mac)

```bash
# ── 1. Sync code to staging server ───────────────────────────────────────────
cd /Users/khaled/aidirectory

rsync -avz --progress \
  --exclude node_modules \
  --exclude .git \
  --exclude .env \
  --exclude .next \
  ./ root@89.116.236.22:/home/developer/aidirectory-staging/

# ── 2. Build and start staging on server ─────────────────────────────────────
ssh root@89.116.236.22 << 'ENDSSH'
  source ~/.bashrc && nvm use 20
  cd /home/developer/aidirectory-staging
  
  # Install dependencies
  npm install
  
  # Generate Prisma client
  npx prisma generate
  
  # Run migrations
  npx prisma migrate deploy
  
  # Seed database (categories + 100 tools)
  npm run db:seed
  
  # Build production bundle
  npm run build
  
  # Start with PM2
  pm2 delete aidirectory-staging 2>/dev/null || true
  PORT=3002 pm2 start npm --name aidirectory-staging -- start
  pm2 save
ENDSSH

# ── 3. Health check staging ───────────────────────────────────────────────────
curl -s -o /dev/null -w "%{http_code}" http://89.116.236.22:3002/en
# Should return 200
```

---

## Step C — Verify Staging (do this manually)

Open in your browser: **http://89.116.236.22:3002/en**

Check:
- [ ] Homepage loads with categories grid
- [ ] Language switcher works (`/ar` renders RTL Arabic)
- [ ] Search for "ChatGPT" returns results
- [ ] Tool detail page loads at `/en/tools/chatgpt`
- [ ] "Visit Tool" button redirects (check click logged in `/admin/analytics`)
- [ ] Admin login at `/admin/login` — sign in with your credentials
- [ ] sitemap at `/sitemap.xml` shows tool URLs

---

## Step D — Promote to Production (after staging confirmed)

```bash
# ── From your Mac ─────────────────────────────────────────────────────────────
rsync -avz --progress \
  --exclude node_modules \
  --exclude .git \
  --exclude .env \
  --exclude .next \
  ./ root@89.116.236.22:/home/developer/aidirectory/

ssh root@89.116.236.22 << 'ENDSSH'
  source ~/.bashrc && nvm use 20
  cd /home/developer/aidirectory
  
  npm install
  npx prisma generate
  npx prisma migrate deploy
  npm run db:seed
  npm run build
  
  pm2 delete aidirectory 2>/dev/null || true
  PORT=3001 pm2 start npm --name aidirectory -- start
  pm2 save
ENDSSH

# Health check
curl -s -o /dev/null -w "%{http_code}" http://89.116.236.22:3001/en
```

---

## Step E — Run AI Translation (optional, needs ANTHROPIC_API_KEY)

```bash
ssh root@89.116.236.22
cd /home/developer/aidirectory
# Add ANTHROPIC_API_KEY to .env first, then:
npm run translate
# This creates translated descriptions for all 9 non-English locales
```

---

## Monitoring Setup

```bash
# PM2 logs
ssh root@89.116.236.22 "pm2 logs aidirectory --lines 50"

# PM2 monitoring dashboard
ssh root@89.116.236.22 "pm2 monit"

# UptimeRobot (free): set up a monitor for http://89.116.236.22:3001/en
# → https://uptimerobot.com
```

---

## Staging URL: http://89.116.236.22:3002 — Status: PENDING (commands above)
## Production URL: http://89.116.236.22:3001 — Status: PENDING (commands above)
## Deploy Method: rsync → npm build on server → PM2
## Monitoring: PM2 logs + UptimeRobot
