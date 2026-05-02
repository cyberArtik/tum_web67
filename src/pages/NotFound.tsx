import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <section className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="font-display text-7xl font-bold text-primary">404</p>
      <h1 className="font-display text-2xl text-foreground">Page not found</h1>
      <p className="max-w-sm font-body text-muted-foreground">
        The toy you were looking for must have rolled under the couch. Let's get
        you back to the shop.
      </p>
      <Link to="/">
        <Button className="rounded-full">Back home</Button>
      </Link>
    </section>
  );
};

export default NotFound;
