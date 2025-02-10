import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { Invoice } from "./types";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";


interface InvoiceDetailProps {
  invoice: Invoice;
}

export const InvoiceDetail = ({ invoice }: InvoiceDetailProps) => {
  const { factura_json } = invoice;

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-8">
      {/* Encabezado */}
      <Card className="p-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">{factura_json.documentInfo.commercialName}</h2>
            <div className="space-y-2 text-sm text-gray-600">
              <p>RUC: {factura_json.documentInfo.rucBusiness}</p>
              <p>Dirección: {factura_json.documentInfo.businessAddress}</p>
              <p>Establecimiento: {factura_json.documentInfo.establishment}</p>
            </div>
          </div>
          <div className="text-right space-y-2">
            <p className="text-sm text-gray-600">Factura N°</p>
            <p className="text-xl font-medium">{factura_json.documentInfo.sequential}</p>
            <p className="text-sm text-gray-600">Fecha de emisión</p>
            <p className="font-medium">
              {format(invoice.fecha_emision, "dd/MM/yyyy")}
            </p>
          </div>
        </div>
      </Card>

      {/* Información del Cliente */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Información del Cliente</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Nombre:</p>
            <p className="font-medium">{factura_json.customer.customerName}</p>
          </div>
          <div>
            <p className="text-gray-600">Identificación:</p>
            <p className="font-medium">{factura_json.customer.customerDni}</p>
          </div>
          <div className="col-span-2">
            <p className="text-gray-600">Dirección:</p>
            <p className="font-medium">{factura_json.customer.customerAddress}</p>
          </div>
        </div>
      </Card>

      {/* Detalles de la Factura */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Detalles de la Factura</h3>
        <ScrollArea className="h-[400px] rounded-md border">
          <div className="p-4">
            <table className="w-full">
              <thead className="text-sm text-gray-700">
                <tr>
                  <th className="text-left p-2">Código</th>
                  <th className="text-left p-2">Descripción</th>
                  <th className="text-right p-2">Cantidad</th>
                  <th className="text-right p-2">Precio</th>
                  <th className="text-right p-2">Descuento</th>
                  <th className="text-right p-2">Subtotal</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {factura_json.details.map((detail, index) => (
                  <tr key={index} className="border-t">
                    <td className="p-2">{detail.productCode}</td>
                    <td className="p-2">{detail.description}</td>
                    <td className="text-right p-2">{detail.quantity}</td>
                    <td className="text-right p-2">${detail.price}</td>
                    <td className="text-right p-2">${detail.discount}</td>
                    <td className="text-right p-2">${detail.subTotal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ScrollArea>
      </Card>

      {/* Totales */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Resumen de Pago</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal sin impuestos:</span>
            <span className="font-medium">${factura_json.payment.totalWithoutTaxes}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Descuento total:</span>
            <span className="font-medium">${factura_json.payment.totalDiscount}</span>
          </div>
          <Separator className="my-2" />
          {factura_json.totalsWithTax.map((tax, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span className="text-gray-600">
                IVA {tax.percentageCode}%:
              </span>
              <span className="font-medium">${tax.taxValue}</span>
            </div>
          ))}
          <Separator className="my-2" />
          <div className="flex justify-between text-base font-semibold">
            <span>Total a pagar:</span>
            <span>${factura_json.payment.totalAmount}</span>
          </div>
        </div>
      </Card>

      {/* Información Adicional */}
      {factura_json.additionalInfo.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Información Adicional</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {factura_json.additionalInfo.map((info, index) => (
              <div key={index}>
                <p className="text-gray-600">{info.name}:</p>
                <p className="font-medium">{info.value}</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};