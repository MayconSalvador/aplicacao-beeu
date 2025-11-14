export default function CoursePlanInfoDemoPage() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const CoursePlanInfo = require('../../components/course/CoursePlanInfo').default;

  const scenarios = [
    { title: 'Normal (emerald, sm)', props: { priceBr: 1200, durationMonths: 12 } },
    { title: 'Fallback meses (price=900, duration inválido)', props: { priceBr: 900, durationMonths: undefined } },
    { title: 'Compact', props: { priceBr: 1200, durationMonths: 12, compact: true } },
    { title: 'Tamanho md', props: { priceBr: 1200, durationMonths: 12, size: 'md' as const } },
    { title: 'Variant blue', props: { priceBr: 1200, durationMonths: 12, variant: 'blue' as const } },
    { title: 'Variant gray', props: { priceBr: 1200, durationMonths: 12, variant: 'gray' as const } },
    { title: 'Price string', props: { priceBr: '1999.90', durationMonths: 10 } },
    { title: 'Zero price', props: { priceBr: 0, durationMonths: 6 } },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Demo CoursePlanInfo</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {scenarios.map((s, idx) => (
          <div key={idx} className="border rounded p-4">
            <h3 className="font-semibold mb-2">{s.title}</h3>
            <CoursePlanInfo {...s.props} />
          </div>
        ))}
      </div>
    </div>
  );
}