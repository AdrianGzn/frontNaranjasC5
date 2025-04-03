import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { Dropdown } from 'primereact/dropdown';
import Esp32 from '../../domain/esp32.entity';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { useState } from 'react';

export default function TableViewEsps({ esps, handleDelete }: any) {
    const [layout, setLayout] = useState<'grid' | 'list'>('grid');

    const header = () => (
        <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
            <div className="w-full px-5 flex justify-between items-center gap-2">
                Listado de esps con su id
                <DataViewLayoutOptions
                    layout={layout}
                    onChange={(e) => setLayout(e.value as 'grid' | 'list')}
                />
            </div>
        </div>
    );

    const gridItem = (esp: Esp32) => (
        <div className="col-12 sm:col-6 lg:col-4 xl:col-3 p-2 flex">
            <Card className="border border-amber-200 shadow-md hover:shadow-lg transition-shadow w-full">
                <div className="flex flex-col h-full">
                    <div className="mb-3">
                        <h3 className="text-xl font-bold text-amber-800 mb-1">Id de la Esp: {esp.id || 'Id no encontrada'}</h3>
                    </div>
                    <div className="pt-3 mt-auto border-t border-amber-100">
                        <Button
                            label="Eliminar"
                            icon="pi pi-trash"
                            className="p-button-outlined w-full"
                            onClick={() => handleDelete(esp.id)}
                        />
                    </div>
                </div>
            </Card>
        </div>
    );

    const listItem = (esp: Esp32) => (
        <div className="col-12 p-2">
            <div className="flex flex-col md:flex-row border border-amber-200 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white p-4">
                <div className="flex-1">
                    <div className="flex flex-col md:flex-row gap-2 md:items-center justify-between">
                        <span className="text-sm text-amber-700">
                            <i className="pi pi-id-card mr-2"></i> Id de la Esp: {esp.id || 'Id no encontrada'}
                        </span>
                        <Button
                            label="Eliminar"
                            icon="pi pi-trash"
                            className="p-button-outlined"
                            onClick={() => handleDelete(esp.id)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    const itemTemplate = (esp: Esp32, layoutType?: 'list' | 'grid') => {
        if (!esp) return null;
        return layoutType === 'list' ? listItem(esp) : gridItem(esp);
    };

    return (
        <div className='w-[95%] mt-5'>
            <div className="bg-white shadow-md rounded-lg overflow-hidden p-5 max-h-[550px] overflow-y-auto">
                <DataView
                    value={esps}
                    header={header()}
                    itemTemplate={itemTemplate}
                    layout={layout}
                    paginator
                    rows={5}
                    emptyMessage="No se encontraron esps que coincidan"
                />
            </div>
        </div>
    );
    
}
