// const { Bet } = require('../models/Bet');

// module.exports.addCategory = async(category, betId) => {
//     const original = await Bet.findById(betId);
//     const result = await Bet.findByIdAndUpdate(betId,{
//         createdBy : original.createdBy,
//         category : [...original.category, category],
//         isResolved : original.isResolved,
//         deadlineDate : original.deadlineDate,
//         deadlineTime : original.deadlineTime,
//         users : original.users
//     }, { new : true});

//     return result;
// }
