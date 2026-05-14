<?php

namespace App\Http\Controllers;

use App\Models\SoftwareProject;
use App\Services\EstimationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class SoftwareAnalystController extends Controller
{
    protected $estimationService;

    public function __construct(EstimationService $service)
    {
        $this->estimationService = $service;
    }

    /**
     * الدالة الرئيسية لاستقبال رسائل الشات
     */
    public function chat(Request $request)
    {
        $userMessage = $request->input('message');
        // استقبال تاريخ الحوار من الفرونت إند (مصفوفة تحتوي على الرسائل السابقة)
        $history = $request->input('history', []); 

        // 1. طلب الرد من Gemini (إرسال الرسالة الحالية مع التاريخ)
        $aiResponse = $this->askGemini($userMessage, $history);

        // 2. التحقق مما إذا كان الـ AI أرسل الـ JSON النهائي (اكتمال الحوار)
        if (str_contains($aiResponse, '"complete": true')) {
            return $this->processFinalData($aiResponse);
        }

        // 3. إذا لم يكتمل، نرجع رد الـ AI كرسالة عادية للمستخدم
        return response()->json([
            'reply' => $aiResponse,
            'status' => 'chatting'
        ]);
    }

    /**
     * الدالة الفعلية التي تتصل بـ Google API
     */
    private function askGemini($message, $history)
    {
        $apiKey = env('GEMINI_API_KEY');
        
        // التعليمات البرمجية الأساسية (System Instruction)
        $systemPrompt = "أنت محلل أنظمة برمجية خبير. وظيفتك إجراء حوار لجمع بيانات حساب FP و UCP.
        اسأل عن عدد المدخلات والمخرجات والملفات، وعن الـ Actors والـ Use Cases.
        لا تطرح كل الأسئلة معاً. عندما تكتمل البيانات، أرسل حصراً JSON بالصيغة التالية:
        {\"complete\": true, \"data\": {\"ei\": 5, \"eo\": 3, \"eq\": 2, \"ilf\": 2, \"eif\": 1, \"uaw\": 10, \"uucw\": 30, \"tcf\": 0.9, \"ef\": 1.1}}";

        // بناء مصفوفة المحتويات (Contents) لتشمل الـ System Prompt + التاريخ + الرسالة الحالية
        $contents = [];

        // إضافة التعليمات الأساسية كأول رسالة من المستخدم (لإرشاد النموذج)
        $contents[] = [
            'role' => 'user',
            'parts' => [['text' => $systemPrompt]]
        ];
        
        // إضافة تأكيد وهمي من الـ "model" لضمان فهم التعليمات (اختياري لتحسين الاستجابة)
        $contents[] = [
            'role' => 'model',
            'parts' => [['text' => 'فهمت دوري تماماً. سأبدأ الآن بجمع المعلومات من المستخدم تدريجياً.']]
        ];

        // دمج رسائل التاريخ السابقة (History) إذا كانت موجودة
        foreach ($history as $prevMessage) {
            $contents[] = [
                'role' => $prevMessage['role'], // 'user' or 'model'
                'parts' => [['text' => $prevMessage['message']]]
            ];
        }

        // إضافة رسالة المستخدم الحالية
        $contents[] = [
            'role' => 'user',
            'parts' => [['text' => $message]]
        ];

        // إرسال الطلب عبر Http Client
      //  $response = Http::post("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={$apiKey}", [
       $response = Http::post("https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key={$apiKey}", [
            'contents' => $contents
        ]);

        if ($response->failed()) {
            return "عذراً، حدث خطأ في الاتصال بالذكاء الاصطناعي: " . $response->body();
        }

        return $response->json('candidates.0.content.parts.0.text');
    }

    /**
     * معالجة البيانات النهائية وحسابها وحفظها
     */
    /**
     * معالجة البيانات النهائية وحسابها وحفظها وتوليد رابط التقرير
     */
    private function processFinalData($aiResponse)
    {
        // استخراج الـ JSON من داخل النص (باستخدام Regular Expression) لضمان الدقة حتى لو أضاف الـ AI نصاً جانبياً
        preg_match('/\{.*\}/s', $aiResponse, $matches);
        
        if (isset($matches[0])) {
            $jsonData = json_decode($matches[0], true);

            if ($jsonData && isset($jsonData['data'])) {
                $data = $jsonData['data'];

                // 1. استخدام السيرفس لحساب النتائج الرياضية (FP & UCP)
                $fp = $this->estimationService->calculateFP($data);
                $ucp = $this->estimationService->calculateUCP($data);
                $effort = $this->estimationService->estimateEffort($ucp);

                // 2. حفظ المشروع في الداتابيز (تخزين منظم كما هو مطلوب في الوظيفة)
                $project = SoftwareProject::create(array_merge($data, [
                    'name' => 'مشروع مقدر آلياً - ' . date('Y-m-d H:i'),
                    'final_fp' => $fp,
                    'final_ucp' => $ucp,
                    'estimated_effort' => $effort,
                    'estimated_cost' => $effort * 50 // افترضنا كلفة الساعة 50$
                ]));

                // 3. إرسال الرد النهائي للفرونت إند مع رابط التقرير القابل للطباعة
                return response()->json([
                    'status' => 'completed',
                    'project_id' => $project->id,
                    'report_url' => url('/report/' . $project->id), // هذا الرابط يوجه لصفحة الـ Blade في الويب
                    'message' => 'تم استخراج البيانات وحساب التقديرات بنجاح!',
                    'results' => $project
                ]);
            }
        }

        // في حال فشل الـ AI في إرسال JSON صالح
        return response()->json(['error' => 'فشل في تحليل البيانات النهائية المرسلة من AI'], 500);
    }
}