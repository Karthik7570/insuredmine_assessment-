const express = require('express')
const mongodb = require('./mangodbconnect')
const app = express();
const PORT = 3000;
app.use(express.json());
const uploadRouter = require('./api/upload')
const policyRoutes = require('./api/policybyusername')
const policyaggregate = require('./api/policyaggregated')
const startCpuMonitor = require('./api/cpuMonitor');
const schedulerRoute = require('./api/schedular')

// const uri = 'mongodb://admin:admin@localhost:27017/?authSource=admin';

// mongoose.connect(uri)
// .then(()=>{
//     console.log("connect to Mangoo DB")
// })
// .catch(err=>{
//     console.log('Error in connection DB', err)
// })
// mongodb()
startCpuMonitor()

app.get('/', (req, res)=>{
    res.send('WelCome API service is started in 3000')
})


app.use('/uploads', uploadRouter);
app.use('/api', policyRoutes);
app.get('/aggregate', policyaggregate.getAggregatedPoliciesByUser)
app.use('/scheduler', schedulerRoute);

app.listen(PORT, ()=>{
console.log(`server is running at http://localhost:${PORT}`)
})
