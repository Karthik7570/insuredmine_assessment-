const {Policy, User} = require('../models/modelschema');
const connectDB = require('../mangodbconnect');
const mongoose = require('mongoose');


exports.getAggregatedPoliciesByUser = async (req, res) => {
  try {
    await connectDB();
    const result = await Policy.aggregate([
      {
        $group: {
          _id: "$userId",
          policies: {
            $push: {
              policyNumber: "$policyNumber",
              startDate: "$startDate",
              endDate: "$endDate",
              categoryId: "$categoryId",
              carrierId: "$carrierId"
            }
          },
          totalPolicies: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userDetails"
        }
      },
      { $unwind: "$userDetails" },
      {
        $project: {
          _id: 0,
          userId: "$_id",
          firstName: "$userDetails.firstName",
          email: "$userDetails.email",
          phoneNumber: "$userDetails.phoneNumber",
          totalPolicies: 1,
          policies: 1
        }
      }
    ]);
    await mongoose.disconnect();
    res.json(result);
  } catch (err) {
    console.error("Aggregation error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};