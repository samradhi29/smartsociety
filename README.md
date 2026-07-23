# Smartsociety

**Live Demo:** https://smartsociety-liard.vercel.app/

Socitopia is a full-stack society management platform that enables residents and administrators to manage events, complaints, meetings, maintenance payments, visitors, and lost & found through secure authentication, real-time communication, and automated workflows.

---

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- Node.js
- Express.js
- MongoDB
- NextAuth.js
- JWT
- Socket.IO
- Stripe
- Node-Cron
- Nodemailer
- Docker
- Kubernetes
- Google Kubernetes Engine (GKE)
- Helm
- Terraform
- Prometheus
- Grafana


---

## Features

### Authentication & Role Management
- Secure authentication with NextAuth.js and JWT.
- Role-based access for Admin, Resident, and Visitor.
- OTP-based visitor authentication using Nodemailer.
- Protected routes and session management.

### Real-Time Meetings & Chat
- Live meetings and instant messaging using Socket.IO.
- Real-time meeting notifications.
- Automatic meeting reports with attendance and chat history.

### Complaint Management
- Anonymous complaint submission.
- Voice-to-text complaint support.
- Complaint status tracking.
- Admin remarks and resolution history.

### Event Management
- Create, update, and manage society events.
- RSVP functionality for residents.
- Event banner uploads.
- Live attendee tracking.

### Lost & Found
- Report lost and found items with image uploads.
- Verification-based claim process.
- Community comments.
- Admin moderation.

### Maintenance Payments
- Secure maintenance payments using Stripe.
- Automated recurring billing with Node-Cron.
- Payment history and status tracking.

### Visitor & Resident Management
- Bulk resident registration through Excel uploads.
- OTP-based visitor login.
- Resident profile management.

### DevOps
- Containerized the application using Docker.
- Deployed the application on Google Kubernetes Engine (GKE) using Kubernetes.
- Managed Kubernetes deployments using Helm charts.
- Provisioned infrastructure using Terraform.
- Monitored application and cluster health using Prometheus and Grafana.

---

## Installation

```bash
git clone https://github.com/samradhi29/Socitopia.git
cd Socitopia
npm install
npm run dev
```

---
