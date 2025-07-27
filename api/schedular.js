const express = require('express');
const router = express.Router();
const Schedule = require('../models/modelschema');
const connectDB = require('../mangodbconnect');
const mongoose = require('mongoose');
const schedulenode = require('node-schedule');

router.post('/schedule-message', async (req, res) => {
  try {
    const { message, day, time } = req.body;
    await connectDB()
    if (!message || !day || !time) {
      return res.status(400).json({ error: 'message, day, and time are required' });
    }

    const scheduledAt = new Date(`${day}T${time}`);

    if (scheduledAt < new Date()) {
      return res.status(400).json({ error: 'Scheduled time must be in the future' });
    }

    const doc = new Schedule.Schedule({
      message,
      scheduledAt
    });

    await doc.save();

    // Schedule job
    scheduleMessageJob(doc._id, scheduledAt);

    res.status(200).json({ success: true, message: 'Message scheduled', data: doc });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
  await mongoose.disconnect();
});

async function scheduleMessageJob(id, dateTime) {
  schedulenode.scheduleJob(dateTime, async function () {
    await connectDB()
    const doc = await Schedule.Schedule.findById(id);
    if (doc) {
      console.log('Scheduled Message:', doc.message);
      // You can insert the message into another collection or trigger a notification here
    }
  });
  await mongoose.disconnect();
}

module.exports = router