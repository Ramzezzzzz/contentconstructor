import AnimatedPage from "../components/AnimatedPage";
import { Truck, Package, MapPin } from "lucide-react";

export default function DeliveryPage() {
  return (
    <AnimatedPage>
      <div className="pt-24 pb-32 min-h-screen bg-gradient-to-b from-black to-zinc-900">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl font-bold mb-8">Доставка и оплата</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-zinc-800/30 border border-white/10 rounded-xl">
              <Truck className="w-10 h-10 text-red-500 mb-4" />
              <h3 className="text-xl font-bold mb-2">Курьером</h3>
              <p className="text-gray-400">1-3 дня по городу</p>
            </div>
            <div className="p-6 bg-zinc-800/30 border border-white/10 rounded-xl">
              <Package className="w-10 h-10 text-red-500 mb-4" />
              <h3 className="text-xl font-bold mb-2">Почтой</h3>
              <p className="text-gray-400">5-14 дней по СНГ</p>
            </div>
            <div className="p-6 bg-zinc-800/30 border border-white/10 rounded-xl">
              <MapPin className="w-10 h-10 text-red-500 mb-4" />
              <h3 className="text-xl font-bold mb-2">Самовывоз</h3>
              <p className="text-gray-400">Из пункта выдачи</p>
            </div>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
}
