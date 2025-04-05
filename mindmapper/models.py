from django.db import models
from django.utils import timezone

class MindMap(models.Model):
    question = models.TextField()
    ai_response = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.question[:50]

class UserUsage(models.Model):
    session_key = models.CharField(max_length=40, unique=True)
    date = models.DateField(auto_now_add=True)
    count = models.PositiveIntegerField(default=0)

    @classmethod
    def increment_usage(cls, session_key):
        today = timezone.now().date()
        obj, created = cls.objects.get_or_create(
            session_key=session_key,
            date=today,
            defaults={'count': 1}
        )
        if not created:
            obj.count = models.F('count') + 1
            obj.save()
        return obj.count
