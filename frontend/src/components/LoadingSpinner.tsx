import { motion } from "framer-motion";

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center py-4">
      <motion.div
        className="h-7 w-7 rounded-full border-4 border-t-blue-600 border-gray-300"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      ></motion.div>
    </div>
  );
};

export default LoadingSpinner;
