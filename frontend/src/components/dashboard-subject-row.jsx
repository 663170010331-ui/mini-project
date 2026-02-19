const DashboardSubjectRow = ({ item }) => {
  return (
    <>
      <td className="px-6 py-4 text-gray-800 font-medium">{item.course_id}</td>
      <td className="px-6 py-4 text-gray-800">{item.course_name}</td>

      <td className="px-6 py-4 text-gray-600">{item.teacher_name}</td>
    </>
  );
};
export default DashboardSubjectRow;
