import AppShell from '@/components/AppShell';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ demo?: string }>;
}) {
  const { demo } = await searchParams;
  return <AppShell demo={demo === '1'} />;
}
