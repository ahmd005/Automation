<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <title>تقرير تقدير مشروع - {{ $project->name }}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&display=swap');
        body { font-family: 'Cairo', sans-serif; }
        @media print {
            .no-print { display: none; }
            body { background: white; padding: 0; }
        }
    </style>
</head>
<body class="bg-gray-50 p-6">
    <div class="max-w-4xl mx-auto bg-white shadow-xl p-8 rounded-lg border border-gray-200">
        
        <div class="flex justify-between items-center border-b-2 border-blue-600 pb-4 mb-8">
            <div>
                <h1 class="text-2xl font-bold text-blue-900">تقرير التحليل الفني وتقدير الكلفة</h1>
                <p class="text-sm text-gray-500">تم توليد هذا التقرير عبر نظام الشات بوت الذكي</p>
            </div>
            <button onclick="window.print()" class="no-print bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                تحميل PDF / طباعة
            </button>
        </div>

        <div class="grid grid-cols-2 gap-6 mb-8 bg-blue-50 p-4 rounded-md">
            <div><span class="font-bold text-blue-800">رقم المشروع:</span> #{{ $project->id }}</div>
            <div><span class="font-bold text-blue-800">تاريخ التقرير:</span> {{ $project->created_at->format('Y-m-d') }}</div>
        </div>

        <div class="mb-10">
            <h2 class="text-lg font-bold mb-4 text-gray-700">تفاصيل المتغيرات المستخلصة (Inputs):</h2>
            <table class="w-full text-right border-collapse">
                <thead>
                    <tr class="bg-gray-100">
                        <th class="p-3 border">المعيار (Metric)</th>
                        <th class="p-3 border text-center">القيمة</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td class="p-3 border">المدخلات الخارجية (EI)</td><td class="p-3 border text-center">{{ $project->ei }}</td></tr>
                    <tr><td class="p-3 border">المخرجات الخارجية (EO)</td><td class="p-3 border text-center">{{ $project->eo }}</td></tr>
                    <tr><td class="p-3 border">وزن الفاعلين (UAW)</td><td class="p-3 border text-center">{{ $project->uaw }}</td></tr>
                    <tr><td class="p-3 border">وزن حالات الاستخدام (UUCW)</td><td class="p-3 border text-center">{{ $project->uucw }}</td></tr>
                </tbody>
            </table>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div class="p-4 border-2 border-green-200 rounded-lg bg-green-50">
                <div class="text-sm text-green-700 font-bold">نقاط الوظيفة (FP)</div>
                <div class="text-2xl font-black">{{ number_format($project->final_fp, 2) }}</div>
            </div>
            <div class="p-4 border-2 border-purple-200 rounded-lg bg-purple-50">
                <div class="text-sm text-purple-700 font-bold">نقاط حالات الاستخدام (UCP)</div>
                <div class="text-2xl font-black">{{ number_format($project->final_ucp, 2) }}</div>
            </div>
            <div class="p-4 border-2 border-orange-200 rounded-lg bg-orange-50">
                <div class="text-sm text-orange-700 font-bold">الجهد المقدر (Effort)</div>
                <div class="text-2xl font-black">{{ number_format($project->estimated_effort, 0) }} ساعة عمل</div>
            </div>
            <div class="p-4 border-2 border-red-200 rounded-lg bg-red-50">
                <div class="text-sm text-red-700 font-bold">التكلفة الإجمالية التقديرية</div>
                <div class="text-2xl font-black text-red-600">${{ number_format($project->estimated_cost, 2) }}</div>
            </div>
        </div>

        <div class="text-center text-xs text-gray-400 mt-10 italic">
            جميع الحسابات تمت بناءً على معايير FP و UCP المعتمدة برمجياً.
        </div>
    </div>
</body>
</html>