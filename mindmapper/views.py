from django.shortcuts import render
from django.http import JsonResponse
from .models import MindMap
from .utils import generate_mind_map_data
from django.views.decorators.http import require_POST
from django.utils.html import escape

def home(request):
    return render(request, 'mindmapper/home.html')


@require_POST
def generate_mindmap(request):
    try:
        question = escape(request.POST.get('question', '').strip())
        if len(question) > 500:
            return JsonResponse({'error': 'Question too long (max 500 chars)'}, status=400)

        ai_response = generate_mind_map_data(question)
        MindMap.objects.create(question=question, ai_response=ai_response)

        return JsonResponse(ai_response)

    except Exception as e:
        return JsonResponse({'error': 'Internal server error'}, status=500)