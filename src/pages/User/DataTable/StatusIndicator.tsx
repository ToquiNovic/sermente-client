import { Circle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { UserState } from "@/models";

const statusColors = {
  [UserState.ACTIVE]: "stroke-green-500",
  [UserState.INACTIVE]: "stroke-red-500",
  [UserState.SUSPENDED]: "stroke-orange-500",
};

const statusLabels = {
  [UserState.ACTIVE]: "Activo",
  [UserState.INACTIVE]: "Inactivo",
  [UserState.SUSPENDED]: "Suspendido",
};

const StatusIndicator = ({
  state,
}: {
  state: UserState;
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Circle className={`${statusColors[state]} text-lg transition-colors duration-300`} strokeWidth={2} />
        </TooltipTrigger>
        <TooltipContent>
          <p>{statusLabels[state]}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default StatusIndicator;
