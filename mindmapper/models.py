from django.db import models

class MindMap(models.Model):
    question = models.TextField()
    ai_response = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.question[:50]