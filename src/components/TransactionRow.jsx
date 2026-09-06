import { memo } from "react";
import { Link } from "react-router-dom";
import { TableCell, TableRow } from "@/components/ui/table";

/**
 * Performance optimization:
 * Without memo, every TransactionRow re-renders whenever Dashboard
 * re-renders for ANY reason (e.g. typing in the category filter input,
 * or toggling the type filter) even though most rows' own data hasn't
 * changed. Wrapping in React.memo means a row only re-renders when the
 * transaction it represents actually changes.
 */
function TransactionRow({ transaction }) {
  const { id, date, description, category, type, amount } = transaction;

  return (
    <TableRow>
      <TableCell>{date}</TableCell>
      <TableCell>
        <Link to={`/transaction/${id}`} className="hover:underline">
          {description}
        </Link>
      </TableCell>
      <TableCell>{category}</TableCell>
      <TableCell className="capitalize">{type}</TableCell>
      <TableCell
        className={`text-right ${
          type === "income" ? "text-green-600" : "text-red-500"
        }`}
      >
        {type === "income" ? "+" : "-"}${amount.toFixed(2)}
      </TableCell>
    </TableRow>
  );
}

export default memo(TransactionRow);
