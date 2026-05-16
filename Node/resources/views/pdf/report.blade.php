<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <title>تقرير التحليل الفني المتكامل - {{ $project->name }}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&display=swap');
        body { font-family: 'Cairo', sans-serif; background-color: #f3f4f6; }
        @media print {
            .no-print { display: none; }
            body { background: white; padding: 0; }
            .page-break { page-break-before: always; }
        }
    </style>
</head>
<body class="p-4 md:p-10">

    <div class="max-w-4xl mx-auto bg-white shadow-2xl p-8 rounded-xl border border-gray-200">
        
        <div class="flex justify-between items-center border-b-4 border-blue-600 pb-6 mb-8">
            <div>
                <h1 class="text-3xl font-bold text-blue-900">تقرير تقدير البرمجيات التحليلي</h1>
                <p class="text-gray-500 mt-1">بناءً على معايير IFPUG و Use Case Points</p>
            </div>
            <button onclick="window.print()" class="no-print bg-blue-600 text-white px-5 py-2 rounded-lg font-bold hover:bg-blue-700 shadow-lg transition">
                تصدير PDF / طباعة
            </button>
        </div>

        <div class="grid grid-cols-2 gap-4 mb-8 bg-gray-50 p-4 rounded-lg border-r-4 border-blue-600">
            <div><span class="font-bold text-blue-800">اسم المشروع:</span> {{ $project->name }}</div>
            <div class="text-left"><span class="font-bold text-blue-800">تاريخ التحليل:</span> {{ $project->created_at->format('Y-m-d') }}</div>
        </div>

        <div class="mb-10">
            <h2 class="text-xl font-bold mb-2 text-blue-700 flex items-center">
                <span class="bg-blue-700 text-white rounded-full w-8 h-8 flex items-center justify-center ml-2 text-sm">1</span>
                تحليل نقاط الوظيفة (FP Analysis)
            </h2>
            
            <div class="mb-4">
                <h3 class="text-sm font-bold text-gray-600 mb-1">المعادلة الحسابية المعتمدة لنقاط الوظيفة:</h3>
                <div class="bg-blue-50 text-blue-900 p-3 rounded-md font-mono text-sm text-center border border-blue-200">
                    FP = CFP × (0.65 + 0.01 × RCAF)
                </div>
            </div>

            <table class="w-full text-right border-collapse rounded-lg overflow-hidden shadow-sm">
                <thead>
                    <tr class="bg-blue-600 text-white">
                        <th class="p-3 border-b">المكون التقني (Component)</th>
                        <th class="p-3 border-b text-center">العدد المستخلص</th>
                    </tr>
                </thead>
                <tbody class="text-gray-700">
                    <tr class="hover:bg-gray-50"><td class="p-3 border-b">المدخلات الخارجية (External Inputs - EI)</td><td class="p-3 border-b text-center font-bold">{{ $project->ei }}</td></tr>
                    <tr class="hover:bg-gray-50"><td class="p-3 border-b">المخرجات الخارجية (External Outputs - EO)</td><td class="p-3 border-b text-center font-bold">{{ $project->eo }}</td></tr>
                    <tr class="hover:bg-gray-50"><td class="p-3 border-b">الاستعلامات الخارجية (External Inquiries - EQ)</td><td class="p-3 border-b text-center font-bold">{{ $project->eq }}</td></tr>
                    <tr class="hover:bg-gray-50"><td class="p-3 border-b">الملفات المنطقية الداخلية (Internal Logical Files - ILF)</td><td class="p-3 border-b text-center font-bold">{{ $project->ilf }}</td></tr>
                    <tr class="hover:bg-gray-50"><td class="p-3 border-b">ملفات الواجهة الخارجية (External Interface Files - EIF)</td><td class="p-3 border-b text-center font-bold">{{ $project->eif }}</td></tr>
                    <tr class="bg-blue-50 font-bold text-blue-900">
                        <td class="p-3 border-b italic">إجمالي نقاط الوظيفة النهائية (Final FP)</td>
                        <td class="p-3 border-b text-center text-xl">{{ number_format($project->final_fp, 2) }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="mb-10 page-break">
            <h2 class="text-xl font-bold mb-2 text-purple-700 flex items-center">
                <span class="bg-purple-700 text-white rounded-full w-8 h-8 flex items-center justify-center ml-2 text-sm">2</span>
                تحليل نقاط حالات الاستخدام (UCP Analysis)
            </h2>

            <div class="mb-4">
                <h3 class="text-sm font-bold text-gray-600 mb-1">المعادلة الحسابية المعتمدة لـ UCP الجهد زمني:</h3>
                <div class="bg-purple-50 text-purple-900 p-3 rounded-md font-mono text-sm text-center border border-purple-200">
                    UUCP = UAW + UUCW <br>
                    UCP = UUCP × TCF × ECF
                </div>
            </div>

            <table class="w-full text-right border-collapse rounded-lg overflow-hidden shadow-sm">
                <thead>
                    <tr class="bg-purple-600 text-white">
                        <th class="p-3 border-b">المعيار (UCP Metric)</th>
                        <th class="p-3 border-b text-center">الوزن / القيمة</th>
                    </tr>
                </thead>
                <tbody class="text-gray-700">
                    <tr class="hover:bg-gray-50"><td class="p-3 border-b">وزن الفاعلين غير المعدل (UAW)</td><td class="p-3 border-b text-center font-bold">{{ $project->uaw }}</td></tr>
                    <tr class="hover:bg-gray-50"><td class="p-3 border-b">وزن حالات الاستخدام غير المعدل (UUCW)</td><td class="p-3 border-b text-center font-bold">{{ $project->uucw }}</td></tr>
                    <tr class="hover:bg-gray-50"><td class="p-3 border-b">معامل التعقيد التقني (TCF)</td><td class="p-3 border-b text-center font-bold">{{ $project->tcf }}</td></tr>
                    <tr class="hover:bg-gray-50"><td class="p-3 border-b">المعامل البيئي (EF)</td><td class="p-3 border-b text-center font-bold">{{ $project->ef }}</td></tr>
                    <tr class="bg-purple-50 font-bold text-purple-900">
                        <td class="p-3 border-b italic">إجمالي نقاط حالات الاستخدام النهائية (Final UCP)</td>
                        <td class="p-3 border-b text-center text-xl">{{ number_format($project->final_ucp, 2) }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div class="bg-orange-600 text-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition">
                <h3 class="text-lg font-bold opacity-80 mb-2">الجهد الزمني المتوقع</h3>
                <div class="text-3xl font-black">{{ number_format($project->estimated_effort, 0) }} ساعة عمل</div>
                <p class="text-xs mt-2 italic">* محسوب بناءً على معامل إنتاجية (PF = 12 ساعة/نقطة) للمشاريع الطلابية.</p>
            </div>
            <div class="bg-emerald-600 text-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition">
                <h3 class="text-lg font-bold opacity-80 mb-2">التكلفة المالية التقديرية</h3>
                <div class="text-3xl font-black">${{ number_format($project->estimated_cost, 2) }}</div>
                <p class="text-xs mt-2 italic">* تم الاحتساب بناءً على متوسط السعر القياسي المحسن محلياً لساعة التطوير.</p>
            </div>
        </div>

        <div class="mt-12 text-center border-t pt-6 text-gray-400 text-sm">
            <p>جميع الحسابات والمعادلات المذكورة أعلاه تتوافق تماماً مع المعايير  الأكاديمية .</p>
            <p class="mt-1 font-bold">تم التوليد بواسطة المحلل الذكي لتقدير المشاريع البرمجية</p>
        </div>
    </div>

</body>
</html>