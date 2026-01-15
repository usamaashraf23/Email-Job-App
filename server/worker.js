const { Worker } = require('bullmq');
const { connection } = require('./queue');

const worker = new Worker('emailQueue', async (job) => {
    const { email } = job.data;

    await new Promise((resolve) => setTimeout(resolve, 2000));

    if (email.includes('fail')) {
        throw new Error('Email Sending Failed');
    }
    console.log(`Email sent to ${email}`);
}, { connection });

worker.on("completed", (job, err) => {
    console.log(`Job ${job.id} completed successfully`);
});

worker.on("failed",(job,err)=>{
    console.log(`Job ${job.id} failed with error ${err.message}`);
});

console.log("Worker is running...");