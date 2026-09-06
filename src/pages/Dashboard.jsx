import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTransactions } from "@/hooks/useTransactions";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TransactionRow from "@/components/TransactionRow";

export default function Dashboard() {
  const { transactions } = useTransactions();
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  // Distinct categories present in the data, for the filter dropdown
  const categories = useMemo(() => {
    const set = new Set(transactions.map((t) => t.category));
    return Array.from(set).sort();
  }, [transactions]);

  // Overall balance is always computed over ALL transactions,
  // independent of whatever filters are currently applied
  const { totalIncome, totalExpenses, balance } = useMemo(() => {
    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
    return {
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses,
    };
  }, [transactions]);

  // Filtered list only recomputes when transactions or the filters change,
  // not on every Dashboard render
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const categoryMatch =
        categoryFilter === "all" || t.category === categoryFilter;
      const typeMatch = typeFilter === "all" || t.type === typeFilter;
      return categoryMatch && typeMatch;
    });
  }, [transactions, categoryFilter, typeFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Link to="/add" className={buttonVariants({ variant: "default" })}>
          Add Transaction
        </Link>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Balance
            </CardTitle>
          </CardHeader>
          <CardContent className="text-lg sm:text-xl font-semibold break-words">
            ₱{balance.toFixed(2)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Income
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xl font-semibold text-green-600">
            ₱{totalIncome.toFixed(2)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Expenses
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xl font-semibold text-red-500">
            ₱{totalExpenses.toFixed(2)}
          </CardContent>
        </Card>
      </div>

      {/* Filters + table */}
      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <div className="space-y-1">
              <label className="text-sm text-muted-foreground block">
                Category
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="h-9 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="all">All categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm text-muted-foreground block">
                Type
              </label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="h-9 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="all">All types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
          </div>

          {transactions.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No transactions yet.{" "}
              <Link to="/add" className="underline">
                Add your first one
              </Link>
              .
            </p>
          ) : filteredTransactions.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No transactions match these filters.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((t) => (
                  <TransactionRow key={t.id} transaction={t} />
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
