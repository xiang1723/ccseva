import type React from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { UsageStats } from '../types/usage';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface SettingsPanelProps {
  preferences: {
    timezone?: string;
    resetHour?: number;
    plan?: 'auto' | 'Pro' | 'Max5' | 'Max20' | 'Custom';
    customTokenLimit?: number;
    menuBarDisplayMode?: 'percentage' | 'cost' | 'alternate';
    menuBarCostSource?: 'today' | 'sessionWindow';
  };
  onUpdatePreferences: (preferences: Partial<SettingsPanelProps['preferences']>) => void;
  stats: UsageStats;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  preferences,
  onUpdatePreferences,
  stats,
}) => {
  const { t } = useTranslation();
  const [currentTime, setCurrentTime] = useState(new Date());

  const handlePreferenceChange = (key: string, value: boolean | number | string) => {
    onUpdatePreferences({ [key]: value });
  };

  // Update current time every minute for real-time countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Calculate real-time countdown
  const getRealtimeCountdown = () => {
    if (!stats.actualResetInfo?.nextResetTime) {
      return t('settingsPanel.notAvailable');
    }

    const now = currentTime;
    const resetTime = new Date(stats.actualResetInfo.nextResetTime);
    const timeUntilReset = Math.max(0, resetTime.getTime() - now.getTime());

    if (timeUntilReset <= 0) {
      return t('settingsPanel.resetAvailable');
    }

    const hours = Math.floor(timeUntilReset / (1000 * 60 * 60));
    const minutes = Math.floor((timeUntilReset % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return t('settingsPanel.hoursMinutesLeft', { hours, minutes });
    }
    if (minutes > 0) {
      return t('settingsPanel.minutesLeft', { minutes });
    }
    return t('settingsPanel.lessThanOneMinute');
  };

  return (
    <div className="space-y-6 stagger-children">
      {/* Header */}
      <Card className="bg-neutral-900/80 backdrop-blur-sm border-neutral-800">
        <CardHeader>
          <CardTitle className="text-white text-2xl">{t('settingsPanel.title')}</CardTitle>
          <CardDescription className="text-white/70">
            {t('settingsPanel.description')}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* General Settings */}
      <Card className="bg-neutral-900/80 backdrop-blur-sm border-neutral-800">
        <CardContent className="p-6 space-y-6">
          {/* Timezone Configuration */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🌍</span>
              <div>
                <div className="text-white font-medium">{t('settingsPanel.timezone')}</div>
                <div className="text-white/60 text-sm">
                  {t('settingsPanel.timezoneDescription')}
                </div>
              </div>
            </div>

            <div className="ml-11 space-y-3">
              <div className="bg-white/5 border border-white/10 rounded-lg px-3 py-2">
                <div className="text-white text-sm font-medium">
                  {preferences.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone}
                </div>
                <div className="text-white/50 text-xs mt-1">{t('settingsPanel.autoDetectedFromSystem')}</div>
              </div>

              <div className="space-y-3">
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                  <div className="text-blue-300 text-sm">
                    <span className="text-lg mr-2">⏱️</span>
                    <span className="font-medium">{t('settingsPanel.nextReset')} </span>
                    <span className="text-blue-200 font-mono">{getRealtimeCountdown()}</span>
                  </div>
                </div>

                {!stats.actualResetInfo?.nextResetTime && (
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                    <div className="text-yellow-300 text-sm">
                      <span className="text-lg mr-2">⚠️</span>
                      {t('settingsPanel.usingEstimatedResetTime')}{' '}
                      {stats.resetInfo
                        ? new Date(stats.resetInfo.nextResetTime).toLocaleString([], {
                            timeZone:
                              preferences.timezone ||
                              Intl.DateTimeFormat().resolvedOptions().timeZone,
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : t('settingsPanel.notAvailable')}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Claude Plan Configuration */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🤖</span>
              <div>
                <div className="text-white font-medium">{t('settingsPanel.claudePlan')}</div>
                <div className="text-white/60 text-sm">
                  {t('settingsPanel.claudePlanDescription')}
                </div>
              </div>
            </div>

            <div className="ml-11 space-y-3">
              <div>
                <div className="text-white/70 text-sm mb-2">{t('settingsPanel.planSelection')}</div>
                <Select
                  value={preferences.plan || 'auto'}
                  onValueChange={(value) =>
                    handlePreferenceChange(
                      'plan',
                      value as 'auto' | 'Pro' | 'Max5' | 'Max20' | 'Custom'
                    )
                  }
                >
                  <SelectTrigger className="w-full bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">{t('settingsPanel.autoDetect')}</SelectItem>
                    <SelectItem value="Pro">{t('settingsPanel.claudePro')}</SelectItem>
                    <SelectItem value="Max5">{t('settingsPanel.claudeMax5')}</SelectItem>
                    <SelectItem value="Max20">{t('settingsPanel.claudeMax20')}</SelectItem>
                    <SelectItem value="Custom">{t('settingsPanel.custom')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {preferences.plan === 'Custom' && (
                <div>
                  <div className="text-white/70 text-sm mb-2">{t('settingsPanel.customTokenLimit')}</div>
                  <input
                    type="number"
                    min="1000"
                    max="1000000"
                    step="1000"
                    value={preferences.customTokenLimit || ''}
                    onChange={(e) =>
                      handlePreferenceChange(
                        'customTokenLimit',
                        Number.parseInt(e.target.value) || 0
                      )
                    }
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder:text-white/50 focus:border-blue-500 focus:outline-none"
                    placeholder={t('settingsPanel.enterCustomTokenLimit')}
                  />
                  <div className="text-white/50 text-xs mt-1">{t('settingsPanel.tokensPerDay')}</div>
                </div>
              )}

              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                <div className="text-green-300 text-sm">
                  <span className="text-lg mr-2">ℹ️</span>
                  {t('settingsPanel.currentDetectedPlan')} <span className="font-medium">{stats.currentPlan}</span>
                  {stats.tokenLimit && (
                    <span className="ml-2">({stats.tokenLimit.toLocaleString()} {t('settingsPanel.tokensPerDay')})</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Menu Bar Display Mode */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">📊</span>
              <div>
                <div className="text-white font-medium">{t('settingsPanel.menuBarDisplay')}</div>
                <div className="text-white/60 text-sm">
                  {t('settingsPanel.menuBarDisplayDescription')}
                </div>
              </div>
            </div>

            <div className="ml-11 space-y-3">
              <div>
                <div className="text-white/70 text-sm mb-2">{t('settingsPanel.displayMode')}</div>
                <Select
                  value={preferences.menuBarDisplayMode || 'alternate'}
                  onValueChange={(value: 'percentage' | 'cost' | 'alternate') =>
                    handlePreferenceChange('menuBarDisplayMode', value)
                  }
                >
                  <SelectTrigger className="w-full bg-white/5 border-white/10 text-white hover:bg-white/10">
                    <SelectValue placeholder={t('settingsPanel.selectDisplayMode')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">{t('settingsPanel.percentageOnly')}</SelectItem>
                    <SelectItem value="cost">{t('settingsPanel.costOnly')}</SelectItem>
                    <SelectItem value="alternate">{t('settingsPanel.alternateMode')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                <div className="text-blue-300 text-sm">
                  <span className="text-lg mr-2">💡</span>
                  {preferences.menuBarDisplayMode === 'percentage' && (
                    <span>{t('settingsPanel.percentageHint')}</span>
                  )}
                  {preferences.menuBarDisplayMode === 'cost' && (
                    <span>{t('settingsPanel.costHint')}</span>
                  )}
                  {(!preferences.menuBarDisplayMode ||
                    preferences.menuBarDisplayMode === 'alternate') && (
                    <span>{t('settingsPanel.alternateHint')}</span>
                  )}
                </div>
              </div>

              {/* Cost Basis for Menu Bar (hidden when Percentage Only is selected) */}
              {preferences.menuBarDisplayMode !== 'percentage' && (
                <div>
                  <div className="text-white/70 text-sm mb-2">{t('settingsPanel.costBasis')}</div>
                  <Select
                    value={preferences.menuBarCostSource || 'today'}
                    onValueChange={(value: 'today' | 'sessionWindow') =>
                      handlePreferenceChange('menuBarCostSource', value)
                    }
                  >
                    <SelectTrigger className="w-full bg-white/5 border-white/10 text-white hover:bg-white/10">
                      <SelectValue placeholder={t('settingsPanel.selectCostBasis')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">{t('settingsPanel.todayDaily')}</SelectItem>
                      <SelectItem value="sessionWindow">{t('settingsPanel.sessionWindow5h')}</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="text-white/50 text-xs mt-2">
                    {t('settingsPanel.costBasisDescription')}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
