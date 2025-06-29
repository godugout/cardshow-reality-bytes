
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Monitor, Accessibility, Palette, Layout } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UXSetting {
  id: string;
  setting_category: string;
  setting_key: string;
  setting_value: any;
  description: string;
  is_active: boolean;
}

const UXSettingsManager = () => {
  const [settings, setSettings] = useState<UXSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
    initializeDefaultSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('ux_settings')
        .select('*')
        .order('setting_category', { ascending: true });

      if (error) throw error;
      setSettings(data || []);
    } catch (error) {
      console.error('Error fetching UX settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch UX settings',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const initializeDefaultSettings = async () => {
    const defaultSettings = [
      // Theme Settings
      { category: 'theme', key: 'dark_mode_default', value: true, description: 'Enable dark mode by default' },
      { category: 'theme', key: 'theme_switching', value: true, description: 'Allow users to switch themes' },
      { category: 'theme', key: 'auto_theme', value: false, description: 'Automatically switch theme based on time' },
      
      // Layout Settings
      { category: 'layout', key: 'sidebar_collapsed', value: false, description: 'Collapse sidebar by default' },
      { category: 'layout', key: 'show_breadcrumbs', value: true, description: 'Show navigation breadcrumbs' },
      { category: 'layout', key: 'compact_mode', value: false, description: 'Use compact layout for better space utilization' },
      
      // Accessibility Settings
      { category: 'accessibility', key: 'high_contrast', value: false, description: 'Enable high contrast mode' },
      { category: 'accessibility', key: 'font_size_multiplier', value: 1.0, description: 'Default font size multiplier' },
      { category: 'accessibility', key: 'reduced_motion', value: false, description: 'Reduce motion and animations' },
      { category: 'accessibility', key: 'focus_indicators', value: true, description: 'Enhanced focus indicators' },
      
      // Performance Settings
      { category: 'performance', key: 'lazy_loading', value: true, description: 'Enable lazy loading for images' },
      { category: 'performance', key: 'preload_next_page', value: true, description: 'Preload next page content' },
      { category: 'performance', key: 'animation_level', value: 75, description: 'Animation intensity level (0-100)' },
    ];

    // Only insert if no settings exist
    const { count } = await supabase
      .from('ux_settings')
      .select('*', { count: 'exact', head: true });

    if (count === 0) {
      const { error } = await supabase
        .from('ux_settings')
        .insert(
          defaultSettings.map(setting => ({
            setting_category: setting.category,
            setting_key: setting.key,
            setting_value: setting.value,
            description: setting.description,
            is_active: true
          }))
        );

      if (error) {
        console.error('Error initializing default settings:', error);
      }
    }
  };

  const updateSetting = async (id: string, value: any) => {
    try {
      const { error } = await supabase
        .from('ux_settings')
        .update({ setting_value: value })
        .eq('id', id);

      if (error) throw error;

      setSettings(prev => prev.map(setting => 
        setting.id === id ? { ...setting, setting_value: value } : setting
      ));

      toast({
        title: 'Success',
        description: 'UX setting updated successfully',
      });
    } catch (error) {
      console.error('Error updating setting:', error);
      toast({
        title: 'Error',
        description: 'Failed to update UX setting',
        variant: 'destructive'
      });
    }
  };

  const toggleSetting = async (id: string, active: boolean) => {
    try {
      const { error } = await supabase
        .from('ux_settings')
        .update({ is_active: active })
        .eq('id', id);

      if (error) throw error;

      setSettings(prev => prev.map(setting => 
        setting.id === id ? { ...setting, is_active: active } : setting
      ));
    } catch (error) {
      console.error('Error toggling setting:', error);
      toast({
        title: 'Error',
        description: 'Failed to toggle setting',
        variant: 'destructive'
      });
    }
  };

  const getSettingsByCategory = (category: string) => {
    return settings.filter(setting => setting.setting_category === category);
  };

  const renderSettingControl = (setting: UXSetting) => {
    const value = setting.setting_value;

    if (typeof value === 'boolean') {
      return (
        <Switch
          checked={value}
          onCheckedChange={(checked) => updateSetting(setting.id, checked)}
          disabled={!setting.is_active}
        />
      );
    }

    if (typeof value === 'number' && setting.setting_key.includes('multiplier')) {
      return (
        <div className="flex items-center gap-4 w-full max-w-xs">
          <Slider
            value={[value]}
            onValueChange={([newValue]) => updateSetting(setting.id, newValue)}
            min={0.8}
            max={2.0}
            step={0.1}
            disabled={!setting.is_active}
          />
          <span className="text-sm text-gray-400 min-w-12">{value.toFixed(1)}x</span>
        </div>
      );
    }

    if (typeof value === 'number' && setting.setting_key.includes('level')) {
      return (
        <div className="flex items-center gap-4 w-full max-w-xs">
          <Slider
            value={[value]}
            onValueChange={([newValue]) => updateSetting(setting.id, newValue)}
            min={0}
            max={100}
            step={5}
            disabled={!setting.is_active}
          />
          <span className="text-sm text-gray-400 min-w-12">{value}%</span>
        </div>
      );
    }

    return (
      <Input
        value={value}
        onChange={(e) => updateSetting(setting.id, e.target.value)}
        className="bg-gray-800 border-gray-600 text-white max-w-xs"
        disabled={!setting.is_active}
      />
    );
  };

  const categoryIcons = {
    theme: Palette,
    layout: Layout,
    accessibility: Accessibility,
    performance: Monitor
  };

  if (loading) {
    return (
      <Card className="bg-gray-900 border-gray-700">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 bg-gray-800 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">UX Settings Management</h2>
        <p className="text-gray-400">Configure user experience and interface settings</p>
      </div>

      <div className="grid gap-6">
        {Object.entries(categoryIcons).map(([category, Icon]) => {
          const categorySettings = getSettingsByCategory(category);
          if (categorySettings.length === 0) return null;

          return (
            <Card key={category} className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Icon className="w-5 h-5" />
                  {category.charAt(0).toUpperCase() + category.slice(1)} Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {categorySettings.map((setting) => (
                  <div key={setting.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <Label className="text-white font-medium">
                          {setting.setting_key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </Label>
                        <Switch
                          checked={setting.is_active}
                          onCheckedChange={(checked) => toggleSetting(setting.id, checked)}
                          size="sm"
                        />
                      </div>
                      <p className="text-gray-400 text-sm">{setting.description}</p>
                    </div>
                    <div className="ml-6">
                      {renderSettingControl(setting)}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default UXSettingsManager;
