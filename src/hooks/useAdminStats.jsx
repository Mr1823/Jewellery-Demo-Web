import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import useAuthContext from "./useAuthContext";
import useAxiosSecure from "./useAxiosSecure";
import safeStorage from "../utils/storage";

const defaultStats = {
  currentMonthStatsData: {
    totalSells: 125000.00,
    totalOrders: 42,
    averageOrderValue: 2976.19
  },
  lastMonthStatsData: {
    lastMonth: "June",
    year: 2026
  },
  customerStatsData: {
    newCustomers: 18
  },
  lastMonthComparisonPercentage: {
    totalSellsPercentage: {
      direction: "up",
      percentageValue: 12.5
    },
    totalOrdersPercentage: {
      direction: "up",
      percentageValue: 8.3
    },
    averageOrderValuePercentage: {
      direction: "up",
      percentageValue: 3.8
    },
    customersPercentage: {
      direction: "up",
      percentageValue: 15.0
    }
  }
};

const defaultTopCategories = [
  { subject: "Kundan", A: 120, B: 110, fullMark: 150 },
  { subject: "Bangles", A: 98, B: 130, fullMark: 150 },
  { subject: "Bridal", A: 86, B: 130, fullMark: 150 },
  { subject: "Temple", A: 99, B: 100, fullMark: 150 },
  { subject: "Diamonds", A: 85, B: 90, fullMark: 150 }
];

const defaultIncomeStats = [
  { name: "Jan", Income: 40000, Expense: 24000 },
  { name: "Feb", Income: 30000, Expense: 13980 },
  { name: "Mar", Income: 20000, Expense: 98000 },
  { name: "Apr", Income: 27800, Expense: 39080 },
  { name: "May", Income: 18900, Expense: 48000 },
  { name: "Jun", Income: 23900, Expense: 38000 }
];

const defaultPopularProducts = [
  {
    _id: "p1",
    name: "22K Gold Kundan Bridal Set",
    category: "Bridal",
    price: 150000,
    discountPrice: 135000,
    img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=200&h=200",
    sold: 15
  },
  {
    _id: "p2",
    name: "Intricate Meenakari Gold Bangles",
    category: "Bangles",
    price: 85000,
    discountPrice: 79000,
    img: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=200&h=200",
    sold: 22
  }
];

const defaultRecentReviews = [
  {
    _id: "r1",
    name: "Ananya Sharma",
    location: "Mumbai, Maharashtra",
    img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200",
    review: "Excellent quality and extremely fast delivery. The kundan details are perfect! Will buy again.",
    rating: 5,
    date: new Date().toISOString()
  },
  {
    _id: "r2",
    name: "Aarav Mehta",
    location: "Delhi, NCR",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200",
    review: "Great customer support. They helped me choose the right size and delivery was super fast.",
    rating: 5,
    date: new Date().toISOString()
  }
];

const useAdminStats = () => {
  const { user, isAuthLoading } = useAuthContext();
  const [axiosSecure] = useAxiosSecure();
  const [totalCategories, setTotalCategories] = useState(5);
  const [topCategories, setTopCategories] = useState(defaultTopCategories);
  const [incomeStats, setIncomeStats] = useState(defaultIncomeStats);
  const [popularProducts, setPopularProducts] = useState(defaultPopularProducts);
  const [recentReviews, setRecentReviews] = useState(defaultRecentReviews);

  const { data: adminStats = defaultStats } = useQuery({
    enabled:
      !isAuthLoading &&
      user?.uid !== undefined &&
      safeStorage.getItem("ub-jewellers-jwt-token") !== null,
    queryKey: ["admin-stats"],
    queryFn: async () => {
      try {
        const res = await axiosSecure.get("/admin-dashboard/stats");
        return res.data && Object.keys(res.data).length > 0 ? res.data : defaultStats;
      } catch (error) {
        console.warn("Failed to fetch admin stats, using defaults", error);
        return defaultStats;
      }
    },
  });

  // TOP SELLING CATEGORIES
  useEffect(() => {
    if (user) {
      axiosSecure.get("/admin-dashboard/top-selling-categories")
        .then((res) => {
          if (res.data) {
            setTotalCategories(res.data.totalCategories || 5);
            setTopCategories(res.data.topCategories || defaultTopCategories);
          }
        })
        .catch((err) => console.warn("Failed to fetch top categories, using defaults", err));

      axiosSecure.get("/admin-dashboard/income-stats")
        .then((res) => {
          if (res.data && res.data.length > 0) {
            setIncomeStats(res.data);
          }
        })
        .catch((err) => console.warn("Failed to fetch income stats, using defaults", err));
    }
  }, [user]);

  // BEST SELLING POPULAR PRODUCTS
  useEffect(() => {
    if (user) {
      axiosSecure
        .get("/admin-dashboard/popular-products")
        .then((res) => {
          if (res.data && res.data.length > 0) {
            setPopularProducts(res.data);
          }
        })
        .catch((err) => console.warn("Failed to fetch popular products, using defaults", err));
    }
  }, [user]);

  // Recent Reviews
  useEffect(() => {
    if (user) {
      axiosSecure
        .get("/admin-dashboard/recent-reviews")
        .then((res) => {
          if (res.data && res.data.length > 0) {
            setRecentReviews(res.data);
          }
        })
        .catch((err) => console.warn("Failed to fetch recent reviews, using defaults", err));
    }
  }, [user]);

  return {
    adminStats,
    totalCategories,
    topCategories,
    incomeStats,
    popularProducts,
    recentReviews,
  };
};

export default useAdminStats;
