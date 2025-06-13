const TodayPage = () => {
  return (
    <>
      <div className="flex flex-col gap-2 px-6 ">
        <h2 className="text-2xl">Today</h2>
        <h3>Capture now, plan later</h3>
        <p>
          Inbox is your go-to spot for quick task entry. Clear your mind now,
          organize when you’re ready.
        </p>
        <button className="w-22 h-8 bg-emerald-500 hover:bg-emerald-600 text-white rounded-md text-sm px-4">
          Add Task
        </button>
      </div>
    </>
  );
};

export default TodayPage;
