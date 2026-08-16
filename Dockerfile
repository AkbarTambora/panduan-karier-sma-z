# Tahap 1: Builder
# Menggunakan image node 20-alpine yang ringan
FROM node:20-alpine AS builder

WORKDIR /app

# 1. Salin HANYA file package.json dan lockfile
# Ini memanfaatkan cache Docker. `npm ci` hanya akan berjalan ulang
# jika file package*.json berubah.
COPY package*.json ./

# 2. Instal semua dependensi (termasuk devDependencies)
RUN npm ci

# 3. Salin sisa file aplikasi (src, public, next.config, dll)
COPY . .

# 4. Jalankan build
# Kita 'mount' rahasia dari docker-compose ke dalam build stage ini
# Rahasia ini TIDAK akan tersimpan di image layer
RUN --mount=type=secret,id=mongodb_uri_secret \
    --mount=type=secret,id=mongodb_dbname_secret \
    MONGODB_URI=$(cat /run/secrets/mongodb_uri_secret) \
    MONGODB_DB_NAME=$(cat /run/secrets/mongodb_dbname_secret) \
    npm run build

# ---

# Tahap 2: Runner (Production)
FROM node:20-alpine AS runner
WORKDIR /app

# 5. Set environment ke production
ENV NODE_ENV production

# 6. Salin file package.json (untuk instalasi prod)
COPY --from=builder /app/package*.json ./

# 7. Instal HANYA dependensi production
RUN npm ci --omit=dev

# 8. Salin artefak build dari tahap builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next

# 9. (Opsional) Salin next.config jika Anda butuh (misal untuk middleware)
# COPY --from=builder /app/next.config.mjs ./

EXPOSE 3000

# 10. Perintah untuk menjalankan aplikasi
CMD ["npm", "start"]