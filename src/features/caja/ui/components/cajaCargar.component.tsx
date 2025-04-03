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
            {/* Input de búsqueda */}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {esp32.map((item: Esp32) => (
                    <div key={item.id} className="bg-gray-100 p-4 rounded-lg shadow flex flex-col justify-between">
                        <p className="text-gray-700">
                            <strong>ESP32:</strong> {item.id}
                            <br />
                            <strong>Jefe:</strong> {item.id_propietario}
                        </p>

                        <div className="mt-4 flex justify-between">
                            <Button type="button" className="p-button-success" onClick={handleCreate}>
                                Cargar naranjas
                            </Button>
                            <Button type="button" className="p-button-danger" onClick={handleStop}>
                                Finalizar carga
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </form>
    );
}
