"use client";

import { FC } from "react";

interface Milestone {
  title: string;
  status: string; // 'completed' or 'in-progress'
}

interface MilestoneProgressProps {
  milestones: Milestone[];
}

const MilestoneProgress: FC<MilestoneProgressProps> = ({ milestones }) => {
  // Calculate the number of completed milestones
  const completedMilestones = milestones.filter(
    (milestone) => milestone.status === "completed"
  ).length;

  // Calculate the percentage completion
  const totalMilestones = milestones.length;
  const percentageComplete = totalMilestones
    ? (completedMilestones / totalMilestones) * 100
    : 0;

  return (
    <div className="space-y-20 flex flex-col">
      <div className="relative pt-1">
        <div className="flex mb-1 items-center justify-between">
          <div className="text-sm">
            <span className="font-semibold">{completedMilestones}</span> out of{" "}
            <span className="font-semibold">{totalMilestones}</span> milestones
            completed
          </div>
          <span className="text-sm font-semibold">
            {Math.round(percentageComplete)}%
          </span>
        </div>
        <div className="flex mb-2 items-center justify-between">
          <div className="w-full bg-destructive shadow-inner  shadow-black  rounded-full  h-2.5">
            <div
              className="bg-confirm shadow-sm shadow-confirm h-2.5 rounded-full"
              style={{ width: `${percentageComplete}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MilestoneProgress;
