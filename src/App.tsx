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
    <main className="min-h-screen bg-background text-foreground">
      <section className="container mx-auto flex flex-col items-center gap-6 py-16 text-center">
        <Badge variant="secondary" className="gap-1">
          <Sparkles className="h-3 w-3" /> shadcn/ui ready
        </Badge>
        <h1 className="font-display text-5xl text-primary md:text-6xl">funkids</h1>
        <p className="max-w-md text-muted-foreground">
          A playful online toy store. The shadcn/ui primitives below are wired
          to our custom theme — try the buttons and the input.
        </p>

        <Card className="w-full max-w-md text-left shadow-card">
          <CardHeader>
            <CardTitle>Primitive showcase</CardTitle>
            <CardDescription>Buttons, badges and inputs use our HSL tokens.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Button>Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost" size="icon" aria-label="Like">
                <Heart />
              </Button>
            </div>
            <Input placeholder="Search toys..." />
          </CardContent>
          <CardFooter className="gap-2">
            <Badge>new</Badge>
            <Badge variant="secondary">popular</Badge>
            <Badge variant="outline">sale</Badge>
          </CardFooter>
        </Card>
      </section>
    </main>
  );
}

export default App;
