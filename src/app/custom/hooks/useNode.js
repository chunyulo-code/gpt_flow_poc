export default function useNode(id, title, parentNodeId, position) {
  return {
    id: id.toString(),
    data: title,
    parentNode: parentNodeId.toString(),
    position: {
      x: position.x,
      y: position.y
    }
    // style: { visibility: "visible" }
  };
}
