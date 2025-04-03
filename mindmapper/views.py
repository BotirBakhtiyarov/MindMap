from django.shortcuts import render
from django.http import JsonResponse
from .models import MindMap
from .utils import generate_mind_map_data
from django.views.decorators.csrf import csrf_exempt
import json

def home(request):
    return render(request, 'mindmapper/home.html')


@csrf_exempt
def generate_mindmap(request):
    if request.method == 'POST':
        try:
            question = request.POST.get('question', '').strip()
            if not question:
                return JsonResponse({'error': 'Question is required'}, status=400)

            ai_response = generate_mind_map_data(question)
            MindMap.objects.create(question=question, ai_response=ai_response)

            return JsonResponse(ai_response)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)