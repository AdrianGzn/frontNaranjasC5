import CardCaja from './cardCaja.component';

export default function AddCajas({cajas}: any) {
    return <div className="w-[95%] h-[260px] mt-5 flex flex-wrap justify-between bg-white p-5 rounded-xl">
        <div className='w-[27%] h-full p-5 bg-slate-100'>
            hola mundo
        </div>
        <div className='w-[70%] h-full flex flex-wrap justify-between'>
            <div className='w-full'>Hola mundo</div>
            <div className='w-full h-[80%] flex flex-wrap justify-between'>
                {cajas.map((item: any, index: number) => (
                    <CardCaja key={index} caja={item} />
                ))}
            </div>
        </div>
    </div>
}