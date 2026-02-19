import { Check } from "lucide-react";

const StdList = ({ data, setStudentData }) => {
  const onCheck = () => {
    const payload = {
      ...data,
      status: true,
      time: Date.now(),
    };

    setStudentData((prev) =>
      prev.filter((p) => p?.studentId !== data?.studentId)
    );
    setStudentData((prev) => [...prev, payload]);

    alert(`${data?.fullname} เช็คชื่อแล้ว`);
  };

  return (
    <div className="flex items-center w-full justify-between rounded-lg shadow-md p-2 bg-white">
      <span className="flex flex-col gap-0.5 text-sm">
        <p>{data?.fullname || "-"}</p>
        <p className="text-xs text-gray-700">{data?.studentId || "-"}</p>
        <p className="text-xs text-gray-700">
          สถานะ :{" "}
          {data?.status
            ? `เช็คชื่อแล้ว : ${new Date(data?.time)?.toLocaleTimeString(
                "th-TH"
              )}`
            : "ยังไม่เช็คชื่อ"}
        </p>
      </span>
      <button
        onClick={onCheck}
        disabled={data?.status}
        className={`rounded-md text-sm p-2 ${
          data?.status
            ? "bg-green-500 text-white"
            : "hover:text-white hover:bg-green-500"
        }  w-fit h-fit flex items-center gap-2 shadow-md bg-gray-100`}
      >
        {data?.status ? (
          "เช็คชื่อsแล้ว"
        ) : (
          <>
            <Check size={20} />
            <p>เข้าเรียน</p>
          </>
        )}
      </button>
    </div>
  );
};
export default StdList;
