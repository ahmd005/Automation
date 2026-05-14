<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
   public function up(): void
{
    Schema::create('software_projects', function (Blueprint $table) {
        $table->id();
        $table->string('name')->nullable();
        // بيانات FP
        $table->integer('ei')->default(0); // External Inputs
        $table->integer('eo')->default(0); // External Outputs
        $table->integer('eq')->default(0); // External Inquiries
        $table->integer('ilf')->default(0); // Internal Logical Files
        $table->integer('eif')->default(0); // External Interface Files
        // بيانات UCP
        $table->integer('uaw')->default(0); // Unadjusted Actor Weight
        $table->integer('uucw')->default(0); // Unadjusted Use Case Weight
        $table->float('tcf')->default(1.0); // Technical Complexity Factor
        $table->float('ef')->default(1.0);  // Environmental Factor
        // النتائج النهائية
        $table->float('final_fp')->nullable();
        $table->float('final_ucp')->nullable();
        $table->float('estimated_effort')->nullable();
        $table->decimal('estimated_cost', 15, 2)->nullable();
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('software_projects');
    }
};
