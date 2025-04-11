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
    Schema::create('communities', function (Blueprint $table) {
        $table->unsignedInteger('id')->autoIncrement();
        $table->string('name', 50)->unique()->nullable(false);
        $table->text('description')->nullable();
        $table->text('rules')->nullable();
        $table->boolean('is_private')->default(false);
        $table->foreignId('creator_id')->nullable(false);
        $table->timestamp('created_at')->useCurrent();
        $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
        
        $table->index('name', 'idx_name');
        
        $table->foreign('creator_id')->references('id')->on('users')->onDelete('cascade');
    });
}
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('communities');
    }
};