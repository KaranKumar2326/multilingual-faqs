# Use official Node.js image
FROM node:20

# Set working directory
WORKDIR /app

# Install Python and pip
RUN apt-get update && apt-get install -y python3 python3-pip

# Ensure `python` command is available
RUN ln -s /usr/bin/python3 /usr/bin/python

# Install Python dependencies
# RUN pip3 install googletrans==4.0.0-rc1



# Install system dependencies (Python and pip)
# RUN apt-get update && apt-get install -y python3 python3-pip

# Fix externally managed error & install googletrans
RUN pip3 install --break-system-packages googletrans==4.0.0-rc1

COPY ./public/admin.html ./
# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the entire project
COPY . .

# Expose the required port
EXPOSE 8000

# Start the server
CMD ["npm", "start"]
