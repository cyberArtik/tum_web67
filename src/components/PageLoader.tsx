const PageLoader = () => (
  <div className="flex min-h-[40vh] items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-primary border-t-transparent" />
      <p className="font-body text-sm text-muted-foreground">Loading...</p>
    </div>
  </div>
);

export default PageLoader;
