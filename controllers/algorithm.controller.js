const algorithmService = require('../services/algorithm.service');

const codeSnippets = {
  dijkstra: {
    python: `def dijkstra(graph, start, end):\n  distances = {n: float('inf') for n in graph}\n  distances[start] = 0\n  pq = [(0, start)]\n  while pq:\n    current_dist, current = heapq.heappop(pq)\n    if current == end: break\n    for neighbor, weight in graph[current]:\n      alt = current_dist + weight\n      if alt < distances[neighbor]:\n        distances[neighbor] = alt\n        heapq.heappush(pq, (alt, neighbor))\n  return distances`,
    java: `public void dijkstra(Graph graph, String start, String end) {\n  Map<String, Double> dist = new HashMap<>();\n  PriorityQueue<Node> pq = new PriorityQueue<>();\n  dist.put(start, 0.0);\n  pq.add(new Node(start, 0.0));\n  while (!pq.isEmpty()) {\n    Node current = pq.poll();\n    if (current.id.equals(end)) break;\n    for (Edge edge : graph.getNeighbors(current.id)) {\n      double alt = dist.get(current.id) + edge.weight;\n      if (alt < dist.getOrDefault(edge.to, Double.MAX_VALUE)) {\n        dist.put(edge.to, alt);\n        pq.add(new Node(edge.to, alt));\n      }\n    }\n  }\n}`,
    lua: `function dijkstra(graph, start, dest)\n  local dist = {}\n  local pq = MinHeap:new()\n  dist[start] = 0\n  pq:insert(start, 0)\n  while not pq:isEmpty() do\n    local current = pq:extractMin()\n    if current == dest then break end\n    for _, edge in ipairs(graph[current]) do\n      local alt = dist[current] + edge.weight\n      if alt < (dist[edge.to] or math.huge) then\n        dist[edge.to] = alt\n        pq:insert(edge.to, alt)\n      end\n    end\n  end\nend`,
    go: `func dijkstra(graph Graph, start string, end string) {\n  dist := make(map[string]float64)\n  pq := make(PriorityQueue, 0)\n  dist[start] = 0\n  heap.Push(&pq, &Item{value: start, priority: 0})\n  for pq.Len() > 0 {\n    current := heap.Pop(&pq).(*Item)\n    if current.value == end { break }\n    for _, edge := range graph[current.value] {\n      alt := dist[current.value] + edge.weight\n      if val, ok := dist[edge.to]; !ok || alt < val {\n        dist[edge.to] = alt\n        heap.Push(&pq, &Item{value: edge.to, priority: alt})\n      }\n    }\n  }\n}`
  },
  prim: {
    python: `def prim(graph, start):\n  mst = []\n  visited = set([start])\n  edges = [(weight, start, to) for to, weight in graph[start]]\n  heapq.heapify(edges)\n  while edges:\n    weight, frm, to = heapq.heappop(edges)\n    if to not in visited:\n      visited.add(to)\n      mst.append((frm, to, weight))\n      for next_to, next_weight in graph[to]:\n        if next_to not in visited:\n          heapq.heappush(edges, (next_weight, to, next_to))\n  return mst`,
    java: `public void prim(Graph graph, String start) {\n  Set<String> visited = new HashSet<>();\n  PriorityQueue<Edge> pq = new PriorityQueue<>();\n  visited.add(start);\n  pq.addAll(graph.getEdges(start));\n  while (!pq.isEmpty()) {\n    Edge edge = pq.poll();\n    if (visited.contains(edge.to)) continue;\n    visited.add(edge.to);\n    mst.add(edge);\n    for (Edge nextEdge : graph.getEdges(edge.to)) {\n      if (!visited.contains(nextEdge.to)) {\n        pq.add(nextEdge);\n      }\n    }\n  }\n}`,
    lua: `function prim(graph, start)\n  local visited = { [start] = true }\n  local pq = MinHeap:new()\n  for _, edge in ipairs(graph[start]) do pq:insert(edge, edge.weight) end\n  while not pq:isEmpty() do\n    local edge = pq:extractMin()\n    if not visited[edge.to] then\n      visited[edge.to] = true\n      table.insert(mst, edge)\n      for _, nextEdge in ipairs(graph[edge.to]) do\n        if not visited[nextEdge.to] then\n          pq:insert(nextEdge, nextEdge.weight)\n        end\n      end\n    end\n  end\nend`,
    go: `func prim(graph Graph, start string) {\n  visited := make(map[string]bool)\n  pq := make(PriorityQueue, 0)\n  visited[start] = true\n  for _, edge := range graph[start] { heap.Push(&pq, edge) }\n  for pq.Len() > 0 {\n    edge := heap.Pop(&pq).(Edge)\n    if visited[edge.to] { continue }\n    visited[edge.to] = true\n    mst = append(mst, edge)\n    for _, nextEdge := range graph[edge.to] {\n      if !visited[nextEdge.to] { heap.Push(&pq, nextEdge) }\n    }\n  }\n}`
  },
  kruskal: {
    python: `def kruskal(graph):\n  uf = UnionFind(graph.nodes)\n  edges.sort(key=lambda x: x.weight)\n  mst = []\n  for edge in edges:\n    if uf.union(edge.u, edge.v):\n      mst.append(edge)\n      if len(mst) == len(graph.nodes) - 1: break\n  return mst`,
    java: `public void kruskal(Graph graph) {\n  UnionFind uf = new UnionFind(graph.nodes);\n  Collections.sort(edges);\n  List<Edge> mst = new ArrayList<>();\n  for (Edge edge : edges) {\n    if (uf.union(edge.u, edge.v)) {\n      mst.add(edge);\n      if (mst.size() == graph.nodes.size() - 1) break;\n    }\n  }\n}`,
    lua: `function kruskal(graph)\n  local uf = UnionFind:new(graph.nodes)\n  table.sort(edges, function(a, b) return a.weight < b.weight end)\n  local mst = {}\n  for _, edge in ipairs(edges) do\n    if uf:union(edge.u, edge.v) then\n      table.insert(mst, edge)\n      if #mst == #graph.nodes - 1 then break end\n    end\n  end\n  return mst\nend`,
    go: `func kruskal(graph Graph) {\n  uf := NewUnionFind(graph.nodes)\n  sort.Slice(edges, func(i, j int) bool { return edges[i].weight < edges[j].weight })\n  mst := make([]Edge, 0)\n  for _, edge := range edges {\n    if uf.Union(edge.u, edge.v) {\n      mst = append(mst, edge)\n      if len(mst) == len(graph.nodes)-1 { break }\n    }\n  }\n}`
  }
};

function runAlgorithm(req, res, next) {
  try {
    const data = algorithmService.runAlgorithm(req.body);
    const algoType = data.result.algorithm;
    res.json({
      ok: true,
      data: data,
      scripts: codeSnippets[algoType] || {}
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { runAlgorithm };