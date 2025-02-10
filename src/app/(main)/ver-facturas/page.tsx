import { TablaFacturas } from "@/components/pages/facturas/TablaFacturas";
import { fetchFacturas } from "@/core/facturas";

export default async function VerFacturasPage() {
  const facturas = await fetchFacturas();

  return (
    <div className="flex flex-col gap-4 mx-auto my-auto">
      <h1 className="text-2xl font-bold mx-auto ">Facturas emitidas</h1>
      <TablaFacturas data={facturas} />
    </div>
  );
}