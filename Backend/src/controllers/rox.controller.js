import { asyncHandler } from "../utils/asyncHandler.js";
import { Products } from "../models/products.model.js";

function filterByMonth(month) {
  const months = {
    January: 0,
    February: 1,
    March: 2,
    April: 3,
    May: 4,
    June: 5,
    July: 6,
    August: 7,
    September: 8,
    October: 9,
    November: 10,
    December: 11,
  };

  return months[month];
}

const getTransactions = asyncHandler(async (req, res) => {
  try {
    const { page = 1, perPage = 10, search = "", month = "" } = req.query;

    const skip = (page - 1) * perPage;
    const limit = parseInt(perPage);

    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];

      if (!isNaN(search)) {
        query.$or.push({ price: parseFloat(search) });
      }
    }

    if (month) {
      const monthNumber = filterByMonth(month);
      if (monthNumber !== undefined) {
        query.$expr = {
          $eq: [{ $month: "$dateOfSale" }, monthNumber + 1],
        };
      }
    }

    const transactions = await Products.find(query)
      .skip(skip)
      .limit(limit)
      .exec();

    const totalRecords = await Products.countDocuments(query);

    res.json({
      page,
      perPage,
      totalRecords,
      totalPages: Math.ceil(totalRecords / perPage),
      transactions,
      success: true,
    });
  } catch (error) {
    console.error("Error in getTransactions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const getStatistics = async (month) => {
  const monthNumber = filterByMonth(month);
  if (monthNumber === undefined) {
    throw new Error("Invalid month provided");
  }

  const statistics = await Products.aggregate([
    {
      $match: {
        $expr: {
          $eq: [{ $month: "$dateOfSale" }, monthNumber + 1],
        },
      },
    },
    {
      $facet: {
        totalSaleAmount: [
          { $match: { sold: "true" } },
          { $group: { _id: null, totalAmount: { $sum: "$price" } } },
        ],
        soldItems: [{ $match: { sold: "true" } }, { $count: "soldItemsCount" }],
        notSoldItems: [
          { $match: { sold: "false" } },
          { $count: "notSoldItemsCount" },
        ],
      },
    },
    {
      $project: {
        totalSaleAmount: {
          $arrayElemAt: ["$totalSaleAmount.totalAmount", 0],
        },
        soldItemsCount: { $arrayElemAt: ["$soldItems.soldItemsCount", 0] },
        notSoldItemsCount: {
          $arrayElemAt: ["$notSoldItems.notSoldItemsCount", 0],
        },
      },
    },
  ]);

  return (
    statistics[0] || {
      totalSaleAmount: 0,
      soldItemsCount: 0,
      notSoldItemsCount: 0,
    }
  );
};

const getBarChartData = async (month) => {
  const monthNumber = filterByMonth(month);
  if (monthNumber === undefined) {
    throw new Error("Invalid month provided");
  }

  const priceRanges = [
    { min: 0.0, max: 100.0 },
    { min: 101.0, max: 200.0 },
    { min: 201.0, max: 300.0 },
    { min: 301.0, max: 400.0 },
    { min: 401.0, max: 500.0 },
    { min: 501.0, max: 600.0 },
    { min: 601.0, max: 700.0 },
    { min: 701.0, max: 800.0 },
    { min: 801.0, max: 900.0 },
    { min: 901.0, max: Infinity },
  ];

  const boundaries = priceRanges.map((range) => range.max);

  const barChartData = await Products.aggregate([
    {
      $match: {
        $expr: {
          $eq: [{ $month: "$dateOfSale" }, monthNumber + 1],
        },
      },
    },
    {
      $bucket: {
        groupBy: "$price",
        boundaries: boundaries,
        default: "Above 900",
        output: {
          count: { $sum: 1 },
        },
      },
    },
  ]);

  const formattedData = priceRanges.map((range) => {
    const rangeLabel = `${range.min} - ${range.max}`;
    const existingData = barChartData.find(
      (item) =>
        item._id === range.max ||
        (item._id === "Above 900" && range.max === Infinity)
    );
    return {
      priceRange: rangeLabel,
      count: existingData ? existingData.count : 0,
    };
  });

  return formattedData;
};

const getPieChartData = async (month) => {
  const monthNumber = filterByMonth(month);
  if (monthNumber === undefined) {
    throw new Error("Invalid month provided");
  }

  const pieChartData = await Products.aggregate([
    {
      $match: {
        $expr: {
          $eq: [{ $month: "$dateOfSale" }, monthNumber + 1],
        },
      },
    },
    {
      $group: {
        _id: "$category",
        itemCount: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        category: "$_id",
        itemCount: 1,
      },
    },
  ]);

  return pieChartData;
};

const getCombinedData = asyncHandler(async (req, res) => {
  try {
    const { month = "" } = req.query;

    if (!month) {
      return res.status(400).json({ error: "Month parameter is required" });
    }

    const statisticsResponse = await getStatistics(month);
    const barChartResponse = await getBarChartData(month);
    const pieChartResponse = await getPieChartData(month);

    const combinedResponse = {
      statistics: statisticsResponse,
      barChartData: barChartResponse,
      pieChartData: pieChartResponse,
    };

    res.json(combinedResponse);
  } catch (error) {
    console.error("Error in getCombinedData:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

export { getTransactions, getCombinedData };
