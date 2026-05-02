import React, { useEffect, useState } from 'react';

interface ReportMetrics {
  totalReports: number;
  publishedReports: number;
  draftReports: number;
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
}

export const FinancialReports: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<ReportMetrics | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 200));
      setMetrics({
        totalReports: 156,
        publishedReports: 142,
        draftReports: 8,
        totalRevenue: 480000,
        totalExpenses: 350000,
        netProfit: 130000
      });
      setLoading(false);
    };

    loadData();
  }, []);

  if (loading || !metrics) {
    return <div className="p-6">Loading financial reports...</div>;
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Financial Reports</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded border p-4 bg-white dark:bg-gray-800">Total Reports: {metrics.totalReports}</div>
        <div className="rounded border p-4 bg-white dark:bg-gray-800">Published: {metrics.publishedReports}</div>
        <div className="rounded border p-4 bg-white dark:bg-gray-800">Draft: {metrics.draftReports}</div>
      </div>
      <div className="rounded border p-4 bg-white dark:bg-gray-800">
        Revenue: ${metrics.totalRevenue.toLocaleString()} | Expenses: ${metrics.totalExpenses.toLocaleString()} | Net: ${metrics.netProfit.toLocaleString()}
      </div>
    </div>
  );
};
