
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Palette, Upload, Save, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface BrandingSetting {
  id: string;
  setting_key: string;
  setting_value: any;
  category: string;
  description: string;
}

const BrandingManager = () => {
  const [settings, setSettings] = useState<BrandingSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('branding_settings')
        .select('*')
        .order('setting_key');

      if (error) throw error;
      setSettings(data || []);
    } catch (error) {
      console.error('Error fetching branding settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch branding settings',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key: string, value: any) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('branding_settings')
        .update({ setting_value: value })
        .eq('setting_key', key);

      if (error) throw error;

      setSettings(prev => prev.map(setting => 
        setting.setting_key === key ? { ...setting, setting_value: value } : setting
      ));

      toast({
        title: 'Success',
        description: 'Branding setting updated successfully',
      });
    } catch (error) {
      console.error('Error updating setting:', error);
      toast({
        title: 'Error',
        description: 'Failed to update branding setting',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const getSetting = (key: string) => {
    return settings.find(s => s.setting_key === key)?.setting_value || {};
  };

  if (loading) {
    return (
      <Card className="bg-gray-900 border-gray-700">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-20 bg-gray-800 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const logoSetting = getSetting('primary_logo');
  const colorScheme = getSetting('color_scheme');
  const footerText = getSetting('footer_text');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Branding Management</h2>
          <p className="text-gray-400">Customize your platform's visual identity</p>
        </div>
        <Button onClick={fetchSettings} variant="outline" disabled={loading}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Logo Management */}
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Logo & Brand Assets
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-white">Primary Logo URL</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  value={logoSetting.url || ''}
                  onChange={(e) => updateSetting('primary_logo', { ...logoSetting, url: e.target.value })}
                  placeholder="https://example.com/logo.png"
                  className="bg-gray-800 border-gray-600 text-white"
                />
                <Button variant="outline" size="sm">
                  <Upload className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div>
              <Label className="text-white">Alt Text</Label>
              <Input
                value={logoSetting.alt || ''}
                onChange={(e) => updateSetting('primary_logo', { ...logoSetting, alt: e.target.value })}
                placeholder="Company Logo"
                className="bg-gray-800 border-gray-600 text-white mt-2"
              />
            </div>
            {logoSetting.url && (
              <div className="mt-4">
                <Label className="text-white">Preview</Label>
                <div className="mt-2 p-4 bg-gray-800 rounded border-gray-600 border">
                  <img 
                    src={logoSetting.url} 
                    alt={logoSetting.alt} 
                    className="max-h-16 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Color Scheme */}
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Color Scheme
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="text-white">Primary Color</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    type="color"
                    value={colorScheme.primary || '#00C851'}
                    onChange={(e) => updateSetting('color_scheme', { ...colorScheme, primary: e.target.value })}
                    className="w-12 h-10 p-1 bg-gray-800 border-gray-600"
                  />
                  <Input
                    value={colorScheme.primary || '#00C851'}
                    onChange={(e) => updateSetting('color_scheme', { ...colorScheme, primary: e.target.value })}
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
              </div>
              <div>
                <Label className="text-white">Secondary Color</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    type="color"
                    value={colorScheme.secondary || '#FFFFFF'}
                    onChange={(e) => updateSetting('color_scheme', { ...colorScheme, secondary: e.target.value })}
                    className="w-12 h-10 p-1 bg-gray-800 border-gray-600"
                  />
                  <Input
                    value={colorScheme.secondary || '#FFFFFF'}
                    onChange={(e) => updateSetting('color_scheme', { ...colorScheme, secondary: e.target.value })}
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
              </div>
              <div>
                <Label className="text-white">Accent Color</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    type="color"
                    value={colorScheme.accent || '#333333'}
                    onChange={(e) => updateSetting('color_scheme', { ...colorScheme, accent: e.target.value })}
                    className="w-12 h-10 p-1 bg-gray-800 border-gray-600"
                  />
                  <Input
                    value={colorScheme.accent || '#333333'}
                    onChange={(e) => updateSetting('color_scheme', { ...colorScheme, accent: e.target.value })}
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
              </div>
            </div>
            <div className="mt-4 p-4 bg-gray-800 rounded border-gray-600 border">
              <Label className="text-white block mb-2">Color Preview</Label>
              <div className="flex gap-4">
                <div 
                  className="w-16 h-16 rounded border-2 border-white/20"
                  style={{ backgroundColor: colorScheme.primary || '#00C851' }}
                  title="Primary"
                />
                <div 
                  className="w-16 h-16 rounded border-2 border-gray-600"
                  style={{ backgroundColor: colorScheme.secondary || '#FFFFFF' }}
                  title="Secondary"
                />
                <div 
                  className="w-16 h-16 rounded border-2 border-white/20"
                  style={{ backgroundColor: colorScheme.accent || '#333333' }}
                  title="Accent"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer & Text */}
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Footer & Text Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-white">Copyright Text</Label>
              <Input
                value={footerText.copyright || ''}
                onChange={(e) => updateSetting('footer_text', { ...footerText, copyright: e.target.value })}
                placeholder="© 2024 Your Company. All rights reserved."
                className="bg-gray-800 border-gray-600 text-white mt-2"
              />
            </div>
            <div>
              <Label className="text-white">Tagline</Label>
              <Input
                value={footerText.tagline || ''}
                onChange={(e) => updateSetting('footer_text', { ...footerText, tagline: e.target.value })}
                placeholder="Create. Collect. Trade."
                className="bg-gray-800 border-gray-600 text-white mt-2"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BrandingManager;
