import { Heart, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

function App() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground px-6 text-center">
      <h1 className="font-display text-5xl text-primary">Internet Toys</h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        Tailwind tokens and custom theme are wired up. Light tokens are active;
        dark tokens are ready for the upcoming theme toggle.
      </p>
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <span className="rounded-md bg-primary px-4 py-2 text-primary-foreground shadow-toy">
          primary
        </span>
        <span className="rounded-md bg-secondary px-4 py-2 text-secondary-foreground">
          secondary
        </span>
        <span className="rounded-md bg-accent px-4 py-2 text-accent-foreground">
          accent
        </span>
        <span className="rounded-md bg-muted px-4 py-2 text-muted-foreground">
          muted
        </span>
      </div>
    </main>
  );
}

export default App;
