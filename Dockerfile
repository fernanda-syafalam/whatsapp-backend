FROM node:20

WORKDIR /usr/src/app

COPY package*.json pnpm-lock.yaml* ./

# Install the application dependencies
RUN corepack enable pnpm && pnpm i --frozen-lockfile


COPY . .


RUN npm run build

# Expose the application port
EXPOSE 3000

# Command to run the application
CMD ["node", "dist/src/main"]