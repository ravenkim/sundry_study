from django.contrib import admin
from .models import Post

# Register your models here.

# admin.site.register(Post)


@admin.register(Post)  # Wrapping
class PostAdmin(admin.ModelAdmin):
    list_display = ['id', 'message',
                    'message_length', 'created_at', 'updated_at']
    list_display_links = ['message']
