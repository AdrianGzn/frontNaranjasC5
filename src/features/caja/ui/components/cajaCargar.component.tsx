import { Button } from 'primereact/button';
import { AutoComplete } from 'primereact/autocomplete';
import { useState } from 'react';
import { User } from '../../../users/domain/user.entity';

export default function CajasCargar({ onCreate, onStop, suggestions }: any) {
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
        console.log(id);
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
            <div className="w-[40%] h-full flex items-center">
                <Button type="button" onClick={handleCreate}>Cargar naranjas</Button>
                <Button type="button" onClick={handleStop}>Finalizar carga</Button>
            </div>
        </form>
    );
}
