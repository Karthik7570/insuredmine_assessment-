const mongoose = require('mongoose');
const connectDB = require('../mangodbconnect'); // your DB connection util
const { parentPort, workerData } = require('worker_threads');
const fs = require('fs');
const csv = require('csv-parser');
const database = require('../models/modelschema'); 

const headers = [];
let insertedCount = 0;
let failedCount = 0;
const insertPromises = [];

const uploaddata=(async () => {
  try {
    await connectDB(); // 
    console.log('Connected to MongoDB');

    fs.createReadStream(workerData.filePath)
      .pipe(csv())
      .on('headers', (headerList) => {
        headerList.forEach(h => headers.push(h));
        console.log('CSV Headers:', headers);
      })
      .on('data', (row) => {
        // console.log("row", row)
        const insertPromise = (async () => {
          try {
            if (row.firstname && row.dob && row.email) {
              // console.log("inside try");

              const newUser = new database.User({
                firstName: row.firstname,
                dob: new Date(row.dob),
                address: row.address,
                phoneNumber: row.phone,
                state: row.state,
                zipcode: row.zip,
                email: row.email,
                gender: row.gender,
                userType: row.userType || row.usertype,
              });

              await newUser.save();
              insertedCount++;
              // console.log("Inserted count:", insertedCount);
             } if(row.agent){
               const newAgent = new database.Agent({name: row.agent})
               await newAgent.save();
             } if(row.category_name){
              const newLob = new database.Lob({categoryName: row.category_name})
              await newLob.save();
             }if(row.company_name){
              const newCarrier = new database.Carrier({companyName: row.company_name})
              await newCarrier.save();
             }if(row.policy_number && row.policy_start_date && row.policy_end_date){
              let categoryId = null;
              let carrierId = null;
              let userId = null;

              const lob = await database.Lob.findOneAndUpdate(
                  { categoryName: row.category_name },
                  { categoryName: row.category_name },
                  { upsert: true, new: true }
                );
              categoryId = lob._id;

              const carrier = await database.Carrier.findOneAndUpdate(
                  { companyName: row.company_name },
                  { companyName: row.company_name },
                  { upsert: true, new: true }
                );
              carrierId = carrier._id;

              const user = await database.User.findOneAndUpdate(
                  { email: row.email },
                  {
                    $setOnInsert: {
                      firstName: row.firstName,
                      dob: row.dob,
                      address: row.address,
                      phoneNumber: row.phoneNumber,
                      state: row.state,
                      zipcode: row.zipcode,
                      gender: row.gender,
                      userType: row.userType
                    }
                  },
                  { upsert: true, new: true }
                );
                userId = user._id;

              const newPolicy = new database.Policy({
                policyNumber: row.policy_number, 
                startDate: row.policy_start_date,
                endDate : row.policy_end_date,
                categoryId,
                carrierId,  
                userId   
              })
              console.log("new policy", newPolicy)
              await newPolicy.save();
             }if(row.account_name && row.account_type){
                const newAccount = new database.UserAccount({
                  accountName: row.account_name,
                  accountType: row.account_type
                })
             }
            else {
              console.log("Skipping row due to missing fields:", row);
            }
          } catch (err) {
            console.error(`Error inserting row:`, err.message);
            failedCount++;
          }
        })();

        insertPromises.push(insertPromise);
      })
      .on('end', async () => {
        await Promise.all(insertPromises); // wait for all inserts
        await mongoose.disconnect(); //clean disconnect
        console.log("🧹 MongoDB disconnected");

        parentPort.postMessage({
          success: true,
          message: `Streaming insert complete. Inserted: ${insertedCount}, Failed: ${failedCount}`,
        });
      })
      .on('error', async (err) => {
        await mongoose.disconnect(); 
        parentPort.postMessage({
          success: false,
          error: 'Stream processing failed',
          detail: err.message,
        });
      });

  } catch (err) {
    console.error(" Fatal error during DB connection or stream:", err);
    parentPort.postMessage({
      success: false,
      error: 'Initialization failed',
      detail: err.message,
    });
  }
});

uploaddata();
