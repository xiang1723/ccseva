import type React from 'react';
import { useTranslation } from 'react-i18next';
import type { UsageStats } from '../types/usage';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Progress } from './ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

// Helper component for model usage item
const ModelUsageItem = ({
  modelName,
  modelData,
  totalTokens,
  index,
}: {
  modelName: string;
  modelData: { tokens: number; cost: number };
  totalTokens: number;
  index: number;
}) => {
  const { t } = useTranslation();
  const percentage = totalTokens > 0 ? (modelData.tokens / totalTokens) * 100 : 0;
  const formatNum = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString();
  };

  const getModelColor = (index: number) => {
    return index === 0 ? 'bg-purple-500' : index === 1 ? 'bg-blue-500' : 'bg-green-500';
  };

  return (
    <div className="flex items-center gap-3">
      <div className={`w-3 h-3 rounded-full ${getModelColor(index)}`} />
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="text-sm font-medium text-white cursor-help">{modelName}</span>
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-center">
                <p className="font-semibold">{modelName}</p>
                <p className="text-sm mt-1">
                  {formatNum(modelData.tokens)} {t('dashboard.tokensUnit')} • {formatCurrency(modelData.cost)}
                </p>
                <p className="text-xs mt-1 text-muted-foreground">
                  {t('dashboard.ofTodayUsage', { percentage: percentage.toFixed(1) })}
                </p>
              </div>
            </TooltipContent>
          </Tooltip>
          <span className="text-sm text-neutral-400">
            {formatNum(modelData.tokens)} ({percentage.toFixed(1)}%)
          </span>
        </div>
        <Progress value={percentage} className="w-full h-1.5" />
      </div>
    </div>
  );
};

// Helper for formatting numbers and currency
const formatNumber = (num: number) => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toLocaleString();
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Helper for getting status-related values
const getStatusHelpers = (status: 'safe' | 'warning' | 'critical') => {
  const getStatusColor = () => {
    switch (status) {
      case 'critical':
        return 'from-red-600 to-red-700';
      case 'warning':
        return 'from-orange-500 to-orange-600';
      default:
        return 'from-green-600 to-emerald-600';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'critical':
        return '🔴';
      case 'warning':
        return '🟡';
      default:
        return '🟢';
    }
  };

  return { getStatusColor, getStatusIcon };
};

// Component for key metrics row
const KeyMetricsRow: React.FC<{
  stats: UsageStats;
}> = ({ stats }) => {
  const { t } = useTranslation();
  const timeRemaining = stats.actualResetInfo?.formattedTimeRemaining || t('dashboard.noActiveSession');

  return (
    <div className="grid grid-cols-3 gap-4 text-center">
      <div className="space-y-2">
        <div className="text-2xl font-bold text-neutral-100 font-primary">
          {formatNumber(stats.tokensUsed)}
        </div>
        <div className="text-sm text-neutral-400 font-primary">{t('dashboard.tokensUsed')}</div>
        <div className="text-xs text-neutral-500 font-primary">
          {t('dashboard.ofLimit', { limit: formatNumber(stats.tokenLimit) })}
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-2xl font-bold text-neutral-100 font-primary">
          {formatCurrency(stats.today.totalCost)}
        </div>
        <div className="text-sm text-neutral-warm-400 font-primary">{t('dashboard.costToday')}</div>
        <div className="text-xs text-neutral-500 font-primary">
          {stats.today.totalTokens.toLocaleString()} {t('dashboard.tokensUnit')}
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-2xl font-bold text-neutral-100 font-primary">
          {formatNumber(stats.tokensRemaining)}
        </div>
        <div className="text-sm text-neutral-warm-400 font-primary">{t('dashboard.remaining')}</div>
        <div className="text-xs text-neutral-500 font-primary">{timeRemaining}</div>
      </div>
    </div>
  );
};

