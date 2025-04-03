import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import CardCaja from './cardCaja.component';

interface CajasCargandoProps {
    cajas: any[]; 
}

export default function CajasCargando({ cajas }: CajasCargandoProps) {
    return (
        <div className="w-[95%] h-[260px] mt-5 bg-white p-5 rounded-xl shadow-md">
            <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={20}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                autoplay={{ delay: 3000 }}
                loop
                className="w-full max-w-lg"
            >
                {cajas.map((item, index) => (
                    <SwiperSlide key={index} className="flex justify-center">
                        <CardCaja caja={item} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}
