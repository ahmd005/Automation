<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\Node; 
use App\Http\Controllers\NodeController;

class AiAgentController extends Controller
{
    public function handleChat(Request $request)
    {
        $userMessage = $request->input('prompt');
        if (empty($userMessage)) return response()->json(['error' => 'الرسالة فارغة'], 400);

        try {
            $nodesList = Node::all(['id', 'type', 'data'])->toJson();
            $apiKey = config('services.gemini.api_key');
       //     $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" . $apiKey;

              $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=" . $apiKey;

            // أضفت جملة صارمة في التعليمات لمنع الدمج من المصدر أيضاً
            $systemInstruction = "أنت مدير نظام Visual Programming. النودز الحالية: $nodesList.
            قواعد الرد:
            1. للتعديل: أرسل [{'action': 'UPDATE_NODE', 'id': ..., 'data': {...}}].
            2. للتنفيذ: أرسل {'action': 'RUN_AUTOMATION', 'path': [ids]}.
            هام: إذا طلب المستخدم التنفيذ، أرسل RUN_AUTOMATION فقط ولا تدمج معه أي تحديث نود.";

            $response = Http::withoutVerifying()->post($url, [
                "contents" => [["parts" => [["text" => $systemInstruction . "\nالمستخدم: " . $userMessage]]]]
            ]);

            $result = $response->json();
            $aiRawResponse = $result['candidates'][0]['content']['parts'][0]['text'] ?? '';

            $cleanResponse = trim(preg_replace('/```json|```/', '', $aiRawResponse));
            $jsonReady = str_replace("'", '"', $cleanResponse);
            $commands = json_decode($jsonReady, true);

            if (json_last_error() === JSON_ERROR_NONE && is_array($commands)) {
                $commandList = isset($commands[0]) ? $commands : [$commands];
                $nodeController = app(NodeController::class);
                $executionLog = [];

                // --- المرحلة الأولى: فحص إذا كان هناك أمر تنفيذ (أولوية قصوى) ---
                foreach ($commandList as $cmd) {
                    $action = $cmd['action'] ?? $cmd['command'] ?? null;

                    if ($action === 'RUN_AUTOMATION') {
                        $fakeRequest = new Request();
                        $fakeRequest->replace(['path' => $cmd['path'] ?? []]);
                        
                        // تنفيذ الأتمتة
                        $nodeController->execute($fakeRequest);

                        // الحجر الزاوي: نرجع الرد فوراً ونوقف معالجة أي UPDATE_NODE تالية
                        return response()->json([
                            'type' => 'command',
                            'message' => 'تم تشغيل الأتمتة بنجاح.',
                            'execution_log' => ['تم تنفيذ المسار البرمجي المختار.'],
                            'status' => 'Success'
                        ]);
                    }
                }

                // --- المرحلة الثانية: التعديل (لن تصله العملية إذا وجد RUN_AUTOMATION فوق) ---
                $executedUpdate = false;
                foreach ($commandList as $cmd) {
                    $action = $cmd['action'] ?? $cmd['command'] ?? null;
                    if ($action === 'UPDATE_NODE' && isset($cmd['id'])) {
                        $node = Node::find($cmd['id']);
                        if ($node) {
                            $aiData = $cmd['data'] ?? [];
                            $filteredData = [];

                            if ($node->type === 'Log' && isset($aiData['text'])) {
                                $filteredData['text'] = $aiData['text'];
                            } elseif ($node->type === 'FontSize') {
                                $filteredData['size'] = $aiData['size'] ?? $aiData['fontSize'] ?? null;
                            } elseif ($node->type === 'Color' && isset($aiData['color'])) {
                                $filteredData['color'] = $aiData['color'];
                            }

                            if (!empty($filteredData)) {
                                $oldData = is_array($node->data) ? $node->data : json_decode($node->data, true);
                                $node->data = array_merge($oldData ?? [], $filteredData);
                                $node->save();
                                $executionLog[] = "تم تحديث النود {$node->id} بنجاح.";
                                $executedUpdate = true;
                            }
                        }
                    }
                }

                if ($executedUpdate) {
                    return response()->json([
                        'type' => 'command',
                        'message' => 'تمت عملية التحديث بنجاح.',
                        'execution_log' => $executionLog,
                        'status' => 'Success'
                    ]);
                }
            }

            return response()->json(['type' => 'chat', 'message' => $aiRawResponse]);

        } catch (\Exception $e) {
            return response()->json(['error' => 'حدث خطأ', 'details' => $e->getMessage()], 500);
        }
    }
}