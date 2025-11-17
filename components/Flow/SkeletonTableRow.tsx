const SkeletonTableRow = () => (
  <tr className="animate-pulse">
    {Array.from({ length: 10 }).map((_, i) => (
      <td key={i} className="px-3 py-2">
        <div className="h-3 w-full bg-gray-800 rounded" />
      </td>
    ))}
  </tr>
);
export default SkeletonTableRow;
