<?php

namespace App\Http\Controllers;

use App\Models\Node;
use App\Models\Connection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class NodeController extends Controller
{
    /**
     * Return all nodes and connections (graph).
     */
    public function index()
    {

      \Illuminate\Support\Facades\Log::info('تم استدعاء الأتمتة بنجاح من خلال الـ AI!؟؟؟؟؟');
        $nodes = Node::all();
        $connections = Connection::all();

        return response()->json([
            'nodes' => $nodes,
            'connections' => $connections,
        ]);
    }

    /**
     * Save the full graph (nodes + connections).
     * Expects JSON { nodes: [...], connections: [...] }
     */
    public function store(Request $request)
    {


      \Illuminate\Support\Facades\Log::info('تم استدعاء الأتمتة بنجاح من خلال الـ AI!"""""?????????????????؟');
        $payload = $request->only(['nodes', 'connections']);

        $nodes = $payload['nodes'] ?? [];
        $connections = $payload['connections'] ?? [];

        // TRUNCATE causes implicit commits in MySQL and cannot be run inside a transaction.
        // Disable FK checks temporarily and truncate outside the transaction.
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('connections')->truncate();
        DB::table('nodes')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        DB::transaction(function () use ($nodes, $connections) {
            $now = now();

            // Insert nodes preserving provided ids when present
            foreach ($nodes as $n) {
                $node = new Node();
                if (isset($n['id'])) {
                    // set id directly so frontend ids are preserved
                    $node->id = $n['id'];
                }
                $node->type = $n['type'] ?? 'Unknown';
                $node->x_pos = $n['x_pos'] ?? null;
                $node->y_pos = $n['y_pos'] ?? null;
                $node->data = $n['data'] ?? null;
                $node->created_at = $now;
                $node->updated_at = $now;
                $node->save();
            }

            // Insert connections
            foreach ($connections as $c) {
                $conn = new Connection();
                $conn->from_node_id = $c['from_node_id'] ?? ($c['from'] ?? null);
                $conn->to_node_id = $c['to_node_id'] ?? ($c['to'] ?? null);
                $conn->created_at = $now;
                $conn->updated_at = $now;
                $conn->save();
            }
        });

        return response()->json(['status' => 'ok']);
    }

    /**
     * Execute logic following the provided path.
     * Expects JSON { path: [node_id, node_id, ...] }
     * Returns { text: string|null, fontSize: int|null, color: string|null }
     */
    public function execute(Request $request)
    {

           \Illuminate\Support\Facades\Log::info('تم استدعاء الأتمتة بنجاح من خلال الـ AI!ccccccccccccccccc');


        $path = $request->input('path', []);

        if (!is_array($path) || empty($path)) {
            return response()->json(['error' => 'path must be a non-empty array of node ids'], 422);
        }

        $result = [
            'text' => null,
            'fontSize' => null,
            'color' => null,
        ];

        foreach ($path as $nodeId) {
            $node = Node::find($nodeId);
            if (!$node) continue;

            $type = $node->type;
            $data = $node->data ?? [];

            if ($type === 'Log') {
                // expect data.text
                if (isset($data['text'])) {
                    $result['text'] = $data['text'];
                }
            } elseif ($type === 'FontSize') {
                // expect data.size or data.fontSize
                if (isset($data['size'])) {
                    $result['fontSize'] = $data['size'];
                } elseif (isset($data['fontSize'])) {
                    $result['fontSize'] = $data['fontSize'];
                }
            } elseif ($type === 'Color') {
                // expect data.color
                if (isset($data['color'])) {
                    $result['color'] = $data['color'];
                }
            }
        }
    

        return response()->json($result);
    }

    /**
     * Return available node types with metadata (label, color, fields).
     */
    public function getNodeTypes()
    {
        $types = [
            [
                'type' => 'Log',
                'label' => 'Log',
                'color' => '#6c757d',
                'fields' => [
                    ['name' => 'text', 'type' => 'string', 'label' => 'Text']
                ]
            ],
            [
                'type' => 'FontSize',
                'label' => 'Font Size',
                'color' => '#0d6efd',
                'fields' => [
                    ['name' => 'size', 'type' => 'integer', 'label' => 'Size']
                ]
            ],
            [
                'type' => 'Color',
                'label' => 'Color',
                'color' => '#198754',
                'fields' => [
                    ['name' => 'color', 'type' => 'string', 'label' => 'Color']
                ]
            ],
        ];

        return response()->json(['nodeTypes' => $types]);
    }
}
