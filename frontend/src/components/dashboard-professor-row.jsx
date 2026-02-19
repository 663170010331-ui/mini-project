const DashboardProfessorRow = ({ item }) => {
  return (
    <>

      <td className="px-6 py-4 text-gray-800 font-medium">{item.id}</td>
      <td className="px-6 py-4 text-gray-800">{item.fullname}</td>
      <td className="px-6 py-4 text-gray-600">{item.tel}</td>
    </>
  );
};
export default DashboardProfessorRow;
