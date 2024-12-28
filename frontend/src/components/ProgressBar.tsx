export const ProgressBar: React.FC<{ progress: number }> = ({ progress }) => {
  const progressColor = progress > 49 ? "bg-green-500" : "bg-red-500";
  return (
    <div className="w-full rounded-full h-2 dark:bg-gray-700 my-2">
      <div
        className={`${progressColor} h-1.5 rounded-full transition-all duration-500`}
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};
