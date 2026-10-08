# =======================
# Stage 1: Build Frontend
# =======================
FROM node:20-alpine AS builder

WORKDIR /app/frontend

# Copy frontend package files and install
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

# Copy frontend source code and build
COPY frontend/ ./
RUN npm run build

# =======================
# Stage 2: Build Backend
# =======================
FROM node:20-alpine

WORKDIR /app/backend

# Copy backend package files and install production dependencies
COPY backend/package.json backend/package-lock.json ./
RUN npm ci --omit=dev

# Copy built frontend dist from builder stage
# The dist is copied to ../frontend/dist relative to backend WORKDIR
COPY --from=builder /app/frontend/dist ../frontend/dist

# Copy backend source code
COPY backend/ ./

# Expose port
EXPOSE 5000

# Start the server
CMD ["node", "server.cjs"]