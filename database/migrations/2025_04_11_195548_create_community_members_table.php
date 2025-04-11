<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    { 
        
        Schema::create('community_members', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('community_id');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->boolean('is_moderator')->default(false);
            $table->timestamps();
            
            $table->unique(['community_id', 'user_id']);
            
            $table->foreign('community_id')
                  ->references('id')
                  ->on('communities')
                  ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('community_members');
        
        Schema::table('communities', function (Blueprint $table) {
            $table->dropColumn(['rules', 'is_private']);
        });
    }
};