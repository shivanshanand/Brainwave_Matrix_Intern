export function generateInsights(expenses) {
  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

  // Split current/last month
  const thisMonth = expenses.filter((e) => e.date >= thisMonthStart);
  const lastMonth = expenses.filter(
    (e) => e.date >= lastMonthStart && e.date < thisMonthStart
  );

  // Totals
  const totalThisMonth = thisMonth.reduce((sum, e) => sum + e.amount, 0);
  const totalLastMonth = lastMonth.reduce((sum, e) => sum + e.amount, 0);

  // Percentage change
  const pctChange =
    totalLastMonth > 0
      ? Math.round(((totalThisMonth - totalLastMonth) / totalLastMonth) * 100)
      : null;

  // Most-used category and category comparison
  const byCat = {};
  for (let e of thisMonth)
    byCat[e.category] = (byCat[e.category] || 0) + e.amount;
  const topCategory = Object.entries(byCat).sort((a, b) => b[1] - a[1])[0];

  // Category overspend check
  let overspentCategory = null,
    overspentPct = 0;
  for (let cat in byCat) {
    const thisAmt = byCat[cat];
    const lastCatAmt = lastMonth
      .filter((e) => e.category === cat)
      .reduce((sum, e) => sum + e.amount, 0);
    if (lastCatAmt > 0 && thisAmt > lastCatAmt * 1.3) {
      if (thisAmt - lastCatAmt > overspentPct) {
        // choose biggest jump
        overspentCategory = cat;
        overspentPct = Math.round(((thisAmt - lastCatAmt) / lastCatAmt) * 100);
      }
    }
  }

  // Recurring category detection
  const recurring = {};
  for (let e of expenses) {
    const key = `${e.category}|${e.amount}`;
    recurring[key] = (recurring[key] || 0) + 1;
  }
  const recurringEntries = Object.entries(recurring).filter(([k, v]) => v >= 3);

  // Frequent "merchant" (from note field)
  let popularNote = null;
  if (expenses.length) {
    const noteCount = {};
    for (let e of expenses)
      if (e.note) noteCount[e.note] = (noteCount[e.note] || 0) + 1;
    let maxN = 0;
    for (let n in noteCount)
      if (noteCount[n] > maxN) {
        maxN = noteCount[n];
        popularNote = n;
      }
  }

  // Biggest expense this month
  const biggest = thisMonth.length
    ? thisMonth.reduce(
        (max, e) => (e.amount > max.amount ? e : max),
        thisMonth[0]
      )
    : null;

  // Daily avg
  const days = (now - thisMonthStart) / (1000 * 60 * 60 * 24) + 1;
  const dailyAvg = Math.round((totalThisMonth / days) * 100) / 100;

  // Return actionable, friendly messages
  const insights = [
    `You've spent ₹${totalThisMonth} this month (${
      pctChange !== null
        ? pctChange > 0
          ? `↑${pctChange}%`
          : `↓${Math.abs(pctChange)}%`
        : "No data for last month"
    } vs last month).`,
    topCategory
      ? `Most spent on ${topCategory[0]} (₹${topCategory[1]}).`
      : null,
    overspentCategory
      ? `Alert: Spending on ${overspentCategory} is up ${overspentPct}% compared to last month.`
      : null,
    recurringEntries.length
      ? `Recurring expense pattern detected in: ${recurringEntries
          .map((e) => e[0].split("|")[0])
          .join(", ")}`
      : null,
    popularNote ? `Frequent merchant/activity: "${popularNote}".` : null,
    biggest
      ? `Biggest single expense: ₹${biggest.amount} (${biggest.category}${
          biggest.note ? ", " + biggest.note : ""
        }).`
      : null,
    `Average daily spend this month: ₹${dailyAvg}.`,
  ].filter(Boolean);

  // You can also send a structured object if frontend wants to visualize individual pieces
  return {
    totalThisMonth,
    pctChange,
    topCategory: topCategory?.[0] ?? null,
    recurring: recurringEntries.map((e) => e[0]),
    popularNote,
    biggestExp: biggest,
    dailyAvg,
    insights,
  };
}
