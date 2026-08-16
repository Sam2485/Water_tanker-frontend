// AnalyticsPage.jsx (JavaScript + Recharts)
import React, { useState, useEffect } from 'react';
import { analyticsService } from '../../services/analyticsService';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { MetricCard } from '../../components/common/MetricCard';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  AreaChart,
  Area,
  ComposedChart,
  Line,
} from 'recharts';
import {
  BarChart3,
  PieChart as PieIcon,
  TrendingUp,
  Droplet,
  ShieldCheck,
  Truck,
  Clock,
  Building2,
} from 'lucide-react';

export const AnalyticsPage = () => {
  const [summary, setSummary] = useState(null);
  const [priorities, setPriorities] = useState([]);
  const [dailyDeliveries, setDailyDeliveries] = useState([]);
  const [wardEquity, setWardEquity] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [sum, prio, daily, wards] = await Promise.all([
        analyticsService.getSummary(),
        analyticsService.getPriorityDistribution(),
        analyticsService.getDailyDeliveries(),
        analyticsService.getWardEquityMetrics(),
      ]);

      setSummary(sum);
      setPriorities(prio);
      setDailyDeliveries(daily);
      setWardEquity(wards);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading || !summary) return <LoadingSpinner text="Computing municipal equity telemetry analytics..." />;

  return (
    <div className="page-wrapper">
      <div className="app-container">
        {/* Header */}
        <div style={{ marginBottom: '1.75rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--slate-900)' }}>
            Equitable Allocation & Fleet Analytics
          </h1>
          <p style={{ fontSize: '0.825rem', color: 'var(--slate-500)', marginTop: '2px' }}>
            Macro-level water distribution balance, ward vulnerability heat metrics and fulfillment tracking
          </p>
        </div>

        {/* Top Metric Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '1.75rem',
          }}
        >
          <MetricCard
            title="Total Liters Dispensed"
            value={`${(summary.totalLitersDispensed / 1000).toFixed(0)}k L`}
            subtext="Clean Potable Water"
            icon={Droplet}
            color="#0284c7"
          />
          <MetricCard
            title="Average Dispatch ETA"
            value={`${summary.averageEtaMinutes}m`}
            subtext="OR-Tools Optimized"
            icon={Clock}
            color="#0891b2"
          />
          <MetricCard
            title="Fulfillment Rate"
            value="94.2%"
            subtext="High-risk Ward Equity"
            icon={ShieldCheck}
            color="#059669"
          />
          <MetricCard
            title="Emergency Incidents"
            value={summary.emergencyEvents}
            subtext="Hospital Interceptions"
            icon={Building2}
            color="#be123c"
          />
        </div>

        {/* Charts Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
            gap: '1.5rem',
            marginBottom: '1.75rem',
          }}
        >
          {/* Chart 1: Priority Distribution */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-xl)',
              padding: '1.5rem',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
              <PieIcon size={18} color="var(--primary-600)" />
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                Water Demand by AI Priority Level
              </h3>
            </div>

            <div style={{ width: '100%', height: '280px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={priorities}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={4}
                    dataKey="count"
                  >
                    {priorities.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Daily Deliveries & Volume */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-xl)',
              padding: '1.5rem',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
              <BarChart3 size={18} color="var(--primary-600)" />
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                Hourly Dispensation Volume (Liters)
              </h3>
            </div>

            <div style={{ width: '100%', height: '280px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyDeliveries}>
                  <defs>
                    <linearGradient id="colorLiters" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip />
                  <Area type="monotone" dataKey="liters" stroke="#0284c7" strokeWidth={2.5} fillOpacity={1} fill="url(#colorLiters)" name="Water Dispensed (L)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Chart 3: Ward-level Equity & Shortage Fulfillment */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-xl)',
            padding: '1.5rem',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
            <TrendingUp size={18} color="#059669" />
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--slate-900)' }}>
              Ward-Level Equity Fulfillment vs Shortage Severity Index
            </h3>
          </div>

          <div style={{ width: '100%', height: '320px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={wardEquity}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="ward" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip />
                <Legend />
                <Bar dataKey="shortageSeverity" fill="#be123c" name="Shortage Severity (%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="equityFulfillmentRatio" fill="#059669" name="Equity Fulfillment Ratio (%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
