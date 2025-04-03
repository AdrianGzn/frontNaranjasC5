import { Button } from 'primereact/button';
import { AutoComplete } from 'primereact/autocomplete';
import { useState } from 'react';
import { User } from '../../../users/domain/user.entity';
import Esp32 from '../../../esp32/domain/esp32.entity';
import useCreateLote from '../../../lote/infrastructure/create_lote.controller';
import Lote from '../../../lote/domain/lote.entity';

interface cajasCargar {
    onCreate: any
    onStop: any
    suggestions: any
    esp32: Esp32[]
}

export default function CajasCargar({ onCreate, onStop, suggestions, esp32 }: cajasCargar) {
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
        console.log(id);
        onStop(id);
    };

    return (
        <form className="w-[95%] h-[150px] mt-5 flex flex-wrap bg-white p-5 rounded-xl">
            <div className="w-[60%] h-full">
                <AutoComplete
                    value={value}
                    suggestions={items.map(item => item.name)}
                    completeMethod={search}
                    onChange={(e) => setValue(e.value)}
                    style={{ maxHeight: '40px' }}
                />
            </div>
            {
                esp32.map((item: Esp32) => (
                    <div className='w-[50%] h-[50%] flex justiffy-center items-center' key={item.id}>
                        <div className=''>
                            <p>
                                Numero de serie del esp32: {item.id}
                                Numero de serie del jefe: {item.id_propietario}
                            </p>
                        </div>
                        <div className="w-[40%] h-full flex items-center">
                            <Button type="button" onClick={handleCreate}>Cargar naranjas</Button>
                            <Button type="button" onClick={handleStop}>Finalizar carga</Button>
                        </div>
                    </div>
                ))
            }


        </form>
    );
}
