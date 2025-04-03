import json
from openai import OpenAI
from django.conf import settings


def generate_mind_map_data(question):
    client = OpenAI(
        api_key=settings.DEEPSEEK_API_KEY,
        base_url="https://api.deepseek.com"
    )

    system_prompt = """Create a mind map with explanations. Return JSON format:
    {
        "nodes": [
            {
                "id": 1, 
                "label": "Main Topic",
                "group": "main",
                "explanation": "Brief description..."
            },
            ...
        ],
        "edges": [{"from": 1, "to": 2}]
    }
    Include 5-6 sentence explanations for each node. Make explanations educational but concise."""

    response = client.chat.completions.create(
        model="deepseek-chat",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": question},
        ],
        stream=False
    )

    raw_content = response.choices[0].message.content
    json_str = raw_content.strip().replace('```json', '').replace('```', '')
    data = json.loads(json_str)

    # Add default explanation if missing
    for node in data['nodes']:
        node['explanation'] = node.get('explanation', 'No explanation available')

    return data