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
    Schema::create('posts', function (Blueprint $table) {
        $table->id('id')->autoIncrement();
        $table->string('title', 300)->nullable(false);
        $table->text('content')->nullable();
        $table->string('url', 500)->nullable();
       $table->foreignId('user_id'); 
        $table->unsignedInteger('community_id')->nullable(false);
        $table->timestamp('created_at')->useCurrent();
        $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
        
        $table->index('user_id', 'idx_user');
        $table->index('community_id', 'idx_community');
        $table->index('created_at', 'idx_created_at');
        
        $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        $table->foreign('community_id')->references('id')->on('communities')->onDelete('cascade');
    });
}
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};