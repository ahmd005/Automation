<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SoftwareProject extends Model
{
    use HasFactory;

    /**
     * الحقول المسموح بتعبئتها جماعياً (Mass Assignment)
     * هاد ضروري عشان كود الـ Controller يقدر يخزن الـ JSON اللي جاي من الـ AI
     */
    protected $fillable = [
        'name',
        // بيانات Function Point (FP)
        'ei', 
        'eo', 
        'eq', 
        'ilf', 
        'eif',
        // بيانات Use Case Point (UCP)
        'uaw', 
        'uucw', 
        'tcf', 
        'ef',
        // نتائج الحسابات النهائية
        'final_fp',
        'final_ucp',
        'estimated_effort',
        'estimated_cost'
    ];

    /**
     * تحويل الأنواع (Casting) لضمان دقة الأرقام العشرية
     */
    protected $casts = [
        'tcf' => 'float',
        'ef' => 'float',
        'final_fp' => 'float',
        'final_ucp' => 'float',
        'estimated_effort' => 'float',
        'estimated_cost' => 'decimal:2',
    ];
}