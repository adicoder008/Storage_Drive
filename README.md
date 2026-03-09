# DriveManager – Cloud Storage Platform

DriveManager is a full-stack cloud storage system that allows users to upload, organize, search, and securely share files.  
The system is designed with **metadata–storage separation**, **content-addressable storage**, and **real-time updates**, demonstrating practical system design concepts.

---

# Screenshots

### Dashboard
![Dashboard Screenshot](./screenshots/dashboard.png)

### File Upload
![Upload Screenshot](./screenshots/upload.png)

### File Search
![Search Screenshot](./screenshots/search.png)

### File Sharing
![Sharing Screenshot](./screenshots/share.png)

---

# Features

## File Upload & Management

- Upload files up to **50MB per file**
- Preview files with thumbnails
- Rename, delete, and download files
- Categorization by file type (documents, media, images, others)

---

## Content-Addressable Storage

- Implemented **SHA-256 hashing** to detect duplicate files
- Prevents redundant uploads and reduces storage usage
- Multiple users can reference the same file without duplicating storage

---

## Secure File Sharing

- Generate **signed share links**
- Links copied to clipboard for quick sharing
- Access control handled through database metadata

---

## Multi-User Access

- Files can be shared with multiple users
- Shared users gain access instantly
- Shared files appear without refreshing

---

## Real-Time Updates

- Uses **Appwrite Realtime subscriptions**
- New uploads and shared files appear immediately across clients

---

## Search System

- Debounced search for efficient queries
- Supports searching by:

- file name  
- file type  
- extension  

---

## Sorting

Files can be sorted by:

- newest
- oldest
- largest
- name

---

## Storage Quota Enforcement

- Upload requests check user storage usage
- Prevents users from exceeding storage limits

---

# System Architecture






---

# Metadata Layer

Stores:

- file name
- owner
- shared users
- file size
- file type
- hash
- storage reference

---

# Storage Layer

Stores the **actual binary file data**.

Metadata references files using:





---

# Tech Stack

## Frontend

- Next.js 15
- React
- Tailwind CSS
- shadcn/ui

## Backend

- Next.js Server Actions
- Appwrite Database
- Appwrite Storage
- Appwrite Realtime

## Utilities

- Zod validation
- React Hook Form
- Debounced search

---

# Key Design Decisions

## Metadata and Storage Separation

Binary files are stored in **Appwrite Storage**, while metadata is stored in **Appwrite Database**.  
This allows efficient search, filtering, and permission management.

---

## Deduplication Using Hashing

Files are hashed using **SHA-256** before upload.

If the hash already exists, the system reuses the stored file instead of uploading again.

---

## Real-Time Updates

Appwrite realtime subscriptions push updates to clients, eliminating the need for manual refresh.

---

# Future Improvements

- Role-based file permissions (viewer/editor)
- Background file processing (thumbnail generation)
- Full-text search indexing
- Rate limiting and abuse protection

---

# Author

Adi  
NITK Surathkal  
Full-stack developer focused on building scalable systems.