import { FileX } from "lucide-react";

const NoData = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] text-muted-foreground">
      <FileX className="h-12 w-12 mb-4" />
      <p>No data found</p>
    </div>
  );
};

export default NoData;
