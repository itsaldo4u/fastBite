import { Shield, Lock, UserCheck, FileText, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-6 text-gray-300 hover:text-yellow-400 transition-all duration-300 hover:gap-3"
        >
          <ArrowLeft size={20} />
          <span className="text-sm sm:text-base">Kthehu mbrapa</span>
        </button>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-yellow-500/10 to-purple-500/10 p-6 sm:p-10 text-center border-b border-white/10">
            <div className="flex justify-center mb-4">
              <div className="bg-yellow-400/10 p-4 rounded-2xl">
                <Shield className="w-12 h-12 sm:w-14 sm:h-14 text-yellow-400 drop-shadow-xl" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-3">
              Politika e Privatësisë
            </h1>
            <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              Siguria e të dhënave tuaja është prioriteti ynë. Më poshtë mund të
              lexoni mënyrën se si FastBite mbledh, ruan dhe përdor
              informacionin tuaj.
            </p>
          </div>

          {/* Sections */}
          <div className="p-6 sm:p-10 space-y-8">
            {/* 1 */}
            <section className="bg-white/5 rounded-xl p-5 sm:p-6 border border-white/5 hover:border-yellow-400/30 transition-all duration-300">
              <div className="flex items-start gap-3 mb-4">
                <div className="bg-yellow-400/10 p-2 rounded-lg shrink-0">
                  <UserCheck className="text-yellow-400 w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold">
                  Të dhënat që mbledhim
                </h2>
              </div>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-3">
                Ne mbledhim vetëm të dhënat që nevojiten për funksionimin e
                shërbimit:
              </p>
              <ul className="space-y-2 text-gray-300 text-sm sm:text-base">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400 mt-1">•</span>
                  <span>Emri dhe mbiemri</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400 mt-1">•</span>
                  <span>Numri i telefonit</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400 mt-1">•</span>
                  <span>Adresa e email-it</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400 mt-1">•</span>
                  <span>Adresa e dërgesës</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400 mt-1">•</span>
                  <span>Historiku i porosive</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400 mt-1">•</span>
                  <span>Preferencat e kuponave dhe shpërblimeve</span>
                </li>
              </ul>
            </section>

            {/* 2 */}
            <section className="bg-white/5 rounded-xl p-5 sm:p-6 border border-white/5 hover:border-yellow-400/30 transition-all duration-300">
              <div className="flex items-start gap-3 mb-4">
                <div className="bg-yellow-400/10 p-2 rounded-lg shrink-0">
                  <Lock className="text-yellow-400 w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold">
                  Si i përdorim të dhënat tuaja
                </h2>
              </div>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-3">
                Të dhënat tuaja përdoren për:
              </p>
              <ul className="space-y-2 text-gray-300 text-sm sm:text-base">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400 mt-1">•</span>
                  <span>Përpunimin e porosive dhe komunikimin me ju</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400 mt-1">•</span>
                  <span>Personalizimin e ofertave dhe rekomandimeve</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400 mt-1">•</span>
                  <span>
                    Përmirësimin e shërbimit dhe përvojës së përdoruesit
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400 mt-1">•</span>
                  <span>Sigurinë e llogarisë dhe parandalimin e abuzimeve</span>
                </li>
              </ul>
            </section>

            {/* 3 */}
            <section className="bg-white/5 rounded-xl p-5 sm:p-6 border border-white/5 hover:border-yellow-400/30 transition-all duration-300">
              <div className="flex items-start gap-3 mb-4">
                <div className="bg-yellow-400/10 p-2 rounded-lg shrink-0">
                  <FileText className="text-yellow-400 w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold">
                  Si i ruajmë të dhënat tuaja
                </h2>
              </div>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-3">
                FastBite përdor standarde moderne sigurie:
              </p>
              <ul className="space-y-2 text-gray-300 text-sm sm:text-base">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400 mt-1">•</span>
                  <span>Ruajtje të enkriptuar të të dhënave</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400 mt-1">•</span>
                  <span>Transmetim i koduar (HTTPS)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400 mt-1">•</span>
                  <span>Qasje e kufizuar vetëm për personel të autorizuar</span>
                </li>
              </ul>
            </section>

            {/* 4 */}
            <section className="bg-white/5 rounded-xl p-5 sm:p-6 border border-white/5 hover:border-yellow-400/30 transition-all duration-300">
              <div className="flex items-start gap-3 mb-4">
                <div className="bg-yellow-400/10 p-2 rounded-lg shrink-0">
                  <Shield className="text-yellow-400 w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold">
                  Të drejtat tuaja
                </h2>
              </div>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-3">
                Ju keni të drejtë të:
              </p>
              <ul className="space-y-2 text-gray-300 text-sm sm:text-base">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400 mt-1">•</span>
                  <span>Kërkoni kopje të të dhënave tuaja</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400 mt-1">•</span>
                  <span>Korrigjoni ose azhurnoni informacionin tuaj</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400 mt-1">•</span>
                  <span>Kërkoni fshirjen e llogarisë</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400 mt-1">•</span>
                  <span>Ndërprisni komunikimet promocionale</span>
                </li>
              </ul>
            </section>

            {/* 5 */}
            <section className="bg-white/5 rounded-xl p-5 sm:p-6 border border-white/5 hover:border-yellow-400/30 transition-all duration-300">
              <div className="flex items-start gap-3 mb-4">
                <div className="bg-yellow-400/10 p-2 rounded-lg shrink-0">
                  <Lock className="text-yellow-400 w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold">Cookies</h2>
              </div>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                Ne përdorim cookies vetëm për funksione të nevojshme – login,
                shporta e blerjeve, preferencat e përdoruesit dhe statistika
                përmirësimi.
              </p>
            </section>
          </div>

          <div className="px-6 sm:px-10 pb-6 sm:pb-10">
            <p className="text-center text-gray-400 text-xs sm:text-sm">
              Përditësuar për herë të fundit: {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
