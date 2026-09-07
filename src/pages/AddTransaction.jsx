import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTransactions } from "@/hooks/useTransactions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function AddTransaction() {
  const { addTransaction } = useTransactions();
  const navigate = useNavigate();

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("expense");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [errors, setErrors] = useState({});

  function validate() {
    const nextErrors = {};
    if (!description.trim()) nextErrors.description = "Description is required.";
    if (!amount.toString().trim()) {
      nextErrors.amount = "Amount is required.";
    } else if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      nextErrors.amount = "Amount must be a number greater than 0.";
    }
    if (!category.trim()) nextErrors.category = "Category is required.";
    if (!date) nextErrors.date = "Date is required.";
    return nextErrors;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    addTransaction({ description: description.trim(), amount, category: category.trim(), type, date });
    navigate("/");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Transaction</h1>
        <Link to="/" className="text-sm text-muted-foreground hover:underline">
          Back to Dashboard
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New Transaction</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 max-w-md" noValidate>
            <div className="space-y-1">
              <label className="text-sm text-muted-foreground">Description</label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Hamburger"
                aria-invalid={!!errors.description}
              />
              {errors.description && (
                <p className="text-xs text-destructive">{errors.description}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-sm text-muted-foreground">Amount</label>
              <Input
                type="text"
                inputMode="decimal"
                value={amount}
                onChange={(e) => {
                  const val = e.target.value;
                  // Only allow digits and a single decimal point
                  if (val === "" || /^\d*\.?\d*$/.test(val)) {
                  setAmount(val);
                  }
                }}
                placeholder="0.00"
                aria-invalid={!!errors.amount}
              />
              {errors.amount && (
                <p className="text-xs text-destructive">{errors.amount}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-sm text-muted-foreground">Category</label>
              <Input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Food"
                aria-invalid={!!errors.category}
              />
              {errors.category && (
                <p className="text-xs text-destructive">{errors.category}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-sm text-muted-foreground">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm appearance-none hover:bg-muted transition-colors"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm text-muted-foreground">Date</label>
              <DatePicker value={date} onChange={setDate} />
              {errors.date && (
                <p className="text-xs text-destructive">{errors.date}</p>
              )}
            </div>
            <Button type="submit" className="w-full">
              Add Transaction
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
