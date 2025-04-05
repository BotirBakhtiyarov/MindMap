from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from .models import MindMap, UserUsage
from .utils import generate_mind_map_data
from django.views.decorators.http import require_POST
from django.utils.html import escape

def home(request):
    return render(request, 'mindmapper/home.html')


@csrf_exempt
def generate_mindmap(request):
    if request.method == 'POST':
        try:
            # Check usage after middleware validation
            UserUsage.increment_usage(request.session.session_key)

            # Existing processing logic
            question = request.POST.get('question', '').strip()
            ai_response = generate_mind_map_data(question)
            MindMap.objects.create(question=question, ai_response=ai_response)

            return JsonResponse(ai_response)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)