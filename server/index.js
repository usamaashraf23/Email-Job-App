const express = require('express');
const { emailQueue } = require('./queue');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

app.post("/jobs", async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).send({ error: 'Email is required' });
    }
    const job = await emailQueue.add("sendEmail", { email }, {
        attempts: 2,
        backoff: 2000
    });

    res.json({ jobId: job.id });
})

app.get("/jobs/:id", async (req, res) => {
    const job = await emailQueue.getJob(req.params.id);
    if (!job) {
        return res.status(404).json({ error: 'Job not found' });
    }

    const state = await job.getState();
    res.json({ status: state });
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});