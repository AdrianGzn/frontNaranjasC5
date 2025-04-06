import { Button } from 'primereact/button';
import { AutoComplete } from 'primereact/autocomplete';
import { useState } from 'react';
import { User } from '../../../users/domain/user.entity';
import Esp32 from '../../../esp32/domain/esp32.entity';

interface CajasCargarProps {
    onCreate: (id: number | undefined) => void;
    onStop: (id: number | undefined) => void;
    suggestions: User[];
    esp32: Esp32[];
}

export default function CajasCargar({ onCreate, onStop, suggestions, esp32 }: CajasCargarProps) {
    const [value, setValue] = useState('');
    const [items, setItems] = useState<User[]>([]);

    const search = (event: any) => {
        const filtered = suggestions.filter((item: User) =>
            item.name.toLowerCase().includes(event.query.toLowerCase())
        );
        setItems(filtered);
    };

    const handleCreate = (e: any) => {
        e.preventDefault();
        const id = items.find((item) => item.name === value)?.id;
        onCreate(id);
    };

    const handleStop = (e: any) => {
        e.preventDefault();
        const id = items.find((item) => item.name === value)?.id;
        onStop(id);
    };

    return (
        <form className="w-[95%] mt-5 flex flex-col bg-white p-5 rounded-xl shadow-md">
            <div className="mb-4">
                <AutoComplete
                    value={value}
                    suggestions={items.map(item => item.name)}
                    completeMethod={search}
                    onChange={(e) => setValue(e.value)}
                    style={{ maxHeight: '40px', width: '100%' }}
                    className="p-inputtext w-full"
                />
            </div>

            <div className="flex flex-wrap gap-4">
                {esp32.map((item: Esp32) => (
                    <div key={item.id} className="bg-gray-100 p-4 rounded-lg shadow flex flex-col items-center max-w-sm mx-auto">
                        <p className="text-gray-700 text-center">
                            <strong>ESP32:</strong> {item.id}
                            <br />
                            <strong>Jefe:</strong> {item.id_propietario}
                            <br />
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.status === 'activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                <span className={`w-2 h-2 mr-1 rounded-full ${item.status === 'activo' ? 'bg-green-400' : 'bg-red-400'
                                    }`}></span>
                                {item.status || 'Desconocido'}
                            </span>
                        </p>

                        <div className="mt-2 flex gap-1 justify-center">
                            <Button
                                type="button"
                                className="p-button-success p-button-sm"
                                onClick={handleCreate}
                                disabled={item.status !== 'activo'} // Deshabilitar si no está activo
                            >
                                Cargar naranjas
                            </Button>
                            <Button
                                type="button"
                                className="p-button-danger p-button-sm"
                                onClick={handleStop}
                                disabled={item.status !== 'activo'} // Deshabilitar si no está activo
                            >
                                Finalizar carga
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </form>
    );
}
