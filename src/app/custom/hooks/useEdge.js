export default function useEdge(sourceId, targetId) {
  return {
    id: `e${sourceId}-${targetId}`,
    source: sourceId.toString(),
    target: targetId.toString()
  };
}
