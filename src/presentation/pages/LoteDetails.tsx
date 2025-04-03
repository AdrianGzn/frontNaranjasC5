import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Chart } from 'primereact/chart';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import Dashboard from '../../shared/ui/pages/dashboard.component';
import useGetLoteDetails from '../../features/lote/infrastructure/get_lote_details.controller';
import { LoteDetailsResponse } from '../../features/lote/domain/LoteDetailsResponse';

export default function LoteDetails() {
    const { id } = useParams<{ id: string }>();
    const { loteDetails, loading, error, getLoteDetails } = useGetLoteDetails();
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});

    useEffect(() => {
        if (id) {
            getLoteDetails(parseInt(id));
        }
    }, [id]);

    useEffect(() => {
        if (loteDetails && loteDetails.cajas) {
            // Contar cajas por tipo
            const conteoTipos = {
                naranja: 0,
                verde: 0,
                maduracion: 0
            };

            loteDetails.cajas.forEach(caja => {
                if (caja.descripcion === 'naranja') conteoTipos.naranja += caja.cantidad;
                else if (caja.descripcion === 'verde') conteoTipos.verde += caja.cantidad;
                else if (caja.descripcion === 'maduracion') conteoTipos.maduracion += caja.cantidad;
            });

            // Datos para el gráfico
            const data = {
                labels: ['Naranja', 'Verde', 'Maduración'],
                datasets: [
                    {
                        data: [conteoTipos.naranja, conteoTipos.verde, conteoTipos.maduracion],
                        backgroundColor: ['#FF9800', '#4CAF50', '#F44336'],
                        hoverBackgroundColor: ['#FFB74D', '#81C784', '#E57373']
                    }
                ]
            };

            const options = {
                plugins: {
                    legend: {
                        labels: {
                            color: '#495057'
                        }
                    },
                    title: {
                        display: true,
                        text: 'Distribución de Naranjas por Tipo',
                        fontSize: 16
                    }
                }
            };

            setChartData(data);
            setChartOptions(options);
        }
    }, [loteDetails]);

    // Formatear fecha
    const formatDate = (dateString: string | Date) => {
        if (!dateString) return 'Fecha no disponible';
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    };

    const goBack = () => {
        window.history.back();
    };

    if (loading) {
        return (
            <Dashboard>
                <div className="flex justify-center items-center h-full">
                    <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="4" />
                </div>
            </Dashboard>
        );
    }

    if (error) {
        return (
            <Dashboard>
                <div className="p-4 mt-4 bg-red-100 text-red-700 rounded-lg">
                    Error: {error}
                </div>
            </Dashboard>
        );
    }

    if (!loteDetails) {
        return (
            <Dashboard>
                <div className="p-4 mt-4 bg-amber-100 text-amber-700 rounded-lg">
                    No se encontró el lote solicitado.
                </div>
            </Dashboard>
        );
    }

    return (
        <Dashboard>
            <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold text-amber-800">Detalles del Lote #{loteDetails.lote.id}</h2>
                    <Button label="Volver" icon="pi pi-arrow-left" className="p-button-outlined" onClick={goBack} />
                </div>

                {/* Información general del lote */}
                <Card className="mb-4 border border-amber-200">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <h3 className="text-lg font-semibold text-amber-700 mb-2">Fecha de Creación</h3>
                            <p>{formatDate(loteDetails.lote.fecha)}</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-amber-700 mb-2">Observaciones</h3>
                            <p className="whitespace-pre-line">{loteDetails.lote.observaciones || 'Sin observaciones'}</p>
                        </div>
                    </div>
                </Card>

                {/* Gráfico de distribución */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <Card className="border border-amber-200 h-full">
                        <h3 className="text-xl font-semibold text-amber-800 mb-4">Distribución de Naranjas</h3>
                        <div className="flex justify-center">
                            <Chart type="pie" data={chartData} options={chartOptions} style={{ width: '100%', maxWidth: '500px' }} />
                        </div>
                    </Card>

                    <Card className="border border-amber-200">
                        <h3 className="text-xl font-semibold text-amber-800 mb-4">Resumen de Cajas</h3>
                        <div className="overflow-y-auto max-h-96">
                            <table className="min-w-full">
                                <thead className="bg-amber-50">
                                    <tr>
                                        <th className="py-3 px-4 text-left text-amber-800">ID</th>
                                        <th className="py-3 px-4 text-left text-amber-800">Tipo</th>
                                        <th className="py-3 px-4 text-left text-amber-800">Cantidad</th>
                                        <th className="py-3 px-4 text-left text-amber-800">Peso</th>
                                        <th className="py-3 px-4 text-left text-amber-800">Estado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loteDetails.cajas.map(caja => (
                                        <tr key={caja.id} className="border-b border-amber-100">
                                            <td className="py-3 px-4">{caja.id}</td>
                                            <td className="py-3 px-4 capitalize">{caja.descripcion}</td>
                                            <td className="py-3 px-4">{caja.cantidad}</td>
                                            <td className="py-3 px-4">{caja.peso_total / 1000} kg</td>
                                            <td className="py-3 px-4 capitalize">{caja.estado}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            </div>
        </Dashboard>
    );
}