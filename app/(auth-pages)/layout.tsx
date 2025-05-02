export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[calc(100vh-152px)] items-center justify-center w-full">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
