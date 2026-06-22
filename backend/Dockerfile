# ----- Stage 1 ----------
    FROM node:22 AS development
    WORKDIR /app
    
    COPY package*.json ./
    RUN npm install
    
    COPY . .
    EXPOSE 3000
    CMD ["npm", "run", "dev"]
    
    # ----- Stage 2 ----------
    FROM node:22-alpine AS production
    WORKDIR /app

    COPY package*.json ./
    RUN npm install --omit=dev

    COPY . .

    # adding non root user
    RUN addgroup -S appgroup && adduser -S appuser -G appgroup \
    && chown -R appuser:appgroup /app

    USER appuser
    EXPOSE 3000

    CMD ["npm", "start"]