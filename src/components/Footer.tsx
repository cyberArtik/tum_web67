import { Link } from "react-router-dom";

const COLUMNS = [
  {
    title: "Shop",
    links: ["New arrivals", "Bestsellers", "Sale", "Gift cards"],
  },
  {
    title: "Help",
    links: ["Shipping", "Returns", "FAQ", "Contact"],
  },
  {
    title: "Company",
    links: ["About us", "Blog", "Careers", "Press"],
  },
];

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card py-12 pb-24 md:pb-12">
      <div className="container mx-auto grid grid-cols-2 gap-8 px-4 md:grid-cols-4">
        <div>
          <Link to="/" className="font-display text-xl font-bold text-primary">
            fun<span className="text-accent">kids</span>
          </Link>
          <p className="mt-3 font-body text-sm text-muted-foreground">
            Toys that spark imagination — for tiny hands and bigger dreams.
          </p>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h4 className="mb-3 font-display font-semibold text-foreground">{col.title}</h4>
            <ul className="space-y-2">
              {col.links.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="font-body text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="container mx-auto mt-10 border-t border-border px-4 pt-6 text-center">
        <p className="font-body text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} funkids. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
