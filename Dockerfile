# --- Tahap 1: Build Aplikasi NestJS ---
# Menggunakan image Node.js Alpine yang lebih kecil untuk tahap build
FROM node:22-alpine AS builder

# Atur direktori kerja di dalam container
WORKDIR /app

# Salin package.json dan pnpm-lock.yaml terlebih dahulu untuk memanfaatkan caching Docker
# Jika file-file ini tidak berubah, Docker tidak akan menjalankan ulang `pnpm install`
COPY package.json pnpm-lock.yaml ./

# Instal pnpm secara global
RUN npm install -g pnpm

# Instal semua dependensi (termasuk devDependencies)
# `pnpm install` lebih baik daripada `npm install` di CI/CD karena memastikan versi yang tepat dari pnpm-lock.yaml
RUN pnpm install

# Salin sisa kode aplikasi
COPY . .

# Jalankan build produksi NestJS
# Pastikan skrip build Anda di package.json adalah `nest build` atau yang serupa
RUN pnpm run build

# --- Tahap 2: Final Image Produksi ---
# Menggunakan image Node.js Alpine yang lebih kecil untuk runtime
FROM node:22-alpine AS runner

# Atur direktori kerja di dalam container
WORKDIR /app

# Instal pnpm secara global
RUN npm install -g pnpm

# Buat user non-root untuk keamanan
# Ini adalah praktik terbaik untuk menghindari menjalankan aplikasi sebagai root
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser
USER appuser

# Salin hanya dependensi produksi dari tahap builder
# Ini akan menjaga ukuran image final tetap kecil
COPY --from=builder /app/node_modules ./node_modules

# Salin hasil build aplikasi NestJS dari tahap builder
COPY --from=builder /app/dist ./dist

# Salin file package.json untuk menjalankan skrip start
COPY --from=builder /app/package.json ./package.json

# Salin file yang dibutuhkan lainnya (misalnya, .env.production jika ada, atau file statis)
# Namun, untuk variabel lingkungan sensitif, lebih baik disuntikkan saat runtime
# COPY --from=builder /app/.env.production ./.env

# Ekspos port yang digunakan aplikasi NestJS (default 3000)
EXPOSE 3030

# Perintah untuk menjalankan aplikasi NestJS
# Pastikan skrip start Anda di package.json adalah `node dist/main` atau yang serupa
CMD ["pnpm", "run", "start:prod"]
