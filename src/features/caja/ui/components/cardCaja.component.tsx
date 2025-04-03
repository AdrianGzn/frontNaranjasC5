import { Card } from 'primereact/card';
import Caja from '../../domain/caja.entity';

interface CardCajaProps {
    caja: Caja;
}

export default function CardCaja({caja}: CardCajaProps) {
    return <div className='w-[270px] h-full'>
    <Card title={caja.id}>
        <div className='flex flex-wrap justify-between'>
            <div className='w-full h-[30px] mb-2 bg-amber-500 rounded-sm text-white flex justify-center items-center'>
                Total: {caja.cantidad}
            </div>
            <div className='w-full h-[30px] bg-amber-500 rounded-sm text-white flex justify-center items-center'>
                Peso total: {caja.peso_total} kg
            </div>
        </div>
    </Card>
    </div>
}