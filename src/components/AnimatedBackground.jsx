export function AnimatedBackground() {
  return (
    <div className="fixed top-0 left-0 w-screen h-screen z-[-1] pointer-events-none overflow-hidden bg-[#0a0a0f]">
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/40 rounded-full blur-[120px] mix-blend-screen animate-orb-1" />
      <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-violet-600/40 rounded-full blur-[100px] mix-blend-screen animate-orb-2" />
      <div className="absolute bottom-[-10%] left-[10%] w-[550px] h-[550px] bg-blue-600/40 rounded-full blur-[130px] mix-blend-screen animate-orb-3" />
      <div className="absolute top-[30%] left-[40%] w-[600px] h-[600px] bg-purple-600/30 rounded-full blur-[150px] mix-blend-screen animate-orb-4" />
      <div className="absolute bottom-[10%] right-[10%] w-[450px] h-[450px] bg-fuchsia-600/30 rounded-full blur-[120px] mix-blend-screen animate-orb-5" />
    </div>
  );
}
