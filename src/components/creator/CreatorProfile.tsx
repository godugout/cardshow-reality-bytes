
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { 
  User, 
  Mail, 
  Globe, 
  DollarSign, 
  Star, 
  Shield, 
  Settings,
  Save
} from "lucide-react";

interface CommissionRates {
  standard: number;
  premium: number;
  custom: number;
}

export const CreatorProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    bio: "",
    portfolio_url: "",
    specialties: [] as string[],
    commission_rates: {
      standard: 50.00,
      premium: 100.00,
      custom: 200.00
    } as CommissionRates,
    payout_enabled: false,
  });

  const { data: creatorProfile, isLoading } = useQuery({
    queryKey: ["creator-profile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("creator_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();
      
      if (error && error.code !== "PGRST116") throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: userProfile } = useQuery({
    queryKey: ["user-profile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const updateProfile = useMutation({
    mutationFn: async (data: any) => {
      if (!user) throw new Error("No user");
      
      const { error } = await supabase
        .from("creator_profiles")
        .upsert({
          user_id: user.id,
          ...data,
          updated_at: new Date().toISOString(),
        }, { onConflict: "user_id" });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["creator-profile"] });
      toast({
        title: "Profile Updated",
        description: "Your creator profile has been saved successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Update Failed", 
        description: error.message,
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (creatorProfile) {
      // Safely parse commission_rates from JSONB
      let commissionRates: CommissionRates = {
        standard: 50.00,
        premium: 100.00,
        custom: 200.00
      };

      if (creatorProfile.commission_rates && typeof creatorProfile.commission_rates === 'object') {
        const rates = creatorProfile.commission_rates as any;
        commissionRates = {
          standard: Number(rates.standard) || 50.00,
          premium: Number(rates.premium) || 100.00,
          custom: Number(rates.custom) || 200.00
        };
      }

      setFormData({
        bio: creatorProfile.bio || "",
        portfolio_url: creatorProfile.portfolio_url || "",
        specialties: Array.isArray(creatorProfile.specialties) ? creatorProfile.specialties : [],
        commission_rates: commissionRates,
        payout_enabled: creatorProfile.payout_enabled || false,
      });
    }
  }, [creatorProfile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile.mutate(formData);
  };

  const handleSpecialtyChange = (specialty: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        specialties: [...prev.specialties, specialty]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        specialties: prev.specialties.filter(s => s !== specialty)
      }));
    }
  };

  const specialtyOptions = [
    "Sports Cards",
    "Gaming Cards", 
    "Fantasy Art",
    "Portrait Art",
    "Abstract Design",
    "Digital Illustration",
    "Character Design",
    "Logo Design",
    "Typography",
    "3D Modeling"
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-gray-800 rounded-lg h-64 animate-pulse" />
        <div className="bg-gray-800 rounded-lg h-96 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Overview */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <User className="h-5 w-5" />
            Creator Profile Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-white">
                  {userProfile?.username?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
              <h3 className="text-white font-semibold">{userProfile?.username || "Unknown User"}</h3>
              <p className="text-gray-400 text-sm">{userProfile?.full_name}</p>
              <div className="flex justify-center mt-2">
                <Badge 
                  variant={creatorProfile?.verification_status === "verified" ? "default" : "secondary"}
                  className={
                    creatorProfile?.verification_status === "verified" 
                      ? "bg-green-600 text-white" 
                      : "bg-yellow-600 text-white"
                  }
                >
                  <Shield className="w-3 h-3 mr-1" />
                  {creatorProfile?.verification_status || "Unverified"}
                </Badge>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-400">
                <Mail className="h-4 w-4" />
                <span className="text-sm">{user?.email}</span>
              </div>
              {formData.portfolio_url && (
                <div className="flex items-center gap-2 text-gray-400">
                  <Globe className="h-4 w-4" />
                  <a 
                    href={formData.portfolio_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-400 hover:underline"
                  >
                    Portfolio Website
                  </a>
                </div>
              )}
              <div className="flex items-center gap-2 text-gray-400">
                <DollarSign className="h-4 w-4" />
                <span className="text-sm">
                  ${Number(creatorProfile?.total_earnings || 0).toFixed(2)} earned
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Cards Created</span>
                <span className="text-white font-medium">{creatorProfile?.cards_created || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Avg Rating</span>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="text-white font-medium">
                    {Number(creatorProfile?.avg_rating || 0).toFixed(1)}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Payout Status</span>
                <Badge variant={formData.payout_enabled ? "default" : "secondary"}>
                  {formData.payout_enabled ? "Enabled" : "Disabled"}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Settings Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Profile Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="bio" className="text-gray-300">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Tell potential customers about your work and experience..."
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="portfolio" className="text-gray-300">Portfolio URL</Label>
              <Input
                id="portfolio"
                value={formData.portfolio_url}
                onChange={(e) => setFormData(prev => ({ ...prev, portfolio_url: e.target.value }))}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="https://your-portfolio.com"
              />
            </div>

            <div>
              <Label className="text-gray-300">Specialties</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                {specialtyOptions.map((specialty) => (
                  <div key={specialty} className="flex items-center space-x-2">
                    <Switch
                      id={specialty}
                      checked={formData.specialties.includes(specialty)}
                      onCheckedChange={(checked) => handleSpecialtyChange(specialty, checked)}
                    />
                    <Label htmlFor={specialty} className="text-gray-400 text-sm">
                      {specialty}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-gray-300">Commission Rates</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                <div>
                  <Label htmlFor="standard-rate" className="text-gray-400 text-sm">Standard ($)</Label>
                  <Input
                    id="standard-rate"
                    type="number"
                    value={formData.commission_rates.standard}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      commission_rates: {
                        ...prev.commission_rates,
                        standard: Number(e.target.value)
                      }
                    }))}
                    className="bg-gray-700 border-gray-600 text-white"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <Label htmlFor="premium-rate" className="text-gray-400 text-sm">Premium ($)</Label>
                  <Input
                    id="premium-rate"
                    type="number"
                    value={formData.commission_rates.premium}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      commission_rates: {
                        ...prev.commission_rates,
                        premium: Number(e.target.value)
                      }
                    }))}
                    className="bg-gray-700 border-gray-600 text-white"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <Label htmlFor="custom-rate" className="text-gray-400 text-sm">Custom ($)</Label>
                  <Input
                    id="custom-rate"
                    type="number"
                    value={formData.commission_rates.custom}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      commission_rates: {
                        ...prev.commission_rates,
                        custom: Number(e.target.value)
                      }
                    }))}
                    className="bg-gray-700 border-gray-600 text-white"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="payout-enabled"
                checked={formData.payout_enabled}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, payout_enabled: checked }))}
              />
              <Label htmlFor="payout-enabled" className="text-gray-300">
                Enable Automatic Payouts
              </Label>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={updateProfile.isPending}
            className="min-w-32"
          >
            <Save className="mr-2 h-4 w-4" />
            {updateProfile.isPending ? "Saving..." : "Save Profile"}
          </Button>
        </div>
      </form>
    </div>
  );
};
