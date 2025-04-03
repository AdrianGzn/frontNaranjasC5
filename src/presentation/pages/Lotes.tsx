import React, { useState, useRef, useEffect } from 'react';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Card } from 'primereact/card';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';
import Dashboard from '../../shared/ui/pages/dashboard.component';
import Lote from '../../features/lote/domain/lote.entity';
import ILote from '../../features/lote/domain/lote.repository';
import APIRepositoryLote from '../../features/lote/infrastructure/apiLote.repository';
import useGetLotes from '../../features/lote/infrastructure/consult_lotes.controller';
import { CreateLote } from '../../features/lote/application/create_lote.usecase';
import { AuthService } from '../../shared/hooks/auth_user.service';
import useGetEspsId from '../../features/esp32/infrastructure/getEsp32IdController';
import Esp32 from '../../features/esp32/domain/esp32.entity';
import { CreateLoteRequest } from '../../features/lote/domain/CreateLoteRequest';
import { useNavigate } from 'react-router-dom';

export default function Lotes() {
    const navigate = useNavigate();
    const { consultLotes, lotes: lotesOriginales, error } = useGetLotes(AuthService.getUserData()?.id || 0);

    const [lotes, setLotes] = useState<Lote[]>([]);
    const [dialogVisible, setDialogVisible] = useState<boolean>(false);
    const [observaciones, setObservaciones] = useState<string>('');

    // Estado para ESP32
    const [selectedEsp32, setSelectedEsp32] = useState<Esp32 | null>(null);
    const [availableEsp32s, setAvailableEsp32s] = useState<Esp32[]>([]);

    // Obtener las ESP32 del usuario
    const { espsResult, loading: loadingEsps, error: errorEsps, consultEspsId } = useGetEspsId();

    useEffect(() => {
        consultLotes()
    }, [])
    // Sincronizar con datos del hook
    useEffect(() => {
        console.log("get lotes", lotesOriginales)
        setLotes(lotesOriginales || []);
    }, [lotesOriginales]);

    // Añadir useEffect para cargar ESP32s
    useEffect(() => {
        const userId = AuthService.getUserData()?.id;
        if (userId) {
            consultEspsId(userId);
        }
    }, []);

    // Actualizar lista de ESP32s disponibles
    useEffect(() => {
        if (espsResult && espsResult.length > 0) {
            setAvailableEsp32s(espsResult);
        }
    }, [espsResult]);

    // Crear un nuevo lote con el caso de uso y el repositorio
    const repository: ILote = new APIRepositoryLote();
    const createLoteUsecase = new CreateLote(repository);

    const [layout, setLayout] = useState<'grid' | 'list'>('grid');
    const [sortKey, setSortKey] = useState('');
    const [sortOrder, setSortOrder] = useState(1);
    const [sortField, setSortField] = useState('');
    const [filterValue, setFilterValue] = useState('');
    const toast = useRef<Toast>(null);

    const sortOptions = [
        { label: 'Más recientes', value: '!fecha' },
        { label: 'Más antiguos', value: 'fecha' },
        { label: 'ID (mayor-menor)', value: '!id' },
        { label: 'ID (menor-mayor)', value: 'id' }
    ];

    const openNewLoteDialog = () => {
        setObservaciones('');
        setDialogVisible(true);
    };

    const handleCreateLote = async () => {
        const user = AuthService.getUserData();
        if (!user) {
            showToast('error', 'Error', 'Usuario no encontrado');
            return;
        }

        if (!selectedEsp32) {
            showToast('error', 'Error', 'Debe seleccionar un dispositivo ESP32');
            return;
        }

        try {
            // Crear la estructura de solicitud según CreateLoteRequest
            const loteRequest: CreateLoteRequest = {
                lote: {
                    observaciones: observaciones,
                    user_id: user.id
                },
                esp32_fk: selectedEsp32.id
            };

            // Enviar solicitud al repositorio
            const response = await repository.Create(loteRequest);

            // Actualizar estado local con el nuevo lote
            setLotes(prevLotes => [...prevLotes, response.lote]);

            // Cerrar el diálogo y limpiar selección
            setDialogVisible(false);
            setSelectedEsp32(null);
            setObservaciones('');

            showToast('success', 'Éxito', `Lote #${response.lote.id} creado exitosamente con ${response.cajas.length} cajas`);
        } catch (error: any) {
            showToast('error', 'Error', error.message || 'Error al crear el lote');
        }
    };

    const onSortChange = (event: any) => {
        const value = event.value;
        setSortKey(value);

        if (value.startsWith('!')) {
            setSortOrder(-1);
            setSortField(value.substring(1));
        } else {
            setSortOrder(1);
            setSortField(value);
        }
    };

    const showToast = (severity: 'success' | 'error' | 'info', summary: string, detail: string) => {
        toast.current?.show({ severity, summary, detail, life: 3000 });
    };

    const handleViewDetails = (lote: Lote) => {
        navigate(`/lotes/detalle/${lote.id}`);
    };

    // Header para el DataView
    const header = () => {
        return (
            <div className="flex flex-wrap justify-between items-center gap-2">
                <div className="flex flex-1 md:flex-none items-center">
                    <span className="p-input-icon-left w-full md:w-auto">
                        <i className="pi pi-search" />
                        <InputText
                            value={filterValue}
                            onChange={(e) => setFilterValue(e.target.value)}
                            placeholder="Buscar por ID..."
                            className="w-full"
                        />
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <Dropdown
                        options={sortOptions}
                        value={sortKey}
                        placeholder="Ordenar por"
                        onChange={onSortChange}
                        className="w-48"
                    />
                    <DataViewLayoutOptions
                        layout={layout}
                        onChange={(e) => setLayout(e.value as 'grid' | 'list')}
                    />
                </div>
            </div>
        );
    };

    // Formatear fecha
    const formatDate = (dateString: string | Date) => {
        if (!dateString) return 'Fecha no disponible';
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    // Renderizar un lote en vista de grid
    const gridItem = (lote: Lote) => {
        return (
            <div className="col-12 sm:col-6 lg:col-4 xl:col-3 p-2 flex">
                <Card className="border border-amber-200 shadow-md hover:shadow-lg transition-shadow w-full">
                    <div className="flex flex-col h-full">
                        <div className="mb-3">
                            <div className="bg-gradient-to-r from-amber-500 to-amber-400 h-32 rounded-lg mb-3 flex items-center justify-center">
                                <i className="pi pi-map text-white text-5xl"></i>
                            </div>
                            <div className="flex justify-between items-start">
                                <h3 className="text-xl font-bold text-amber-800 mb-1">Lote #{lote.id}</h3>
                            </div>
                        </div>

                        <div className="flex-grow">
                            <div className="bg-amber-50 p-3 rounded mb-3">
                                <p className="text-sm text-amber-600">Fecha</p>
                                <p className="font-semibold">{formatDate(lote.fecha)}</p>
                            </div>

                            <div className="bg-amber-50 p-3 rounded mb-3">
                                <p className="text-sm text-amber-600">Observaciones</p>
                                <p className="font-semibold">{lote.observaciones || 'Sin observaciones'}</p>
                            </div>
                        </div>

                        <div className="pt-3 mt-auto border-t border-amber-100">
                            <Button
                                label="Ver Detalles"
                                icon="pi pi-eye"
                                className="p-button-outlined w-full"
                                onClick={() => handleViewDetails(lote)}
                            />
                        </div>
                    </div>
                </Card>
            </div>
        );
    };

    // Renderizar un lote en vista de lista
    const listItem = (lote: Lote) => {
        return (
            <div className="col-12 p-2">
                <div className="flex flex-col md:flex-row border border-amber-200 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white p-4">
                    <div className="md:w-16 md:h-16 w-full h-32 flex items-center justify-center bg-gradient-to-r from-amber-500 to-amber-400 rounded-lg mb-3 md:mb-0 md:mr-4">
                        <i className="pi pi-map text-white text-3xl"></i>
                    </div>

                    <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-amber-800 mb-1">Lote #{lote.id}</h3>
                                <p className="text-amber-700 mb-2">
                                    <i className="pi pi-calendar mr-2"></i>{formatDate(lote.fecha)}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-2 md:items-center justify-between">
                            <div className="flex flex-wrap gap-2">
                                <span className="text-sm text-amber-700">
                                    <i className="pi pi-comment mr-2"></i>
                                    Observaciones: {lote.observaciones || 'Sin observaciones'}
                                </span>
                            </div>

                            <Button
                                label="Ver Detalles"
                                icon="pi pi-eye"
                                className="p-button-outlined"
                                onClick={() => handleViewDetails(lote)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Función para renderizar los elementos según el layout
    const itemTemplate = (lote: Lote, layout?: 'list' | 'grid' | (string & Record<string, unknown>)) => {
        if (!lote) {
            return null;
        }

        if (layout === 'list') {
            return listItem(lote);
        } else if (layout === 'grid') {
            return gridItem(lote);
        }
        return null;
    };

    // Filtrar lotes por el valor de búsqueda
    const filteredLotes = lotes.filter(lote =>
        !filterValue ||
        lote.id.toString().includes(filterValue)
    );

    // Ordenar los lotes
    const sortedLotes = [...filteredLotes].sort((a, b) => {
        let valueA = a[sortField as keyof Lote];
        let valueB = b[sortField as keyof Lote];

        // Manejar diferentes tipos de datos
        if (sortField === 'fecha') {
            valueA = valueA ? new Date(valueA).getTime() : 0;
            valueB = valueB ? new Date(valueB).getTime() : 0;
        }

        return sortOrder * ((valueA > valueB) ? 1 : -1);
    });

    const dialogFooter = (
        <div>
            <Button
                label="Cancelar"
                icon="pi pi-times"
                onClick={() => setDialogVisible(false)}
                className="p-button-text"
            />
            <Button
                label="Crear Lote"
                icon="pi pi-check"
                onClick={handleCreateLote}
                autoFocus
            />
        </div>
    );

    return (
        <Dashboard>
            <div className="p-4">
                <Toast ref={toast} />

                <div className="mb-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-semibold text-amber-800">Visualización de Lotes</h2>
                        <Button
                            label="Nuevo Lote"
                            icon="pi pi-plus"
                            className="p-button"
                            onClick={openNewLoteDialog}
                        />
                    </div>
                    <p className="text-amber-700">Explora y visualiza todos los lotes registrados en el sistema</p>
                </div>

                {/* Stats summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-amber-200">
                        <div className="flex items-center gap-3">
                            <div className="bg-amber-100 p-3 rounded-lg">
                                <i className="pi pi-map text-amber-600 text-xl"></i>
                            </div>
                            <div>
                                <p className="text-amber-700">Total Lotes</p>
                                <p className="text-2xl font-bold text-amber-800">{lotes.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-sm border border-amber-200">
                        <div className="flex items-center gap-3">
                            <div className="bg-amber-100 p-3 rounded-lg">
                                <i className="pi pi-calendar text-amber-600 text-xl"></i>
                            </div>
                            <div>
                                <p className="text-amber-700">Último Lote</p>
                                <p className="text-lg font-bold text-amber-800">
                                    {lotes.length > 0 ? `#${lotes[lotes.length - 1].id}` : 'N/A'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-sm border border-amber-200">
                        <div className="flex items-center gap-3">
                            <div className="bg-amber-100 p-3 rounded-lg">
                                <i className="pi pi-calendar-plus text-amber-600 text-xl"></i>
                            </div>
                            <div>
                                <p className="text-amber-700">Lote más reciente</p>
                                <p className="text-lg font-bold text-amber-800">
                                    {lotes.length > 0
                                        ? formatDate(
                                            lotes.reduce((newest, lote) => {
                                                const currentDate = new Date(lote.fecha).getTime();
                                                const newestDate = new Date(newest.fecha).getTime();
                                                return currentDate > newestDate ? lote : newest;
                                            }, lotes[0]).fecha
                                        )
                                        : 'N/A'
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* DataView para visualización de lotes */}
                <div className="card">
                    <DataView
                        value={sortedLotes}
                        layout={layout}
                        header={header()}
                        itemTemplate={itemTemplate}
                        paginator
                        rows={9}
                        emptyMessage="No se encontraron lotes que coincidan con la búsqueda"
                        className="bg-white shadow-md rounded-lg overflow-hidden"
                    />
                </div>

                {/* Mostrar mensaje de error si existe */}
                {error && (
                    <div className="p-4 mt-4 bg-red-100 text-red-700 rounded-lg">
                        Error: {error}
                    </div>
                )}
            </div>

            <Dialog
                visible={dialogVisible}
                style={{ width: '450px' }}
                header="Crear Nuevo Lote"
                modal
                className="p-fluid"
                footer={dialogFooter}
                onHide={() => setDialogVisible(false)}
            >
                <div className="field mb-4">
                    <label htmlFor="esp32" className="font-medium text-amber-800 block mb-2">Dispositivo ESP32</label>
                    <Dropdown
                        id="esp32"
                        value={selectedEsp32}
                        options={availableEsp32s}
                        onChange={(e) => setSelectedEsp32(e.value)}
                        optionLabel="id"
                        placeholder="Seleccione un dispositivo ESP32"
                        className="w-full"
                        showClear
                        filter
                        required
                    />
                    {availableEsp32s.length === 0 && (
                        <small className="text-red-500 mt-1 block">
                            No hay dispositivos ESP32 disponibles. Por favor, registre uno primero.
                        </small>
                    )}
                </div>

                <div className="field">
                    <label htmlFor="observaciones" className="font-medium text-amber-800">Observaciones</label>
                    <InputTextarea
                        id="observaciones"
                        value={observaciones}
                        onChange={(e) => setObservaciones(e.target.value)}
                        rows={5}
                        autoFocus
                        placeholder="Ingrese sus observaciones sobre este lote..."
                        className="mt-2"
                    />
                </div>
            </Dialog>
        </Dashboard>
    );
}