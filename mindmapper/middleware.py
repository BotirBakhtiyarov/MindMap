from django.http import JsonResponse
from django.utils import timezone
from .models import UserUsage

class UsageMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.path == '/generate/' and request.method == 'POST':
            session_key = request.session.session_key
            if not session_key:
                request.session.save()
                session_key = request.session.session_key

            today = timezone.now().date()
            try:
                usage = UserUsage.objects.get(
                    session_key=session_key,
                    date=today
                )
                if usage.count >= 2:
                    return JsonResponse(
                        {'error': 'Daily limit exceeded (2 requests/day)'},
                        status=429
                    )
            except UserUsage.DoesNotExist:
                pass

        response = self.get_response(request)
        return response