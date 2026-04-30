<?php

use App\Http\Controllers\AiAgentController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\NodeController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Visual programming API endpoints
Route::get('load-graph', [NodeController::class, 'index']);
Route::post('save-graph', [NodeController::class, 'store']);
Route::post('execute-logic', [NodeController::class, 'execute']);
Route::get('node-types', [NodeController::class, 'getNodeTypes']);

Route::post('/ai/chat', [AiAgentController::class, 'handleChat']);

Route::get('/check-models', [AiAgentController::class, 'listModels']);
