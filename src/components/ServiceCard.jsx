import { useAnalytics } from '../hooks/useAnalytics';

const ServiceCard = ({ title, description, sector, icon: Icon, color, onSelect }) => {
  const { trackClick } = useAnalytics();

  const handleInterest = () => {
    trackClick('Ver_Detalles', sector); // Tracking silencioso
    onSelect(sector); // Abrir el modal
  };

  return (
    <div className="bg-[#1f2028] border border-[#2e303a] rounded-2xl p-6 hover:border-purple-500/50 transition-all group shadow-lg">
      <div className={`w-14 h-14 rounded-xl ${color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
        <Icon className="text-white" size={30} />
      </div>
      <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400 mb-6 text-sm leading-relaxed">{description}</p>
      <button 
        onClick={handleInterest}
        className="w-full py-3 rounded-lg bg-gray-800 text-white font-semibold hover:bg-purple-600 transition-colors"
      >
        Me interesa
      </button>
    </div>
  );
};

export default ServiceCard;