# Deployment — aidirectory

## Hostinger VPS

| Field | Value |
|-------|-------|
| Host | 89.116.236.22 |
| SSH User | root |
| App Path | /home/developer/aidirectory |
| Staging Path | /home/developer/aidirectory-staging |
| PM2 Process | aidirectory |
| PM2 Staging | aidirectory-staging |
| Production URL | http://89.116.236.22:3001 |
| Staging URL | http://89.116.236.22:3002 |
| Node Version | 20.x |
| SSH Command | ssh root@89.116.236.22 |

## Environment Variables (production — set on VPS)
```
NODE_ENV=production
DATABASE_URL=postgresql://postgres:PASSWORD@localhost:5432/aidirectory
PORT=3001
NEXTAUTH_SECRET=<generate: openssl rand -base64 32>
NEXTAUTH_URL=http://89.116.236.22:3001
ADMIN_USER=admin
ADMIN_PASSWORD_HASH=<bcrypt hash of your admin password>
NEXT_PUBLIC_APP_URL=http://89.116.236.22:3001
NEXT_PUBLIC_ADSENSE_PUBLISHER_ID=<your-ca-pub-id>
```

## Deploy Commands
```bash
# 1. Build locally
export PATH="$HOME/.nvm/versions/node/v20.20.2/bin:$PATH"
npm run build

# 2. Sync to staging
rsync -avz --exclude node_modules --exclude .git --exclude .env \
  ./ root@89.116.236.22:/home/developer/aidirectory-staging/

# 3. Restart staging
ssh root@89.116.236.22 "cd /home/developer/aidirectory-staging && \
  npm install --production && \
  pm2 restart aidirectory-staging || pm2 start npm --name aidirectory-staging -- start -- -p 3002"

# 4. Health check staging
curl http://89.116.236.22:3002/en

# 5. After confirming staging — promote to production
rsync -avz --exclude node_modules --exclude .git --exclude .env \
  ./ root@89.116.236.22:/home/developer/aidirectory/

ssh root@89.116.236.22 "cd /home/developer/aidirectory && \
  npm install --production && \
  pm2 restart aidirectory || pm2 start npm --name aidirectory -- start -- -p 3001"

curl http://89.116.236.22:3001/en
```

## First-Time Server Setup (run once on VPS)
```bash
# Install Node 20 via NVM (if not already installed)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 20 && nvm use 20 && nvm alias default 20

# Install PM2 globally
npm install -g pm2
pm2 startup

# Create app directories
mkdir -p /home/developer/aidirectory /home/developer/aidirectory-staging

# Install PostgreSQL (if not installed)
apt update && apt install -y postgresql postgresql-contrib
sudo -u postgres psql -c "CREATE DATABASE aidirectory;"
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'choose-a-password';"

# Create .env on server (do not commit this file)
nano /home/developer/aidirectory/.env
# (paste environment variables above)

# Run migrations and seed
cd /home/developer/aidirectory
npm install --production
npx prisma migrate deploy
npm run db:seed
```
