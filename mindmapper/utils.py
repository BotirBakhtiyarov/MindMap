import json
from openai import OpenAI
from django.conf import settings


def generate_mind_map_data(question):
    client = OpenAI(
        api_key=settings.DEEPSEEK_API_KEY,
        base_url="https://api.deepseek.com"
    )

    system_prompt = """Create a radial mind map structure from the user's question. 
                        Return VALID JSON with this structure:
                        {
                            "nodes": [
                                {"id": 0, "label": "Central Idea", "group": "center"},
                                {"id": 1, "label": "Main Branch 1", "group": "main"},
                                {"id": 2, "label": "Sub Branch 1.1", "group": "sub"},
                                ...
                            ],
                            "edges": [
                                {"from": 0, "to": 1},
                                {"from": 1, "to": 2},
                                ...
                            ]
                        }
                        Make it visually radial with multiple branches from the center. 
                        Include up to 2 levels of branches."""

    try:
        response = client.chat.completions.create(
            model="deepseek-chat",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": question},
            ],
            stream=False
        )

        # Clean and parse the response
        raw_content = response.choices[0].message.content
        json_str = raw_content.strip().replace('```json', '').replace('```', '')
        return json.loads(json_str)

    except Exception as e:
        raise RuntimeError(f"AI Processing Error: {str(e)}")