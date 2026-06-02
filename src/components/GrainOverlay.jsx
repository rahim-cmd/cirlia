const GrainOverlay = () => {
  return (
    <div
      className="fixed inset-0 pointer-events-none opacity-[0.035] z-[999]"
      style={{
        backgroundImage: `
          radial-gradient(circle at 20% 20%, black 1px, transparent 1px),
          radial-gradient(circle at 80% 80%, black 1px, transparent 1px),
          radial-gradient(circle at 40% 70%, black 1px, transparent 1px)
        `,
        backgroundSize: "120px 120px"
      }}
    />
  );
};

export default GrainOverlay;