
import { TrendingUp, Users, Zap, DollarSign } from "lucide-react";

const StatsSection = () => {
  const stats = [
    {
      icon: Users,
      value: "10K+",
      label: "Active Creators",
      subtext: "Join the community"
    },
    {
      icon: Zap,
      value: "1M+",
      label: "Cards Created",
      subtext: "And counting"
    },
    {
      icon: DollarSign,
      value: "$2.5M",
      label: "Creator Earnings",
      subtext: "In the last month"
    },
    {
      icon: TrendingUp,
      value: "99.9%",
      label: "Uptime",
      subtext: "Reliable platform"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-[#00C851]/5 to-[#00A543]/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Trusted by creators{" "}
            <span className="bg-gradient-to-r from-[#00C851] to-[#00A543] bg-clip-text text-transparent">
              worldwide
            </span>
          </h2>
          <p className="text-xl text-gray-300">
            Join thousands of creators who are already earning with Cardshow
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#00C851] to-[#00A543] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <stat.icon className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                {stat.value}
              </div>
              <div className="text-lg font-medium text-gray-300 mb-1">
                {stat.label}
              </div>
              <div className="text-sm text-gray-500">
                {stat.subtext}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
