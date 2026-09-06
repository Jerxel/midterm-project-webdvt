import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useTransactions } from "@/hooks/useTransactions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";

export default function TransactionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getTransaction, updateTransaction, deleteTransaction } = useTransactions();

  const transaction = getTransaction(id);

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(null);
  const [errors, setErrors] = useState({});
  // Tracks which transaction id the form state was last synced from
  const [syncedId, setSyncedId] = useState(null);

  // Reset the edit form when navigating to a different transaction.
  // This adjusts state during render (React's recommended pattern for
  // "resetting state when a prop changes") instead of using an effect,
  // which avoids an extra render pass.
  if (transaction && syncedId !== id) {
    setSyncedId(id);
    setIsEditing(false);
    setErrors({});
    setForm({
      description: transaction.description,
      amount: transaction.amount,
      category: transaction.category,
      type: transaction.type,
      date: transaction.date,
    });
  }

  if (!transaction) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Transaction not found</h1>
        <p className="text-sm text-muted-foreground">
          This transaction may have been deleted.
        </p>
        <Link to="/" className="text-sm underline">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  function validate() {
    const nextErrors = {};
    if (!form.description.trim()) nextErrors.description = "Description is required.";
    if (form.amount === "" || isNaN(parseFloat(form.amount)) || parseFloat(form.amount) <= 0) {
      nextErrors.amount = "Amount must be a number greater than 0.";
    }
    if (!form.category.trim()) nextErrors.category = "Category is required.";
    if (!form.date) nextErrors.date = "Date is required.";
    return nextErrors;
  }

  function handleSave(e) {
    e.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    updateTransaction(transaction.id, {
      description: form.description.trim(),
      amount: form.amount,
      category: form.category.trim(),
      type: form.type,
      date: form.date,
    });
    setIsEditing(false);
  }

  function handleDelete() {
    deleteTransaction(transaction.id);
    navigate("/");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Transaction Detail</h1>
        <Link to="/" className="text-sm text-muted-foreground hover:underline">
          Back to Dashboard
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? "Edit Transaction" : transaction.description}</CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <form onSubmit={handleSave} className="space-y-4 max-w-md" noValidate>
              <div className="space-y-1">
                <label className="text-sm text-muted-foreground">Description</label>
                <Input
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  aria-invalid={!!errors.description}
                />
                {errors.description && (
                  <p className="text-xs text-destructive">{errors.description}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-sm text-muted-foreground">Amount</label>
                <Input
                  type="number"
                  step="0.01"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  aria-invalid={!!errors.amount}
                />
                {errors.amount && (
                  <p className="text-xs text-destructive">{errors.amount}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-sm text-muted-foreground">Category</label>
                <Input
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  aria-invalid={!!errors.category}
                />
                {errors.category && (
                  <p className="text-xs text-destructive">{errors.category}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-sm text-muted-foreground">Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-sm text-muted-foreground">Date</label>
                <DatePicker
                  value={form.date}
                  onChange={(date) => setForm({ ...form, date })}
                />
                {errors.date && (
                  <p className="text-xs text-destructive">{errors.date}</p>
                )}
              </div>

              <div className="flex gap-2">
                <Button type="submit">Save Changes</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setErrors({});
                    setIsEditing(false);
                    setForm({
                      description: transaction.description,
                      amount: transaction.amount,
                      category: transaction.category,
                      type: transaction.type,
                      date: transaction.date,
                    });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-3 max-w-md">
              <DetailRow label="Description" value={transaction.description} />
              <DetailRow
                label="Amount"
                value={`${transaction.type === "income" ? "+" : "-"}₱${transaction.amount.toFixed(2)}`}
                className={transaction.type === "income" ? "text-green-600" : "text-red-500"}
              />
              <DetailRow label="Category" value={transaction.category} />
              <DetailRow label="Type" value={transaction.type} className="capitalize" />
              <DetailRow label="Date" value={transaction.date} />

              <div className="flex gap-2 pt-2">
                <Button onClick={() => setIsEditing(true)}>Edit</Button>
                <Button variant="destructive" onClick={handleDelete}>
                  Delete
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function DetailRow({ label, value, className = "" }) {
  return (
    <div className="flex items-center justify-between border-b border-border pb-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={`text-sm font-medium ${className}`}>{value}</span>
    </div>
  );
}
