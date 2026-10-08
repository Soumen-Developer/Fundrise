# ==========================================
# Stage 1: Build Frontend (Vite + React SPA)
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app/frontend

# Copy frontend manifests and install dependencies
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

# Copy frontend source code and build production bundle
COPY frontend/ ./
RUN npm run build

# ==========================================
# Stage 2: Production Server (Node.js + Express)
# ==========================================
FROM node:20-alpine

WORKDIR /app/backend

# Production environment variables
ENV NODE_ENV=production
ENV PORT=5000
ENV AUTO_SEED=true

# Copy backend manifests and install production dependencies
COPY backend/package.json backend/package-lock.json ./
RUN npm ci --omit=dev

# Copy built frontend dist from builder stage
COPY --from=builder /app/frontend/dist /app/frontend/dist

# Copy backend source code and scripts
COPY backend/ ./

# Expose port (Render automatically routes web traffic)
EXPOSE 5000

# Start server (which handles port listening, DB retry, migrations, and auto-seeding)
CMD ["node", "server.cjs"]