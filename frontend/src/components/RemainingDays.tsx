import React from "react";

const RemainingDays: React.FC<{ finishDate: string }> = ({ finishDate }) => {
  const calculateRemainingDays = () => {
    const today = new Date();
    const finish = new Date(finishDate);

    const diffTime = finish.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  };

  const remainingDays = calculateRemainingDays();
  const isOverdue = remainingDays < 0;
  const daysColor = isOverdue ? "text-red-500" : "text-blue-500";

  return (
    <>
      {isOverdue ? (
        <>
          期間過ぎ:
          <span className={`${daysColor}`}>{Math.abs(remainingDays)}</span>日
        </>
      ) : (
        <>
          残り期間: <span className={`${daysColor}`}>{remainingDays}</span>日
        </>
      )}
    </>
  );
};

export default RemainingDays;
