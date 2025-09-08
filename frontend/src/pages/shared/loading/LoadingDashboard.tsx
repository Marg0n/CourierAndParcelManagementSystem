const LoadingDashboard = () => {
  return (
    <div className="min-h-full bg-gradient-to-br from-sky-100 to-sky-300 flex flex-col items-center justify-center text-center px-4 animate-fadeIn">
      <div className="flex items-center justify-center mb-6">
        <div className="w-7 h-7 animate-[ping_2s_linear_infinite] rounded-full border-2 border-[#3b9df8] flex items-center justify-center">
          <div className="w-5 h-5 animate-[ping_2s_linear_3s_infinite] rounded-full border-2 border-[#3b9df8]"></div>
        </div>
      </div>
      <h2 className="text-3xl font-semibold text-sky-800 mb-2">
        Just a moment...
      </h2>
      <p className="text-gray-600 max-w-md">
        We're preparing your experience. Hang tight while we load everything for
        you!
      </p>
    </div>
  );
};

export default LoadingDashboard;
