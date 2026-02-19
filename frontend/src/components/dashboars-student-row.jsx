const DashboardStudentRow = ({ item }) => {
  return (
    <>
      <td className="px-6 py-4 text-gray-800 font-medium">
        {item.std_class_id || item?.student_id}
      </td>
      <td className="px-6 py-4 text-gray-800">{item.fullname}</td>
      <td className="px-6 py-4 text-gray-600">{item.major}</td>
    </>
  );
};
export default DashboardStudentRow;
