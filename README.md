# Socitopia

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express)
![Stripe](https://img.shields.io/badge/Stripe-635BFF?style=for-the-badge&logo=stripe)
![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?style=for-the-badge&logo=socket.io)
![MIT License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**Socitopia** is a full-stack society management platform providing tools for residents and admins to manage events, complaints, payments, meetings, and lost & found items in real-time.

---

## Tech Stack
- **Frontend:** Next.js, Tailwind CSS, TypeScript  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB  
- **Authentication:** NextAuth.js, OTP via Nodemailer  
- **Payments:** Stripe with Node-Cron automation  
- **Real-time Communication:** Socket.IO  
- **Other:** Excel integration for bulk registration, voice-to-text API

---

## Features & Implementation

### **1. Role-Based Access & Authentication**
- Implemented **NextAuth.js** for secure authentication.  
- Roles: `Admin`, `Resident`, `Visitor`.  
- Admins have full control; residents can view info, RSVP, submit complaints; visitors use OTP login via Nodemailer.  
- Protected routes using JWT session handling.

### **2. Real-Time Meetings & Chat**
- Built with **Socket.IO** for live updates.  
- Admins can schedule meetings, residents join with live **chat events**.  
- Generates **automated meeting reports** (attendance + chat transcript).  
- Frontend updates in real-time for meeting notifications.

### **3. Complaint Box**
- Residents can submit complaints **anonymously**.  
- Supports **voice-to-text submissions** via API.  
- Tracks complaint **status**: Pending, In Progress, Resolved.  
- Admins can add internal notes.  
- MongoDB stores complaint details, audio files, and status history.

### **4. Event Management**
- Admins can create and update events with **date, time, and description**.  
- Residents can **RSVP**, tracked in real-time.  
- Image uploads for event banners/photos.  
- Admin controls for editing or cancelling events.

### **5. Lost & Found**
- Residents can report lost/found items with **image uploads**.  
- Claim validation through verification questions.  
- Residents can comment on items.  
- Admins manage and update lost & found records.  

### **6. Payments & Automation**
- Integrated **Stripe** for maintenance billing.  
- Recurring billing automated using **Node-Cron**.  
- Admins can monitor and update payment records.  

### **7. Bulk Registration & Visitor Management**
- Flat/member registration via **Excel upload**.  
- OTP-based visitor login via **Nodemailer** ensures secure temporary access.  

---

## Installation
1. Clone the repository:  
```bash
git clone https://github.com/samradhi29/Socitopia.git
