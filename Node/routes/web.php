<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});


use App\Models\SoftwareProject;
use Illuminate\Http\Request;




// routes/web.php


Route::get('/report/{id}', function ($id) {
    // جلب بيانات المشروع من قاعدة البيانات باستخدام الـ ID
    $project = SoftwareProject::findOrFail($id);
    
    // إرسال البيانات لملف الـ Blade
    return view('pdf.report', compact('project'));
})->name('report.show');
