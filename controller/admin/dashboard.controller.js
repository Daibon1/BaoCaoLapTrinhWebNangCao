// const Job=require("../../models/jobs.model");
// const Account = require("../../models/account.model");
// const Job = require("../../models/jobs.model");
// const JobCategory = require("../../models/jobs-category.model");
// const Account = require("../../models/account.model");

// module.exports.dashboard = async (req, res) => {

//   const totalJob = await Job.countDocuments();

//   const activeJob = await Job.countDocuments({
//     status:"active"
//   });

//   const inactiveJob = await Job.countDocuments({
//     status:"inactive"
//   });

//   const totalCategory = await JobCategory.countDocuments();

//   const totalAccount = await Account.countDocuments();

//   res.render("admin/pages/dashboard/index", {
//     title: "Trang Dashboard",
//     totalJob,
//     activeJob,
//     inactiveJob,
//     totalCategory,
//     totalAccount
//   });
// };
// module.exports.dashboard = async (req,res)=>{

//   const totalAccounts = await Account.countDocuments();
//   const totalJobs = await Job.countDocuments();

//   res.render("dashboard",{
//     stats:{
//       accounts: totalAccounts,
//       jobs: totalJobs
//     }
//   });
// };
// module.exports.dashboard =async (req, res) => {
//    const sumJob = await Job.countDocuments({deleted:false});
//    const activeJob = await Job.countDocuments({deleted:false,status:'active'});
//    const inactiveJob = await Job.countDocuments({deleted:false,status:'inactive'});
//    res.render("admin/pages/dashboard/index", {
//       title: "Trang Dashboard",
//       message: 'Hello, world!',
//       active:"active",
//       activeJob:activeJob,
//       inactiveJob:inactiveJob,
//       sumJob:sumJob,
//       currentUrl: req.originalUrl
//    })
//    // console.log(req.originalUrl);
// }
const Job = require("../../models/jobs.model");
const JobCategory = require("../../models/jobs-category.model");
const Account = require("../../models/account.model");
const Application = require("../../models/application.model");

module.exports.dashboard = async (req, res) => {
  try {
    const isEmployer = res.locals.role && res.locals.role.title === "Employer";
    const jobFilter = {
      deleted: false
    };

    if (isEmployer) {
      jobFilter["createdBy.account_id"] = res.locals.user._id;
    }

    /* =========================
        COUNT DATA
    ========================== */

    const totalJob = await Job.countDocuments(jobFilter);

    const activeJob = await Job.countDocuments({
      ...jobFilter,
      status: "active",
    });

    const inactiveJob = await Job.countDocuments({
      ...jobFilter,
      status: "inactive",
    });

    const totalCategory = await JobCategory.countDocuments();

    const totalAccount = isEmployer ? 0 : await Account.countDocuments();

    const employerJobs = isEmployer ? await Job.find(jobFilter).select("_id") : [];
    const employerJobIds = employerJobs.map(job => job._id);
    const totalApplication = isEmployer ? await Application.countDocuments({
      jobId: {
        $in: employerJobIds
      }
    }) : 0;


    /* =========================
        JOB THEO CATEGORY
        (vì category = String)
    ========================== */

    const jobByCategory = await Job.aggregate([
      { $match: jobFilter },
      {
        $group: {
          _id: "$category",
          total: { $sum: 1 }
        }
      },
      { $sort: { total: -1 } }
    ]);


    /* =========================
        JOB THEO THÁNG
    ========================== */

    const jobByMonth = await Job.aggregate([
      { $match: jobFilter },
      {
        $group: {
          _id: { $month: "$createdAt" },
          total: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);


    /* =========================
        JOB MỚI 7 NGÀY
    ========================== */

    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const newJobWeek = await Job.countDocuments({
      ...jobFilter,
      createdAt: { $gte: last7Days },
    });


    /* =========================
        % ACTIVE JOB
    ========================== */

    const percentActive =
      totalJob === 0 ? 0 :
      Math.round((activeJob / totalJob) * 100);


    /* =========================
        RENDER
    ========================== */

    res.render("admin/pages/dashboard/index", {
      title: "Trang Dashboard",
      currentUrl: req.originalUrl,
      totalJob,
      activeJob,
      inactiveJob,
      totalCategory,
      totalAccount,
      totalApplication,
      newJobWeek,
      percentActive,
      isEmployer,

      jobByCategory,
      jobByMonth
    });

  } catch (error) {
    console.log(error);
    res.redirect("/admin");
  }
};