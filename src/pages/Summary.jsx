import { useMemo } from "react";
import { useTransactions } from "@/hooks/useTransactions";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

export default function Summary() {
  const { transactions } = useTransactions();

  // Breakdown of expenses by category, sorted highest spend first
  const categoryBreakdown = useMemo(() => {
    const totals = {};
    let grandTotal = 0;

    for (const t of transactions) {
      if (t.type !== "expense") continue;
      totals[t.category] = (totals[t.category] || 0) + t.amount;
      grandTotal += t.amount;
    }

    return Object.entries(totals)
      .map(([category, amount]) => ({
        category,
        amount,
        percent: grandTotal > 0 ? (amount / grandTotal) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [transactions]);

  const totalExpenses = useMemo(
    () => categoryBreakdown.reduce((sum, c) => sum + c.amount, 0),
    [categoryBreakdown]
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Summary</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Spending by Category</CardTitle>
        </CardHeader>
        <CardContent>
          {categoryBreakdown.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No expenses recorded yet.
            </p>
          ) : (
            <div className="space-y-4">
              {categoryBreakdown.map((c) => (
                <div key={c.category} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{c.category}</span>
                    <span className="text-muted-foreground">
                      ₱{formatCurrency(c.amount)} ({c.percent.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${c.percent}%` }}
                    />
                  </div>
                </div>
              ))}

              <div className="flex items-center justify-between border-t border-border pt-3 text-sm font-semibold">
                <span>Total Expenses</span>
                <span>₱{formatCurrency(totalExpenses)}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
