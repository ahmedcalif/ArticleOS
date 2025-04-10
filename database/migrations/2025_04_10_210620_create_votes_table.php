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
    Schema::create('votes', function (Blueprint $table) {
        $table->unsignedInteger('id')->autoIncrement();
        $table->foreignId('user_id')->nullable(false);
        $table->unsignedInteger('votable_id')->nullable(false);
        $table->enum('votable_type', ['post', 'comment'])->nullable(false);
        $table->tinyInteger('value')->nullable(false); 
        $table->timestamp('created_at')->useCurrent();
        
        $table->unique(['user_id', 'votable_id', 'votable_type'], 'user_votable');
        
        $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
    });
} 
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('votes');
    }
};