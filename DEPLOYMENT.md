# Deployment Guide for Render

This project is set up to be deployed as two separate services on Render:
1. **Backend**: A Node.js Web Service.
2. **Frontend**: A Static Site (recommended) or Web Service.

## Prerequisites
- A [Render](https://render.com) account.
- This project pushed to a GitHub repository.

## 1. Deploying the Backend

1. Click **New +** and select **Web Service**.
2. Connect your GitHub repository.
3. Select the `backend` directory as the **Root Directory**.
4. Configure the service:
   - **Name**: `shree-rama-backend` (or similar)
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. **Environment Variables** (Advanced):
   - `MONGO_URI`: Your MongoDB connection string.
   - `JWT_SECRET`: A secret key for signing tokens.
   - `CLOUDINARY_CLOUD_NAME`: Your Cloudinary Cloud Name.
   - `CLOUDINARY_API_KEY`: Your Cloudinary API Key.
   - `CLOUDINARY_API_SECRET`: Your Cloudinary API Secret.
   - `ADMIN_USERNAME`: Desired username for the owner account.
   - `ADMIN_EMAIL`: Desired email for the owner account.
   - `ADMIN_PASSWORD`: Strong password for the owner account.
   - `FRONTEND_URL`: The URL of your deployed frontend (you will get this after deploying the frontend, e.g., `https://your-frontend.onrender.com`). *Initially, you can leave this blank or add it later.*
6. Click **Create Web Service**.

## 1.5. Initialize Admin User (Free Plan Method)
Since the Free Plan doesn't allow Shell access, we will run the seed script as part of the server startup.

1. Go to your **Backend Service** dashboard on Render.
2. Click on **Settings**.
3. Scroll down to **Start Command**.
4. Change the command to: `node seedAdmin.js && node server.js`
5. Click **Save Changes**.
6. The service will automatically redeploy. Watch the **Logs** tab. You should see "Admin user created/updated successfully" followed by "Server running".

## 2. Deploying the Frontend

1. Click **New +** and select **Static Site**.
2. Connect the same GitHub repository.
3. Select the `frontend` directory as the **Root Directory**.
4. Configure the site:
   - **Name**: `shree-rama-frontend` (or similar)
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
5. **Environment Variables**:
   - `VITE_API_URL`: The URL of your deployed backend (e.g., `https://shree-rama-backend.onrender.com/api`).
   - **Note**: Make sure to include `/api` at the end if your backend routes are prefixed with it (which they are).
6. Click **Create Static Site**.

## 3. Final Configuration

1. Once the **Frontend** is deployed, copy its URL (e.g., `https://shree-rama-frontend.onrender.com`).
2. Go back to your **Backend** service dashboard on Render.
3. Go to **Environment** settings.
4. Update/Add the `FRONTEND_URL` variable with the frontend URL you just copied.
5. Render will automatically restart the backend service.

## Verify Deployment
- Open your frontend URL.
- Try to **Sign Up** or **Login**. If it works, the connection to the backend is successful.
