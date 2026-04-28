import { motion } from "framer-motion";
import { Shield, HardDrive, Film, WifiOff } from "lucide-react";
import AnimatedPage from "../components/AnimatedPage";

export default function AboutPage() {
  return (
    <AnimatedPage>
      <div className="pt-24 pb-32 min-h-screen bg-gradient-to-b from-black to-zinc-900">
        <div className="max-w-4xl mx-auto px-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-bold mb-12 text-center"
          >
            Физические носители —<br />
            ваша свобода
          </motion.h1>

          {/* Книжная структура */}
          <div className="prose prose-invert max-w-none space-y-16">
            <Section>
              <h2 className="flex items-center gap-3 text-3xl font-bold">
                <Film className="w-8 h-8 text-red-500" />
                Почему не только стриминг?
              </h2>
              <p className="text-gray-300 leading-relaxed">
                Стриминговые сервисы удобны, но фильмы могут исчезнуть в любой
                момент. Лицензии заканчиваются, доступ блокируется, а интернет в
                поездке или на даче нестабилен. Физический носитель решает эти
                проблемы раз и навсегда.
              </p>
            </Section>

            <Section>
              <h2 className="flex items-center gap-3 text-3xl font-bold">
                <WifiOff className="w-8 h-8 text-red-500" />
                Автономность
              </h2>
              <p className="text-gray-300 leading-relaxed">
                USB‑флешка, SSD или HDD работают без интернета. В самолёте, в
                метро, в кемпинге — ваше кино всегда с вами. Не зависит от
                подписок и региональных ограничений.
              </p>
            </Section>

            <Section>
              <h2 className="flex items-center gap-3 text-3xl font-bold">
                <Shield className="w-8 h-8 text-red-500" />
                Надёжность и долговечность
              </h2>
              <p className="text-gray-300 leading-relaxed">
                Современные SSD служат десятилетиями. Flash‑память не боится
                вибраций. Ваша коллекция останется с вами даже через 20 лет. Это
                как домашняя библиотека, только для кино.
              </p>
            </Section>

            <Section>
              <h2 className="flex items-center gap-3 text-3xl font-bold">
                <HardDrive className="w-8 h-8 text-red-500" />
                Индивидуальный подход
              </h2>
              <p className="text-gray-300 leading-relaxed">
                Мы записываем только те фильмы, которые выберете вы. Качество
                видео, звуковые дорожки, субтитры — всё настраивается. Идеальная
                подборка для подарка или личного пользования.
              </p>
            </Section>

            <div className="text-center mt-16">
              <p className="text-gray-500 italic">
                «КонтентКонструктор» — ваш проводник в мир настоящих вещей.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
}

function Section({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
      className="bg-zinc-800/20 border border-white/5 rounded-3xl p-8 md:p-12"
    >
      {children}
    </motion.div>
  );
}
