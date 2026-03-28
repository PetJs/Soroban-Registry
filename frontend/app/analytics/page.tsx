'use client';

import React, { useState } from 'react';
import { useAnalyticsData } from '@/hooks/useAnalyticsData';
import { TimePeriod } from '@/types/analytics';
import Navbar from '@/components/Navbar';
import TimePeriodSelector from '@/components/stats/TimePeriodSelector';
import AnalyticsSkeleton from '@/components/analytics/AnalyticsSkeleton';
import SearchTrendsChart from '@/components/analytics/SearchTrendsChart';
import SearchWordCloud from '@/components/analytics/SearchWordCloud';
import DiscoveryPathsSankey from '@/components/analytics/DiscoveryPathsSankey';
import EngagementFunnel from '@/components/analytics/EngagementFunnel';
import CategoryPopularityChart from '@/components/analytics/CategoryPopularityChart';
import NetworkMap from '@/components/analytics/NetworkMap';
import AnalyticsExport from '@/components/analytics/AnalyticsExport';
import { AlertCircle, RefreshCw, TrendingUp } from 'lucide-react';

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<TimePeriod>('30d');
  const { data, loading, error, refetch } = useAnalyticsData(period);

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
          <div className="bg-card p-8 rounded-2xl shadow-lg max-w-md w-full text-center border border-red-500/20">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-foreground mb-2">Failed to load analytics</h2>
            <p className="text-muted-foreground mb-6">
              {error.message || 'An unexpected error occurred while fetching data.'}
            </p>
            <button
              onClick={() => refetch()}
              className="inline-flex items-center px-4 py-2 bg-primary hover:opacity-90 text-primary-foreground font-medium rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h1 className="text-3xl font-bold text-foreground">Search Analytics</h1>
              </div>
              <p className="text-sm text-muted-foreground">
                Visualizations of search patterns, user engagement, and registry insights
              </p>
            </div>
            <div className="flex items-center gap-3">
              {data && <AnalyticsExport data={data} period={period} />}
              <TimePeriodSelector selectedPeriod={period} onPeriodChange={setPeriod} />
            </div>
          </div>

          {loading || !data ? (
            <AnalyticsSkeleton />
          ) : (
            <div className="space-y-6 animate-in fade-in duration-500">
              {/* Row 1: Search Trends + Word Cloud */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[360px]">
                <SearchTrendsChart data={data.searchTrends} />
                <SearchWordCloud data={data.topSearchTerms} />
              </div>

              {/* Row 2: Engagement Funnel (full width) */}
              <div className="min-h-[280px]">
                <EngagementFunnel data={data.engagementFunnel} />
              </div>

              {/* Row 3: Category Popularity + Discovery Paths */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[380px]">
                <CategoryPopularityChart data={data.categoryPopularity} />
                <DiscoveryPathsSankey data={data.discoveryPaths} />
              </div>

              {/* Row 4: Network Map (full width) */}
              <div className="min-h-[460px]">
                <NetworkMap data={data.networkDistribution} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
