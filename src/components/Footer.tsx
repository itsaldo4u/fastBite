export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-6">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} FastFoodPiceri. Të gjitha të drejtat
          e rezervuara.
        </p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <a href="/track-order" className="hover:text-red-500 transition">
            Gjurmo Porosine !
          </a>
          <a href="/privacy" className="hover:text-red-500 transition">
            Politika e Privatësisë
          </a>
          <a
            href="mailto:contact@fastfoodpiceri.com"
            className="hover:text-red-500 transition"
          >
            Kontakt
          </a>
        </div>
      </div>
    </footer>
  );
}
