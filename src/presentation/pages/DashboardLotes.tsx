import React, { useEffect, useState, useRef } from 'react';
import { Chart } from 'primereact/chart';
import { Card } from 'primereact/card';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import Dashboard from '../../shared/ui/pages/dashboard.component';
import { AuthService } from '../../shared/hooks/auth_user.service';
import useGetLotesDetailsByUserID from '../../features/lote/infrastructure/get_lotes_details_by_user.controller';
import { LoteDetailsResponse } from '../../features/lote/domain/LoteDetailsResponse';
import Caja from '../../features/caja/domain/caja.entity';

export default function DashboardLotes() {
    const { lotesDetails, loading, error, getLotesDetailsByUserID } = useGetLotesDetailsByUserID();
    const toast = useRef<Toast>(null);

    // Estados para los gráficos
    const [tipoNaranjaChart, setTipoNaranjaChart] = useState<any>(null);
    const [produccionPorTiempoChart, setProduccionPorTiempoChart] = useState<any>(null);
    const [pesoPromedioChart, setPesoPromedioChart] = useState<any>(null);
    const [estadisticasGenerales, setEstadisticasGenerales] = useState({
        totalLotes: 0,
        totalCajas: 0,
        totalNaranjas: 0,
        pesoTotal: 0
    });

    // Estados para filtros
    const [rangoFechas, setRangoFechas] = useState<Date[]>([]);
    const [tipoFiltro, setTipoFiltro] = useState<string>('todos');

    useEffect(() => {
        const userId = AuthService.getUserData()?.id;
        if (userId) {
            getLotesDetailsByUserID(userId);
        } else {
            // Manejar caso sin usuario autenticado
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Usuario no autenticado',
                life: 3000
            });
        }
    }, []);

    // Procesar datos cuando se cargan
    useEffect(() => {
        if (lotesDetails && lotesDetails.length > 0) {
            procesarDatos(lotesDetails);
        }
    }, [lotesDetails]);

    const procesarDatos = (datos: LoteDetailsResponse[]) => {
        // Calcular estadísticas generales
        let totalCajas = 0;
        let totalNaranjas = 0;
        let pesoTotal = 0;

        datos.forEach(lote => {
            if (lote.cajas) {
                totalCajas += lote.cajas.length;
                lote.cajas.forEach(caja => {
                    totalNaranjas += caja.cantidad || 0;
                    pesoTotal += caja.peso_total || 0;
                });
            }
        });

        setEstadisticasGenerales({
            totalLotes: datos.length,
            totalCajas,
            totalNaranjas,
            pesoTotal
        });

        generarGraficoTipoNaranja(datos);
        generarGraficoProduccionPorTiempo(datos);
        generarGraficoPesoPromedio(datos);
    };

    const generarGraficoTipoNaranja = (datos: LoteDetailsResponse[]) => {
        // Contar cajas por tipo
        let naranja = 0;
        let verde = 0;
        let maduracion = 0;

        datos.forEach(lote => {
            lote.cajas.forEach(caja => {
                if (caja.descripcion === 'naranja') naranja += caja.cantidad || 0;
                else if (caja.descripcion === 'verde') verde += caja.cantidad || 0;
                else if (caja.descripcion === 'maduracion') maduracion += caja.cantidad || 0;
            });
        });

        const data = {
            labels: ['Naranja', 'Verde', 'Maduración'],
            datasets: [
                {
                    data: [naranja, verde, maduracion],
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
                    text: 'Distribución por Tipo de Naranja',
                    font: {
                        size: 16
                    }
                }
            }
        };

        setTipoNaranjaChart({ data, options });
    };

    const generarGraficoProduccionPorTiempo = (datos: LoteDetailsResponse[]) => {
        // Agrupar producción por mes
        const produccionPorMes: { [key: string]: number } = {};

        datos.forEach(lote => {
            const fecha = new Date(lote.lote.fecha);
            const mes = fecha.toLocaleString('default', { month: 'long', year: 'numeric' });

            if (!produccionPorMes[mes]) {
                produccionPorMes[mes] = 0;
            }

            lote.cajas.forEach(caja => {
                produccionPorMes[mes] += caja.cantidad || 0;
            });
        });

        const meses = Object.keys(produccionPorMes);
        const cantidades = meses.map(mes => produccionPorMes[mes]);

        const data = {
            labels: meses,
            datasets: [
                {
                    label: 'Cantidad de Naranjas',
                    data: cantidades,
                    fill: false,
                    borderColor: '#FFA726',
                    tension: 0.4,
                    backgroundColor: 'rgba(255, 167, 38, 0.2)'
                }
            ]
        };

        const options = {
            maintainAspectRatio: false,
            aspectRatio: 0.6,
            plugins: {
                legend: {
                    labels: {
                        color: '#495057'
                    }
                },
                title: {
                    display: true,
                    text: 'Producción por Período',
                    font: {
                        size: 16
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                },
                y: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                }
            }
        };

        setProduccionPorTiempoChart({ data, options });
    };

    const generarGraficoPesoPromedio = (datos: LoteDetailsResponse[]) => {
        // Calcular peso promedio por tipo de naranja
        let cajasTipoNaranja = 0;
        let cajasTipoVerde = 0;
        let cajasTipoMaduracion = 0;

        let pesoTotalNaranja = 0;
        let pesoTotalVerde = 0;
        let pesoTotalMaduracion = 0;

        datos.forEach(lote => {
            lote.cajas.forEach(caja => {
                if (caja.descripcion === 'naranja') {
                    cajasTipoNaranja++;
                    pesoTotalNaranja += caja.peso_total || 0;
                } else if (caja.descripcion === 'verde') {
                    cajasTipoVerde++;
                    pesoTotalVerde += caja.peso_total || 0;
                } else if (caja.descripcion === 'maduracion') {
                    cajasTipoMaduracion++;
                    pesoTotalMaduracion += caja.peso_total || 0;
                }
            });
        });

        const promedioNaranja = cajasTipoNaranja ? (pesoTotalNaranja / cajasTipoNaranja) / 1000 : 0;
        const promedioVerde = cajasTipoVerde ? (pesoTotalVerde / cajasTipoVerde) / 1000 : 0;
        const promedioMaduracion = cajasTipoMaduracion ? (pesoTotalMaduracion / cajasTipoMaduracion) / 1000 : 0;

        const data = {
            labels: ['Naranja', 'Verde', 'Maduración'],
            datasets: [
                {
                    label: 'Peso Promedio (kg)',
                    data: [promedioNaranja, promedioVerde, promedioMaduracion],
                    backgroundColor: ['rgba(255, 152, 0, 0.7)', 'rgba(76, 175, 80, 0.7)', 'rgba(244, 67, 54, 0.7)'],
                    borderColor: ['#FF9800', '#4CAF50', '#F44336'],
                    borderWidth: 1
                }
            ]
        };

        const options = {
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
                legend: {
                    labels: {
                        color: '#495057'
                    }
                },
                title: {
                    display: true,
                    text: 'Peso Promedio por Tipo de Naranja (kg)',
                    font: {
                        size: 16
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                },
                x: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                }
            }
        };

        setPesoPromedioChart({ data, options });
    };

    // Formatear números para mostrar separadores de miles
    const formatNumber = (num: number) => {
        return num.toLocaleString('es-MX');
    };

    // Formatear peso para mostrar en kg
    const formatWeight = (weight: number) => {
        const kg = weight / 1000;
        return `${kg.toLocaleString('es-MX', { maximumFractionDigits: 2 })} kg`;
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

    return (
        <Dashboard>
            <div className="p-4">
                <Toast ref={toast} />

                <div className="mb-4">
                    <h2 className="text-2xl font-semibold text-amber-800">Dashboard General de Producción</h2>
                    <p className="text-amber-700">Análisis global de todos los lotes y cajas registrados</p>
                </div>

                {/* Tarjetas de estadísticas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <Card className="border border-amber-200 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="bg-amber-100 p-3 rounded-lg">
                                <i className="pi pi-map text-amber-600 text-xl"></i>
                            </div>
                            <div>
                                <p className="text-amber-700">Total Lotes</p>
                                <p className="text-2xl font-bold text-amber-800">{formatNumber(estadisticasGenerales.totalLotes)}</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="border border-amber-200 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="bg-amber-100 p-3 rounded-lg">
                                <i className="pi pi-box text-amber-600 text-xl"></i>
                            </div>
                            <div>
                                <p className="text-amber-700">Total Cajas</p>
                                <p className="text-2xl font-bold text-amber-800">{formatNumber(estadisticasGenerales.totalCajas)}</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="border border-amber-200 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="bg-amber-100 p-3 rounded-lg">
                                <i className="pi pi-th-large text-amber-600 text-xl"></i>
                            </div>
                            <div>
                                <p className="text-amber-700">Total Naranjas</p>
                                <p className="text-2xl font-bold text-amber-800">{formatNumber(estadisticasGenerales.totalNaranjas)}</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="border border-amber-200 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="bg-amber-100 p-3 rounded-lg">
                                <i className="pi pi-chart-bar text-amber-600 text-xl"></i>
                            </div>
                            <div>
                                <p className="text-amber-700">Peso Total</p>
                                <p className="text-2xl font-bold text-amber-800">{formatWeight(estadisticasGenerales.pesoTotal)}</p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Gráficos */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Gráfico de distribución por tipo */}
                    <Card className="border border-amber-200 shadow-md">
                        <h3 className="text-xl font-semibold text-amber-800 mb-4">Distribución por Tipo</h3>
                        {tipoNaranjaChart && (
                            <div className="flex justify-center">
                                <Chart type="pie" data={tipoNaranjaChart.data} options={tipoNaranjaChart.options} style={{ width: '100%', maxWidth: '400px' }} />
                            </div>
                        )}
                    </Card>

                    {/* Gráfico de peso promedio */}
                    <Card className="border border-amber-200 shadow-md">
                        <h3 className="text-xl font-semibold text-amber-800 mb-4">Peso Promedio por Tipo</h3>
                        {pesoPromedioChart && (
                            <div className="h-80">
                                <Chart type="bar" data={pesoPromedioChart.data} options={pesoPromedioChart.options} />
                            </div>
                        )}
                    </Card>
                </div>

                {/* Gráfico de producción por tiempo */}
                <div className="mt-6">
                    <Card className="border border-amber-200 shadow-md">
                        <h3 className="text-xl font-semibold text-amber-800 mb-4">Evolución de la Producción</h3>
                        {produccionPorTiempoChart && (
                            <div className="h-96">
                                <Chart type="line" data={produccionPorTiempoChart.data} options={produccionPorTiempoChart.options} />
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </Dashboard>
    );
}