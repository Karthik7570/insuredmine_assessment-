const mongoose = require('mongoose');

const AgentSchema = new mongoose.Schema({name: String});
const Agent = mongoose.model('Agent', AgentSchema);

const UserSchema = new mongoose.Schema({
    firstName: String,
    dob: Date,
    address: String,
    phoneNumber: String,
    state: String,
    zipcode: String,
    email: { type: String, unique: true },
    gender: String,
    userType: String
});

const User = mongoose.model('User', UserSchema);

const UserAccountSchema = new mongoose.Schema({
  accountName: String,
  accountType:  String,
});
const UserAccount = mongoose.model('UserAccount', UserAccountSchema);

const LobSchema = new mongoose.Schema({ categoryName: String });
const Lob = mongoose.model('Lob', LobSchema);

const CarrierSchema = new mongoose.Schema({ companyName: String });
const Carrier = mongoose.model('Carrier', CarrierSchema);

const PolicySchema = new mongoose.Schema({
  policyNumber: String,
  startDate: Date,
  endDate: Date,
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lob' },
  carrierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Carrier' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});
const Policy = mongoose.model('Policy', PolicySchema);


const scheduleSchema = new mongoose.Schema({
  message: String,
  scheduledAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});
const Schedule =mongoose.model('Schedule', scheduleSchema);


module.exports = {
  Agent,
  User,
  UserAccount,
  Lob,
  Carrier,
  Policy,
  Schedule
};