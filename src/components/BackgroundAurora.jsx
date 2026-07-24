export function BackgroundAurora() {
  return (
    <div className="fixed inset-0 z-[-10] overflow-hidden pointer-events-none bg-gray-900">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen animate-aurora-1" />
      <div className="absolute top-[20%] right-[-10%] w-[60%] h-[60%] bg-violet-600/20 rounded-full blur-[120px] mix-blend-screen animate-aurora-2" />
      <div className="absolute bottom-[-20%] left-[20%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px] mix-blend-screen animate-aurora-3" />
    </div>
  );
}