// Component for circular progress charts
const CircularProgressChart: React.FC<{
  percentage: number;
  status?: 'safe' | 'warning' | 'critical';
  label: string;
  subtitle: string;
  emoji: string;
  isTime?: boolean;
}> = ({ percentage, status, label, subtitle, emoji, isTime }) => (
  <div className="flex items-center justify-center">
    <div className="relative">
      <svg width="180" height="180" className="transform -rotate-90">
        <circle
          cx="90"
          cy="90"
          r="75"
          fill="none"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="8"
        />
        <circle
          cx="90"
          cy="90"
          r="75"
          fill="none"
          stroke={isTime ? 'url(#gradient-time)' : `url(#gradient-token-${status})`}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${2 * Math.PI * 75}`}
          strokeDashoffset={`${2 * Math.PI * 75 * (1 - percentage / 100)}`}
          className="transition-all duration-1000 ease-out"
        />
        {!isTime && status && (
          <defs>
            <linearGradient id={`gradient-token-${status}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop
                offset="0%"
                stopColor={
                  status === 'critical' ? '#ef4444' : status === 'warning' ? '#f59e0b' : '#10b981'
                }
              />
              <stop
                offset="100%"
                stopColor={
                  status === 'critical' ? '#dc2626' : status === 'warning' ? '#d97706' : '#059669'
                }
              />
            </linearGradient>
          </defs>
        )}
        {isTime && (
          <defs>
            <linearGradient id="gradient-time" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(204, 120, 92, 1)" />
              <stop offset="100%" stopColor="rgba(255, 107, 53, 1)" />
            </linearGradient>
          </defs>
        )}
      </svg>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-3xl font-bold text-neutral-100 mb-1 font-primary">
            {Math.round(percentage)}%
          </div>
          <div className="text-sm text-neutral-400 uppercase tracking-wide font-primary">
            {label}
          </div>
          <div className="text-xs text-neutral-500 mt-1 font-primary">
            {emoji} {subtitle}
          </div>
        </div>
      </div>
    </div>
  </div>
);

interface DashboardProps {
  stats: UsageStats;
  status: 'safe' | 'warning' | 'critical';
}

