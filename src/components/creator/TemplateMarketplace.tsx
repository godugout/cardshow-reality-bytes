
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Star, Download, DollarSign, Eye } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export const TemplateMarketplace = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("popular");

  const { data: templates, isLoading } = useQuery({
    queryKey: ["marketplace-templates", searchTerm, selectedCategory, sortBy],
    queryFn: async () => {
      let query = supabase
        .from("card_templates_creator")
        .select(`
          *,
          creator_profiles!inner(
            user_id,
            verification_status
          )
        `)
        .eq("is_published", true);

      if (selectedCategory !== "all") {
        query = query.eq("category", selectedCategory);
      }

      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query.order(
        sortBy === "popular" ? "sales_count" : 
        sortBy === "newest" ? "created_at" :
        sortBy === "rating" ? "rating" : "price",
        { ascending: sortBy === "price" }
      );

      if (error) throw error;
      return data;
    },
  });

  const { data: myTemplates } = useQuery({
    queryKey: ["my-templates", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data: creatorProfile } = await supabase
        .from("creator_profiles")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!creatorProfile) return [];

      const { data, error } = await supabase
        .from("card_templates_creator")
        .select("*")
        .eq("creator_id", creatorProfile.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "sports", label: "Sports" },
    { value: "gaming", label: "Gaming" },
    { value: "entertainment", label: "Entertainment" },
    { value: "art", label: "Art" },
    { value: "fantasy", label: "Fantasy" },
  ];

  const handlePurchaseTemplate = (templateId: string) => {
    // TODO: Implement purchase logic
    console.log("Purchase template:", templateId);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-gray-800 rounded-lg h-96 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="price">Price: Low to High</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="border-gray-600">
              <Filter className="mr-2 h-4 w-4" />
              Advanced
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* My Templates */}
      {myTemplates && myTemplates.length > 0 && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">My Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myTemplates.slice(0, 3).map((template) => (
                <Card key={template.id} className="bg-gray-700 border-gray-600">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-white font-medium">{template.name}</h3>
                      <Badge 
                        variant={template.is_published ? "default" : "secondary"}
                        className={template.is_published ? "bg-green-600" : "bg-gray-600"}
                      >
                        {template.is_published ? "Published" : "Draft"}
                      </Badge>
                    </div>
                    <p className="text-gray-400 text-sm mb-3">{template.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-green-500 font-medium">${template.price}</span>
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <Download className="h-3 w-3" />
                        {template.sales_count}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates?.map((template) => (
          <Card key={template.id} className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors">
            <CardContent className="p-0">
              {/* Preview Image */}
              <div className="aspect-[3/4] bg-gradient-to-br from-gray-700 to-gray-800 rounded-t-lg flex items-center justify-center">
                {template.preview_images && template.preview_images[0] ? (
                  <img
                    src={template.preview_images[0]}
                    alt={template.name}
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                ) : (
                  <div className="text-gray-500">No Preview</div>
                )}
              </div>

              <div className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="text-white font-semibold">{template.name}</h3>
                  <Badge variant="outline" className="border-blue-500 text-blue-400">
                    {template.category}
                  </Badge>
                </div>

                <p className="text-gray-400 text-sm line-clamp-2">
                  {template.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500" />
                      {template.rating.toFixed(1)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="h-3 w-3" />
                      {template.sales_count}
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {Math.floor(Math.random() * 1000)} {/* TODO: Add view tracking */}
                    </div>
                  </div>

                  {template.creator_profiles?.verification_status === "verified" && (
                    <Badge variant="outline" className="border-green-500 text-green-400 text-xs">
                      Verified
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4 text-green-500" />
                    <span className="text-white font-semibold">${template.price}</span>
                  </div>

                  <Button
                    onClick={() => handlePurchaseTemplate(template.id)}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Purchase
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {templates?.length === 0 && (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="py-12 text-center">
            <p className="text-gray-400 text-lg">No templates found</p>
            <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
