import { Leaf } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="loader">
        <Leaf className="w-12 h-12 animate-spin text-green-600" />
      </div>
    </div>
  );
}