export const Dashboard: React.FC<DashboardProps> = ({ stats, status }) => {
  const { t } = useTranslation();
  const { getStatusColor, getStatusIcon } = getStatusHelpers(status);

  return (
    <TooltipProvider>
      <div className="space-y-4">
        {/* Hero Section */}
        <Card className="bg-neutral-900/80 backdrop-blur-sm border-neutral-800">
          <CardContent className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gradient mb-2 font-primary">{t('dashboard.title')}</h2>
              <p className="text-neutral-400 text-sm font-primary">
                {t('dashboard.description')}
              </p>
            </div>

            {/* Dual Progress Display - Token and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <CircularProgressChart
                      percentage={stats.percentageUsed}
                      status={status}
                      label={t('dashboard.tokens')}
                      subtitle={t(`status.${status}`)}
                      emoji={getStatusIcon()}
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-center">
                    <p className="font-semibold">
                      {status === 'critical'
                        ? `🔴 ${t('dashboard.criticalUsage')}`
                        : status === 'warning'
                          ? `🟡 ${t('dashboard.warningLevel')}`
                          : `🟢 ${t('dashboard.safeUsage')}`}
                    </p>
                    <p className="text-sm mt-1">
                      {status === 'critical'
                        ? t('dashboard.criticalTooltip')
                        : status === 'warning'
                          ? t('dashboard.warningTooltip')
                          : t('dashboard.safeTooltip')}
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>

            <KeyMetricsRow stats={stats} />
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Current Plan */}
          <Card className="bg-neutral-900/80 backdrop-blur-sm border-neutral-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-r ${getStatusColor()} flex items-center justify-center shadow-lg`}
                >
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <h3 className="text-lg font-bold text-neutral-100 font-primary cursor-help">
                        {stats.currentPlan}
                      </h3>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {t('dashboard.planTooltip', { limit: formatNumber(stats.tokenLimit) })}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                  <p className="text-sm text-neutral-400 font-primary">{t('dashboard.currentPlan')}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-400 font-primary">{t('dashboard.dailyLimit')}</span>
                  <span className="text-neutral-100 font-medium font-primary">
                    {formatNumber(stats.tokenLimit)}
                  </span>
                </div>
                <Progress value={Math.min(stats.percentageUsed, 100)} className="w-full h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Burn Rate */}
          <Card className="bg-neutral-900/80 backdrop-blur-sm border-neutral-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center shadow-lg">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
                    />
                  </svg>
                </div>
                <div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <h3 className="text-lg font-bold text-neutral-100 font-primary cursor-help">
                        {formatNumber(stats.burnRate)}
                      </h3>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{t('dashboard.burnRateTooltip')}</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p className="text-sm text-neutral-400 font-primary cursor-help">
                        {t('dashboard.tokensPerHour')}
                      </p>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {t('dashboard.burnRateDescription')}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="text-neutral-400 font-primary cursor-help">
                        {t('dashboard.depletionTime')}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {t('dashboard.depletionTooltip')}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                  <span className="text-neutral-100 font-medium font-primary">
                    {stats.actualResetInfo?.formattedTimeRemaining || t('dashboard.noActiveSession')}
                  </span>
                </div>
                <Badge
                  variant={
                    stats.burnRate > 1000
                      ? 'destructive'
                      : stats.burnRate > 500
                        ? 'secondary'
                        : 'default'
                  }
                  className="w-full justify-center"
                >
                  {stats.burnRate > 1000
                    ? t('dashboard.highUsage')
                    : stats.burnRate > 500
                      ? t('dashboard.moderateUsage')
                      : t('dashboard.normalUsage')}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Today's Usage */}
          <Card className="bg-neutral-900/80 backdrop-blur-sm border-neutral-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{t('dashboard.today')}</h3>
                  <p className="text-sm text-neutral-400">{t('dashboard.usageSummary')}</p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-400">{t('dashboard.tokens')}</span>
                  <span className="text-white font-medium">
                    {stats.today.totalTokens.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">{t('dashboard.cost')}</span>
                  <span className="text-white font-medium">
                    {formatCurrency(stats.today.totalCost)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">{t('dashboard.models')}</span>
                  <span className="text-white font-medium">
                    {Object.keys(stats.today.models).length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* This Week */}
          <Card className="bg-neutral-900/80 backdrop-blur-sm border-neutral-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center shadow-lg">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{t('dashboard.thisWeek')}</h3>
                  <p className="text-sm text-neutral-400">{t('dashboard.sevenDaySummary')}</p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-400">{t('dashboard.totalCost')}</span>
                  <span className="text-white font-medium">
                    {formatCurrency(stats.thisWeek.reduce((sum, day) => sum + day.totalCost, 0))}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">{t('dashboard.totalTokens')}</span>
                  <span className="text-white font-medium">
                    {stats.thisWeek.reduce((sum, day) => sum + day.totalTokens, 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">{t('dashboard.avgDaily')}</span>
                  <span className="text-white font-medium">
                    {formatCurrency(
                      stats.thisWeek.reduce((sum, day) => sum + day.totalCost, 0) / 7
                    )}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Model Breakdown */}
        <Card className="bg-neutral-900/80 backdrop-blur-sm border-neutral-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white">{t('dashboard.modelUsage')}</CardTitle>
                <CardDescription>{t('dashboard.modelDistribution')}</CardDescription>
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-neutral-400 hover:text-white"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 bg-neutral-800 border-neutral-700 text-white">
                  <div className="space-y-3">
                    <div className="font-semibold">{t('dashboard.modelBreakdown')}</div>
                    <div className="text-sm text-neutral-300 space-y-2">
                      <p>• {t('dashboard.modelTokensInfo')}</p>
                      <p>• {t('dashboard.modelCostInfo')}</p>
                      <p>• {t('dashboard.modelPercentageInfo')}</p>
                      <p>• {t('dashboard.modelColorsInfo')}</p>
                    </div>
                    <div className="text-xs text-neutral-400 border-t border-neutral-700 pt-2">
                      {t('dashboard.modelClickInfo')}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.today.models && Object.keys(stats.today.models).length > 0 ? (
                Object.entries(stats.today.models).map(([modelName, modelData], index) => (
                  <ModelUsageItem
                    key={modelName}
                    modelName={modelName}
                    modelData={modelData}
                    totalTokens={stats.today.totalTokens}
                    index={index}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-neutral-400">
                  <svg
                    className="w-12 h-12 mx-auto mb-3 opacity-50"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <p className="text-sm">{t('dashboard.noModelData')}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
};
