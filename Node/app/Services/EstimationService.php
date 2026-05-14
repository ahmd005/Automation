<?php
namespace App\Services;

class EstimationService
{
    public function calculateFP($data) {
        // أوزان بسيطة كمثال (فيك تطورها لتعقيد أكتر)
        $total = ($data['ei'] * 4) + ($data['eo'] * 5) + ($data['eq'] * 4) + ($data['ilf'] * 10) + ($data['eif'] * 7);
        $vaf = 0.65 + (0.01 * 35); // القيمة الافتراضية لعوامل التعقيد (35 كموسط)
        return $total * $vaf;
    }

    public function calculateUCP($data) {
        $uucp = $data['uaw'] + $data['uucw'];
        return $uucp * $data['tcf'] * $data['ef'];
    }

    public function estimateEffort($ucp) {
        return $ucp * 20; // 20 ساعة عمل لكل نقطة (معيار عام)
    }
}