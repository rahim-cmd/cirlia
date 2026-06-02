import Navbar from "../components/Navbar"
import GrainOverlay from "../components/GrainOverlay";
import FloatingShapes from "../components/FloatingShapes";
import CircleCursor from "../components/CircleCursor";

const MainLayout = ({ children }) => {
  return (
    <div className="relative overflow-hidden">

      {/* Background Blurs */}

      <div className="absolute top-[-200px] left-[-100px] w-[500px] h-[500px] bg-[#D8B4A0]/30 rounded-full blur-3xl"></div>

      <div className="absolute top-[40%] right-[-150px] w-[400px] h-[400px] bg-[#A8B5A2]/30 rounded-full blur-3xl"></div>

      <div className="absolute bottom-[-200px] left-[20%] w-[500px] h-[500px] bg-[#C98C72]/20 rounded-full blur-3xl"></div>
      <CircleCursor />
      <Navbar />
      <GrainOverlay />
      <FloatingShapes />
      <main className="relative z-10">
        {children}
      </main>

    </div>
  )
}

export default MainLayout