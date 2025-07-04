import { CircleLoader } from "react-spinners";
export const Loading = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <p className="ml-4 text-lg">Loading App...</p>
      <CircleLoader
        color={"#10b981"}
        loading={true}
        size={50}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
};
