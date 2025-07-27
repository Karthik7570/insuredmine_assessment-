const { error } = require('console');
const express = require('express');
const multer = require('multer');
const path = require('path');
const { Worker } = require('worker_threads');

const router = express.Router();
const upload = multer({dest: '../insuredmine/uploads'})
// const uploadData = require('/uploaddata')


router.post('/',upload.single('file'), (req, res)=>{
    const filePath = path.join(__dirname, '../../upload.js', req.file.path);
    console.log(filePath)

    const worker = new Worker(path.join(__dirname, '../worker/uploaddata.js'),{
        workerData: {filePath}
    });

    worker.on('message',(msg)=>{
        if(msg.success){
            res.status(200).json({message: msg.message})
        }else{
            res.status(500).json({message: msg.error})
        }
    })

    worker.on('error', (err)=>{
        res.status(500).json({error: 'Worker thread failed', detail: err.message})
    }) 
})

module.exports= router;