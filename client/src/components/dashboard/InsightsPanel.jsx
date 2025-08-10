// components/dashboard/InsightsPanel.jsx
import {
  Lightbulb,
  TrendingUp,
  Target,
  AlertTriangle,
  Calendar,
  ShoppingCart,
} from "lucide-react";

const InsightsPanel = ({ insights }) => {
  // Your backend returns an object with insights array and other data
  const insightsData = insights?.insights || [];

  // Map insight messages to structured format with appropriate icons and colors
  const processInsights = (insightStrings) => {
    return insightStrings.map((insight, index) => {
      let icon = Lightbulb;
      let color = "text-cyan-400";
      let type = "general";

      // Determine icon and color based on content
      if (
        insight.includes("↑") ||
        insight.includes("up") ||
        insight.includes("Alert")
      ) {
        icon = AlertTriangle;
        color = "text-rose-400";
        type = "warning";
      } else if (insight.includes("↓") || insight.includes("down")) {
        icon = TrendingUp;
        color = "text-emerald-400";
        type = "positive";
      } else if (
        insight.includes("Most spent") ||
        insight.includes("Biggest")
      ) {
        icon = ShoppingCart;
        color = "text-orange-400";
        type = "spending";
      } else if (insight.includes("Recurring") || insight.includes("pattern")) {
        icon = Calendar;
        color = "text-purple-400";
        type = "pattern";
      } else if (insight.includes("Average daily")) {
        icon = Target;
        color = "text-blue-400";
        type = "average";
      }

      return {
        id: index,
        message: insight,
        icon,
        color,
        type,
      };
    });
  };

  const displayInsights = processInsights(insightsData);

  // Show additional structured data if available
  const additionalData = {
    totalThisMonth: insights?.totalThisMonth,
    pctChange: insights?.pctChange,
    topCategory: insights?.topCategory,
    dailyAvg: insights?.dailyAvg,
    biggestExp: insights?.biggestExp,
  };

  return (
    <div className="rounded-2xl bg-[#121214] border border-[#26262B] p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-8 w-8 rounded-lg bg-[#1E1E22] grid place-items-center">
          <Lightbulb className="w-4 h-4 text-cyan-400" />
        </div>
        <h3 className="text-lg font-semibold text-[#EDEDEF]">AI Insights</h3>
      </div>

      {displayInsights.length > 0 ? (
        <div className="space-y-4">
          {displayInsights.slice(0, 4).map((insight) => {
            const IconComponent = insight.icon;

            return (
              <div
                key={insight.id}
                className="flex gap-3 p-3 rounded-xl bg-[#0B0B0C] border border-[#26262B] hover:border-[#2F2F36] transition-colors"
              >
                <div className="h-6 w-6 rounded-lg bg-[#1E1E22] grid place-items-center flex-shrink-0 mt-0.5">
                  <IconComponent className={`w-3 h-3 ${insight.color}`} />
                </div>
                <p className="text-sm text-[#B3B3B8] leading-relaxed">
                  {insight.message}
                </p>
              </div>
            );
          })}

          {/* Quick Stats Row */}
          {additionalData.totalThisMonth && (
            <div className="mt-6 pt-4 border-t border-[#26262B]">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 rounded-xl bg-[#0B0B0C] border border-[#26262B]">
                  <div className="text-xs text-[#8A8A92] mb-1">This Month</div>
                  <div className="text-lg font-semibold text-[#EDEDEF]">
                    ₹{additionalData.totalThisMonth.toLocaleString()}
                  </div>
                  {additionalData.pctChange !== null && (
                    <div
                      className={`text-xs mt-1 ${
                        additionalData.pctChange > 0
                          ? "text-rose-400"
                          : "text-emerald-400"
                      }`}
                    >
                      {additionalData.pctChange > 0 ? "↑" : "↓"}
                      {Math.abs(additionalData.pctChange)}% vs last month
                    </div>
                  )}
                </div>

                <div className="p-3 rounded-xl bg-[#0B0B0C] border border-[#26262B]">
                  <div className="text-xs text-[#8A8A92] mb-1">
                    Daily Average
                  </div>
                  <div className="text-lg font-semibold text-[#EDEDEF]">
                    ₹{additionalData.dailyAvg?.toLocaleString() || 0}
                  </div>
                  {additionalData.topCategory && (
                    <div className="text-xs text-[#8A8A92] mt-1">
                      Top: {additionalData.topCategory}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <Lightbulb className="w-12 h-12 text-[#8A8A92] mx-auto mb-3" />
          <p className="text-[#8A8A92] text-sm">
            Add some expenses to see AI insights
          </p>
          <p className="text-xs text-[#6A6A72] mt-1">
            Get smart recommendations based on your spending patterns
          </p>
        </div>
      )}

      {/* 
      {process.env.NODE_ENV === "development" && insights && (
        <div className="mt-4 p-2 bg-[#0B0B0C] rounded text-xs text-[#6A6A72]">
          <details>
            <summary className="cursor-pointer hover:text-[#8A8A92]">
              Debug: Insights Structure
            </summary>
            <pre className="mt-2 overflow-auto text-xs">
              Insights Array Length: {insightsData.length}
              {"\n"}Raw Insights: {JSON.stringify(insights, null, 2)}
            </pre>
          </details>
        </div>
      )} */}
    </div>
  );
};

export default InsightsPanel;
