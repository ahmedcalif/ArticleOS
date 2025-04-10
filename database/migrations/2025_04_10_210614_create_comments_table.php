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
    Schema::create('comments', function (Blueprint $table) {
        $table->id('id')->autoIncrement();
        $table->text('content')->nullable(false);
        $table->foreignId('user_id')->nullable(false);
        $table->foreignId('post_id')->nullable(false);
        $table->foreignId('parent_id')->nullable();
        $table->timestamp('created_at')->useCurrent();
        $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
        
        $table->index('user_id', 'idx_user');
        $table->index('post_id', 'idx_post');
        $table->index('parent_id', 'idx_parent');
        
        $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        $table->foreign('post_id')->references('id')->on('posts')->onDelete('cascade');
        $table->foreign('parent_id')->references('id')->on('comments')->onDelete('set null');
    });
}
 

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('comments');
    }
};