import React from "react";
import { TrendingUp, Star, Users } from "lucide-react";

function useCountUp(to, duration = 1650) {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    let start = 0;
    const increment = to / (duration / 16.7);
    let animFrame;

    function step() {
      start += increment;
      if (start < to) {
        setCount(Math.floor(start));
        animFrame = requestAnimationFrame(step);
      } else {
        setCount(to);
      }
    }
    step();
    return () => cancelAnimationFrame(animFrame);
  }, [to, duration]);

  return count;
}

const StatItem = ({ stat, index }) => {
  const count = useCountUp(stat.number);

  const iconAnim =
    index === 0
      ? "animate-bounce"
      : index === 1
      ? "animate-pulse"
      : "animate-float";

  return (
    <div className="bg-neutral-900 rounded-2xl shadow-lg flex flex-col items-center justify-center py-10 px-2 sm:px-5 min-h-[160px] border border-neutral-800 w-full">
      <stat.icon className={`w-12 h-12 mb-3 text-teal-400 ${iconAnim}`} />
      <h3 className="text-3xl sm:text-4xl font-extrabold text-white mb-1 flex items-end">
        {count.toLocaleString()}
        <span className="text-teal-400 text-2xl font-bold ml-1">
          {stat.postfix}
        </span>
      </h3>
      <p className="text-base sm:text-lg text-neutral-300">{stat.label}</p>
    </div>
  );
};

const stats = [
  { icon: TrendingUp, number: 20000, label: "Active Readers", postfix: "+" },
  { icon: Star, number: 500, label: "Featured Articles", postfix: "+" },
  { icon: Users, number: 10000, label: "Content Creators", postfix: "+" },
];

const StatsSection = () => (
  <section className="w-full bg-black py-12 px-0">
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 md:gap-x-10 w-full">
      {stats.map((stat, idx) => (
        <StatItem key={idx} stat={stat} index={idx} />
      ))}
    </div>
  </section>
);

export default StatsSection;
