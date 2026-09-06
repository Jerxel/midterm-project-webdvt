import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function About() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">About</h1>
        <Link to="/" className="text-sm text-muted-foreground hover:underline">
          Back to Dashboard
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Budget Tracker</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            It is a simple app for logging income and expenses,
            reviewing your transaction history, and seeing a breakdown of
            spending by category.
          </p>
          <p>
            All data is stored locally in your browser — nothing is sent to a
            server.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}