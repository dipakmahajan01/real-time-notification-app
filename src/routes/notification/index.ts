import express from 'express';
import { sendNotification } from './post.notification';
const notificationRoutes = express.Router();
notificationRoutes.post('/send-message',sendNotification)
export default notificationRoutes;
