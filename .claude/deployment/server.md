# Deployment — aidirectory

## Hostinger VPS

| Field | Value |
|-------|-------|
| Host | {{VPS_IP_OR_HOSTNAME}} |
| SSH User | {{SSH_USER}} |
| App Path | /var/www/aidirectory |
| PM2 Process | aidirectory |
| Production URL | https://{{DOMAIN}} |
| Node Version | 20.x |

## Environment Variables (production)
```
NODE_ENV=production
DATABASE_URL=
PORT=3000
NEXT_PUBLIC_GA_ID=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
```

## Deploy Commands
```bash
# Build locally
npm run build

# Sync to server
rsync -avz --exclude node_modules --exclude .git ./ {{SSH_USER}}@{{VPS_IP}}:/var/www/aidirectory

# Restart on server
ssh {{SSH_USER}}@{{VPS_IP}} "cd /var/www/aidirectory && npm install --production && pm2 restart aidirectory"

# Health check
curl https://{{DOMAIN}}/api/health
```

## First-Time Server Setup
```bash
# On the VPS (run once)
npm install -g pm2
mkdir -p /var/www/aidirectory
pm2 startup
```
