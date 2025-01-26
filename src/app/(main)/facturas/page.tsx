import FormularioFactura from "@/components/pages/facturas/formulario-factura";
import { getListAllUserByName } from "@/core/clientes";
import { getInformationCompany, getNumberInvoice, getPaymentMethods } from "@/core/servicios";

export  default async function Facturas() {

    const informationCompany = await getInformationCompany();

    const numberInvoice = await getNumberInvoice();

    const paymentMethods = await getPaymentMethods();

    if (!informationCompany.success || !numberInvoice.success || !paymentMethods.success) {
        return <div>Error al obtener los datos</div>
    }

    const clientes = await getListAllUserByName('');
    console.log(informationCompany)




    return (
        <div className="flex flex-col gap-4 px-20 py-9">
            <FormularioFactura informationCompany={informationCompany.data[0]} paymentMethods={paymentMethods.data} numberInvoice={numberInvoice.data} />
        </div>
    )
}