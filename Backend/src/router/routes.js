import Router from "express";
import {
  getTransactions,
  getCombinedData,
} from "../controllers/rox.controller.js";

const router = Router();

router.route("/getTransactions").get(getTransactions);
// router.route("/getStatistics").get(getStatistics);
// router.route("/getBarChartData").get(getBarChartData);
// router.route("/getPieChartData").get(getPieChartData);
router.route("/getCombinedData").get(getCombinedData);

export default router;
