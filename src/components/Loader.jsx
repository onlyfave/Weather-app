import { motion } from "framer-motion";

export default function Loader() {
  return (
    <div className="flex justify-center items-center py-6">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1 }}
        className="w-10 h-10 border-4 rounded-full border-t-transparent border-blue-500"
      />
    </div>
  )
}
