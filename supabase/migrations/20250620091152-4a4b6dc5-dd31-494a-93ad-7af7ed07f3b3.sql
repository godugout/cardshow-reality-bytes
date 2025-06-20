
-- Create table for storing user 3D preferences
CREATE TABLE public.user_3d_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  quality_preset VARCHAR(20) DEFAULT 'auto' CHECK (quality_preset IN ('ultra', 'high', 'medium', 'low', 'auto')),
  enable_shaders BOOLEAN DEFAULT true,
  enable_particles BOOLEAN DEFAULT true,
  enable_animations BOOLEAN DEFAULT true,
  enable_sound BOOLEAN DEFAULT true,
  enable_haptics BOOLEAN DEFAULT true,
  battery_optimization BOOLEAN DEFAULT true,
  accessibility_mode BOOLEAN DEFAULT false,
  custom_settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies
ALTER TABLE public.user_3d_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own 3D preferences" 
  ON public.user_3d_preferences 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own 3D preferences" 
  ON public.user_3d_preferences 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own 3D preferences" 
  ON public.user_3d_preferences 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX idx_user_3d_preferences_user_id ON public.user_3d_preferences(user_id);

-- Create trigger for updated_at
CREATE TRIGGER handle_updated_at_user_3d_preferences
  BEFORE UPDATE ON public.user_3d_preferences
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Add shader performance tracking table
CREATE TABLE public.shader_performance_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  device_info JSONB,
  shader_type VARCHAR(50),
  compilation_time_ms INTEGER,
  render_time_ms INTEGER,
  fps_average DECIMAL(5,2),
  quality_preset VARCHAR(20),
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- RLS for performance logs
ALTER TABLE public.shader_performance_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own performance logs" 
  ON public.shader_performance_logs 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all performance logs" 
  ON public.shader_performance_logs 
  FOR SELECT 
  USING (public.is_admin(auth.uid()));
