# Database Setup Guide - MongoDB

The backend connection is failing because **MongoDB is not currently running**.
Since `mongod` command was not found in your terminal, it is likely that:
1.  MongoDB is **not installed**.
2.  Or it is installed, but not added to your system PATH.

## Option A: Install MongoDB (Recommended for Local Dev)
1.  **Download**: Go to [MongoDB Community Download](https://www.mongodb.com/try/download/community).
2.  **Install**: Run the installer (`.msi`).
    *   **IMPORTANT**: In the "Service Configuration" step, choose **"Run Service as Network Service user"** (default).
    *   This will automatically start MongoDB standard as a Windows Service.
3.  **Verify**: Open "Services" app in Windows, look for "MongoDB Server", and ensure it says "Running".

## Option B: Run Manually (If already installed)
If you know you installed it, try finding where it is.
Common path: `C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe` (Version may vary).
Run this command in a new terminal:
```powershell
& "C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --dbpath="c:\data\db"
```
*(Note: You might need to create `c:\data\db` folder first).*

## Option C: Use Cloud Database (MongoDB Atlas)
If you don't want to install anything locally:
1.  Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2.  Create a free cluster.
3.  Get the "Connection String" (starts with `mongodb+srv://...`).
4.  Update your `backend/.env` file:
    ```env
    MONGO_URI=your_cloud_connection_string_here
    ```

## How to Check if it works?
Once done, your backend terminal should show:
```
MongoDB Connected
```
And the website will work properly.
